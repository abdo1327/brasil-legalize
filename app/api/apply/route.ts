import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import crypto from 'crypto';
import { Resend } from 'resend';

// Lazy initialization of Resend to avoid build-time errors
let resend: Resend | null = null;
function getResend(): Resend | null {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

async function generateClientId(): Promise<string> {
  const year = new Date().getFullYear();
  const result = await pool.query(
    'SELECT COUNT(*) as count FROM clients WHERE client_id LIKE $1',
    [`CLT-${year}-%`]
  );
  const count = parseInt(result.rows[0].count) + 1;
  return `CLT-${year}-${String(count).padStart(5, '0')}`;
}

async function generateApplicationId(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const result = await pool.query(
    'SELECT COUNT(*) as count FROM applications WHERE application_id LIKE $1',
    [`APP-${year}${month}-%`]
  );
  const count = parseInt(result.rows[0].count) + 1;
  return `APP-${year}${month}-${String(count).padStart(4, '0')}`;
}

// Simple email templates
const emailTemplates = {
  en: {
    subject: 'Your Application Has Been Received - Brasil Legalize',
    body: (name: string, applicationId: string) => `
Dear ${name},

Thank you for submitting your application to Brasil Legalize!

Your application reference number is: ${applicationId}

Our team is reviewing your information and will contact you within 24 hours to discuss the next steps.

In the meantime, if you have any questions, feel free to reach out to us via WhatsApp or email.

Best regards,
Brasil Legalize Team
    `.trim(),
  },
  ar: {
    subject: 'تم استلام طلبك - برازيل ليجالايز',
    body: (name: string, applicationId: string) => `
عزيزي/عزيزتي ${name}،

شكراً لتقديم طلبك إلى برازيل ليجالايز!

رقم المرجع الخاص بطلبك هو: ${applicationId}

فريقنا يراجع معلوماتك وسيتواصل معك خلال 24 ساعة لمناقشة الخطوات التالية.

في هذه الأثناء، إذا كان لديك أي استفسارات، لا تتردد في التواصل معنا عبر الواتساب أو البريد الإلكتروني.

مع أطيب التحيات،
فريق برازيل ليجالايز
    `.trim(),
  },
  es: {
    subject: 'Su Solicitud Ha Sido Recibida - Brasil Legalize',
    body: (name: string, applicationId: string) => `
Estimado/a ${name},

¡Gracias por enviar su solicitud a Brasil Legalize!

Su número de referencia de solicitud es: ${applicationId}

Nuestro equipo está revisando su información y se comunicará con usted dentro de las 24 horas para discutir los próximos pasos.

Mientras tanto, si tiene alguna pregunta, no dude en contactarnos por WhatsApp o correo electrónico.

Atentamente,
Equipo Brasil Legalize
    `.trim(),
  },
  'pt-br': {
    subject: 'Sua Solicitação Foi Recebida - Brasil Legalize',
    body: (name: string, applicationId: string) => `
Prezado(a) ${name},

Obrigado por enviar sua solicitação para a Brasil Legalize!

Seu número de referência é: ${applicationId}

Nossa equipe está analisando suas informações e entrará em contato com você em até 24 horas para discutir os próximos passos.

Enquanto isso, se tiver alguma dúvida, não hesite em nos contactar via WhatsApp ou e-mail.

Atenciosamente,
Equipe Brasil Legalize
    `.trim(),
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      whatsapp,
      country,
      city,
      service_type,
      message,
      family_adults,
      family_children,
      expected_travel_date,
      consent,
      locale = 'en',
      source = 'website_application',
    } = body;

    // Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email is required' }, { status: 400 });
    }
    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }
    if (!service_type) {
      return NextResponse.json({ success: false, error: 'Service type is required' }, { status: 400 });
    }
    if (!consent) {
      return NextResponse.json({ success: false, error: 'Consent is required' }, { status: 400 });
    }

    // Check if client with email already exists
    const existingClient = await pool.query(
      'SELECT id, client_id FROM clients WHERE LOWER(email) = LOWER($1) AND (archived = false OR archived IS NULL)',
      [email]
    );

    let clientId: string;
    let clientDbId: number;

    const now = new Date();

    if (existingClient.rows.length > 0) {
      // Use existing client
      clientDbId = existingClient.rows[0].id;
      clientId = existingClient.rows[0].client_id;
    } else {
      // Create new client
      clientId = await generateClientId();

      const clientResult = await pool.query(`
        INSERT INTO clients (
          client_id, name, email, phone, whatsapp, city, country,
          locale, service_type, family_adults, family_children,
          expected_travel_date, source, status, archived, created_at, updated_at, notes
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
        ) RETURNING id
      `, [
        clientId,
        name.trim(),
        email.trim().toLowerCase(),
        phone,
        whatsapp || phone,
        city || null,
        country || null,
        locale,
        service_type,
        family_adults || 1,
        family_children || 0,
        expected_travel_date || null,
        source,
        'active',
        false,
        now,
        now,
        message ? JSON.stringify([{
          id: `note-${Date.now()}`,
          content: message,
          created_at: now.toISOString(),
          created_by: 'Website Application',
        }]) : JSON.stringify([]),
      ]);

      clientDbId = clientResult.rows[0].id;
    }

    // Create application/case
    const applicationId = await generateApplicationId();

    await pool.query(`
      INSERT INTO applications (
        application_id, client_id, name, email, phone, locale,
        service_type, phase, status, timeline, notes, documents,
        created_at, updated_at, archived
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
      )
    `, [
      applicationId,
      clientDbId,
      name.trim(),
      email.trim().toLowerCase(),
      phone,
      locale,
      service_type,
      1, // Phase 1: Lead
      'new',
      JSON.stringify([{
        status: 'new',
        timestamp: now.toISOString(),
        by: 'Website',
        note: 'Application submitted via website',
      }]),
      message ? JSON.stringify([{
        id: `note-${Date.now()}`,
        content: message,
        created_at: now.toISOString(),
        created_by: 'Client',
      }]) : JSON.stringify([]),
      JSON.stringify([]),
      now,
      now,
      false,
    ]);

    // Create notification for admin
    await pool.query(`
      INSERT INTO notifications (
        type, title, message, application_id, client_name, read, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      'new_application',
      'New Website Application',
      `New application for ${service_type}`,
      applicationId,
      name,
      false,
      now,
    ]);

    // Send confirmation email via Resend
    const emailTemplate = emailTemplates[locale as keyof typeof emailTemplates] || emailTemplates.en;
    try {
      const resendClient = getResend();
      if (resendClient) {
        const emailResult = await resendClient.emails.send({
          from: 'Brasil Legalize <noreply@maocean360.com>',
          to: [email],
          subject: emailTemplate.subject,
          text: emailTemplate.body(name, applicationId),
        });
        console.log('Email sent successfully:', emailResult);
      } else {
        console.log('Resend not configured, skipping email');
      }
    } catch (emailError) {
      // Log email error but don't fail the application submission
      console.error('Failed to send confirmation email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      application_id: applicationId,
      client_id: clientId,
    });
  } catch (error) {
    console.error('Apply API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit application' }, { status: 500 });
  }
}
