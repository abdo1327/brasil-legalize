import { Resend } from 'resend';

// Initialize Resend only if API key is available (lazy initialization)
let resend: Resend | null = null;

function getResend(): Resend | null {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@brasillegalize.com';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Email templates
const templates = {
  // Client receives token link with password
  tokenLink: (data: { name: string; token: string; password: string; locale?: string }) => ({
    subject: {
      en: 'Your Brasil Legalize Portal Access',
      'pt-br': 'Seu Acesso ao Portal Brasil Legalize',
      es: 'Su Acceso al Portal Brasil Legalize',
      ar: 'وصولك إلى بوابة Brasil Legalize',
    }[data.locale || 'en'],
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 30px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Brasil Legalize</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1f2937; margin-top: 0;">Welcome, ${data.name}!</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Your payment has been received and your client portal is now ready. 
            You can track your application progress at any time using the link below.
          </p>
          
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">Your Login Credentials:</p>
            <p style="color: #1f2937; margin: 0 0 5px 0;"><strong>Password:</strong> <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${data.password}</code></p>
          </div>
          
          <a href="${SITE_URL}/${data.locale || 'en'}/track/${data.token}" 
             style="display: inline-block; background: #059669; color: white; padding: 14px 28px; 
                    text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 0;">
            Access Your Portal
          </a>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
            This link is unique to you. Please do not share it with others.
          </p>
        </div>
      </div>
    `,
  }),

  // Client status update notification
  statusUpdate: (data: { name: string; status: string; statusLabel: string; phase: string; token?: string; locale?: string }) => ({
    subject: {
      en: `Application Update: ${data.statusLabel}`,
      'pt-br': `Atualização do Pedido: ${data.statusLabel}`,
      es: `Actualización de Solicitud: ${data.statusLabel}`,
      ar: `تحديث الطلب: ${data.statusLabel}`,
    }[data.locale || 'en'],
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 30px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Brasil Legalize</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hello, ${data.name}!</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Your application status has been updated.
          </p>
          
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px;">Current Phase:</p>
            <p style="color: #059669; font-weight: 600; margin: 0 0 15px 0; font-size: 18px;">${data.phase}</p>
            
            <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px;">Status:</p>
            <p style="color: #1f2937; font-weight: 600; margin: 0; font-size: 18px;">${data.statusLabel}</p>
          </div>
          
          ${data.token ? `
          <a href="${SITE_URL}/${data.locale || 'en'}/track/${data.token}" 
             style="display: inline-block; background: #059669; color: white; padding: 14px 28px; 
                    text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 0;">
            View Details
          </a>
          ` : ''}
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
            If you have any questions, please contact us.
          </p>
        </div>
      </div>
    `,
  }),

  // Document request to client
  documentRequest: (data: { name: string; documents: string[]; token?: string; locale?: string }) => ({
    subject: {
      en: 'Documents Required for Your Application',
      'pt-br': 'Documentos Necessários para o Seu Pedido',
      es: 'Documentos Requeridos para Su Solicitud',
      ar: 'المستندات المطلوبة لطلبك',
    }[data.locale || 'en'],
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 30px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Brasil Legalize</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hello, ${data.name}!</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            We need the following documents to proceed with your application:
          </p>
          
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <ul style="color: #1f2937; margin: 0; padding-left: 20px;">
              ${data.documents.map(doc => `<li style="margin-bottom: 8px;">${doc}</li>`).join('')}
            </ul>
          </div>
          
          ${data.token ? `
          <a href="${SITE_URL}/${data.locale || 'en'}/track/${data.token}" 
             style="display: inline-block; background: #059669; color: white; padding: 14px 28px; 
                    text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 0;">
            Upload Documents
          </a>
          ` : ''}
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
            Please upload these documents as soon as possible to avoid delays.
          </p>
        </div>
      </div>
    `,
  }),

  // Admin notification when client does something
  adminClientAction: (data: { clientName: string; action: string; applicationId: string; details?: string }) => ({
    subject: `Client Action: ${data.action} - ${data.clientName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 30px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Admin Notification</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1f2937; margin-top: 0;">Client Action Alert</h2>
          
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px;">Client:</p>
            <p style="color: #1f2937; font-weight: 600; margin: 0 0 15px 0;">${data.clientName}</p>
            
            <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px;">Application:</p>
            <p style="color: #1f2937; font-weight: 600; margin: 0 0 15px 0;">${data.applicationId}</p>
            
            <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px;">Action:</p>
            <p style="color: #059669; font-weight: 600; margin: 0;">${data.action}</p>
            
            ${data.details ? `
            <p style="color: #6b7280; margin: 15px 0 5px 0; font-size: 14px;">Details:</p>
            <p style="color: #4b5563; margin: 0;">${data.details}</p>
            ` : ''}
          </div>
          
          <a href="${SITE_URL}/admin/dashboard/applications" 
             style="display: inline-block; background: #1e40af; color: white; padding: 14px 28px; 
                    text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 0;">
            View in Admin
          </a>
        </div>
      </div>
    `,
  }),

  // Welcome email when application created
  welcome: (data: { name: string; serviceType: string; locale?: string }) => ({
    subject: {
      en: 'Welcome to Brasil Legalize',
      'pt-br': 'Bem-vindo ao Brasil Legalize',
      es: 'Bienvenido a Brasil Legalize',
      ar: 'مرحبًا بك في Brasil Legalize',
    }[data.locale || 'en'],
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 30px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Brasil Legalize</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1f2937; margin-top: 0;">Welcome, ${data.name}!</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Thank you for choosing Brasil Legalize for your ${data.serviceType} needs. 
            We have received your information and our team will be in touch shortly.
          </p>
          
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0;">What happens next?</h3>
            <ol style="color: #4b5563; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>Our team will review your submission</li>
              <li>We'll contact you to discuss your case</li>
              <li>Once payment is confirmed, you'll receive portal access</li>
              <li>Track your application progress in real-time</li>
            </ol>
          </div>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
            If you have any questions, feel free to reach out to us.
          </p>
        </div>
      </div>
    `,
  }),

  // Application completed
  completed: (data: { name: string; applicationId: string; locale?: string }) => ({
    subject: {
      en: 'Congratulations! Your Application is Complete',
      'pt-br': 'Parabéns! Seu Pedido Foi Concluído',
      es: '¡Felicidades! Su Solicitud está Completa',
      ar: 'تهانينا! تم إكمال طلبك',
    }[data.locale || 'en'],
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 30px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Brasil Legalize</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="font-size: 48px;">🎉</span>
          </div>
          <h2 style="color: #1f2937; margin-top: 0; text-align: center;">Congratulations, ${data.name}!</h2>
          <p style="color: #4b5563; line-height: 1.6; text-align: center;">
            Your application <strong>${data.applicationId}</strong> has been successfully completed!
          </p>
          
          <div style="background: #d1fae5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="color: #065f46; margin: 0; font-weight: 600;">
              All processes have been finalized. Thank you for trusting Brasil Legalize!
            </p>
          </div>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; text-align: center;">
            We hope to serve you again in the future.
          </p>
        </div>
      </div>
    `,
  }),
};

export type EmailTemplate = keyof typeof templates;

// Send email function
export async function sendEmail(
  to: string,
  template: EmailTemplate,
  data: any
): Promise<{ success: boolean; id?: string; error?: string }> {
  console.log(`[EMAIL] Attempting to send "${template}" email to: ${to}`);
  console.log(`[EMAIL] RESEND_API_KEY present: ${!!process.env.RESEND_API_KEY}`);
  
  try {
    const client = getResend();
    
    // If no API key, log and return success (dev mode)
    if (!client) {
      console.log(`[EMAIL] No Resend client - running in dev mode`);
      console.log(`[EMAIL] Would send "${template}" to ${to} with data:`, JSON.stringify(data, null, 2));
      return { success: true, id: 'dev-mode-no-send' };
    }
    
    const emailContent = templates[template](data);
    console.log(`[EMAIL] Subject: ${emailContent.subject}`);
    
    const result = await client.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: emailContent.subject as string,
      html: emailContent.html,
    });

    console.log(`[EMAIL] Resend response:`, JSON.stringify(result, null, 2));

    if (result.error) {
      console.error('[EMAIL] Resend error:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log(`[EMAIL] Successfully sent! ID: ${result.data?.id}`);
    return { success: true, id: result.data?.id };
  } catch (error: any) {
    console.error('[EMAIL] Send error:', error);
    return { success: false, error: error.message };
  }
}

// Send email to admin
export async function sendAdminEmail(
  template: EmailTemplate,
  data: any
): Promise<{ success: boolean; id?: string; error?: string }> {
  return sendEmail(ADMIN_EMAIL, template, data);
}

// Batch send for multiple recipients
export async function sendBatchEmails(
  recipients: { email: string; template: EmailTemplate; data: any }[]
): Promise<{ success: boolean; results: any[] }> {
  const results = await Promise.all(
    recipients.map(({ email, template, data }) => sendEmail(email, template, data))
  );
  return {
    success: results.every(r => r.success),
    results,
  };
}
