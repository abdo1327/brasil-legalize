'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';

interface TimelineEvent {
  status: string;
  timestamp: string;
  by: string;
  note: string;
}

interface Application {
  id: string;
  name: string;
  status: string;
  phase: number;
  statusInfo: {
    phase: number;
    label: string;
    color: string;
  };
  timeline: TimelineEvent[];
  documents: any[];
}

const WORKFLOW = {
  phases: [
    { id: 1, name: 'Lead', statuses: ['new', 'contacted', 'meeting_scheduled', 'meeting_completed'] },
    { id: 2, name: 'Potential', statuses: ['proposal_sent', 'negotiating', 'awaiting_payment', 'payment_received'] },
    { id: 3, name: 'Active', statuses: ['onboarding', 'documents_pending', 'documents_review', 'application_submitted'] },
    { id: 4, name: 'Completion', statuses: ['processing', 'approved', 'finalizing', 'completed'] },
  ],
  statuses: {
    new: { label: 'New', icon: 'ri-user-add-line' },
    contacted: { label: 'Contacted', icon: 'ri-phone-line' },
    meeting_scheduled: { label: 'Meeting Scheduled', icon: 'ri-calendar-line' },
    meeting_completed: { label: 'Meeting Completed', icon: 'ri-checkbox-circle-line' },
    proposal_sent: { label: 'Proposal Sent', icon: 'ri-file-text-line' },
    negotiating: { label: 'Negotiating', icon: 'ri-discuss-line' },
    awaiting_payment: { label: 'Awaiting Payment', icon: 'ri-money-dollar-circle-line' },
    payment_received: { label: 'Payment Received', icon: 'ri-checkbox-circle-fill' },
    onboarding: { label: 'Onboarding', icon: 'ri-rocket-line' },
    documents_pending: { label: 'Documents Pending', icon: 'ri-file-warning-line' },
    documents_review: { label: 'Documents Review', icon: 'ri-eye-line' },
    application_submitted: { label: 'Application Submitted', icon: 'ri-send-plane-line' },
    processing: { label: 'Processing', icon: 'ri-loader-4-line' },
    approved: { label: 'Approved', icon: 'ri-checkbox-circle-fill' },
    finalizing: { label: 'Finalizing', icon: 'ri-file-check-line' },
    completed: { label: 'Completed', icon: 'ri-trophy-line' },
  },
};

export default function ClientTrackerPage() {
  const params = useParams();
  const token = params.token as string;
  const locale = params.locale as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [storedPassword, setStoredPassword] = useState<string | null>(null);

  const fetchApplication = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/applications.php?token=${token}`);
      const data = await res.json();
      
      if (!data.success) {
        setError('Application not found');
        return;
      }
      
      setApplication(data.data);
    } catch {
      setError('Failed to load application');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // Check if already authenticated
    const savedAuth = sessionStorage.getItem(`track_auth_${token}`);
    if (savedAuth === 'true') {
      setAuthenticated(true);
    }
    fetchApplication();
  }, [token, fetchApplication]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, verify password against stored password
    // For now, accept any password (the API would validate)
    if (password.length >= 4) {
      setAuthenticated(true);
      sessionStorage.setItem(`track_auth_${token}`, 'true');
    }
  };

  const getProgressPercentage = () => {
    if (!application) return 0;
    const allStatuses = WORKFLOW.phases.flatMap(p => p.statuses);
    const currentIndex = allStatuses.indexOf(application.status);
    return Math.round(((currentIndex + 1) / allStatuses.length) * 100);
  };

  const getCurrentStep = () => {
    if (!application) return 0;
    const allStatuses = WORKFLOW.phases.flatMap(p => p.statuses);
    return allStatuses.indexOf(application.status) + 1;
  };

  const translations: Record<string, Record<string, string>> = {
    en: {
      title: 'Application Tracker',
      subtitle: 'Track your Brasil Legalize application progress',
      password_label: 'Enter your access password',
      password_placeholder: 'Password',
      login_button: 'Access Tracker',
      app_id: 'Application ID',
      progress: 'Progress',
      current_status: 'Current Status',
      timeline: 'Timeline',
      phase: 'Phase',
      step: 'Step',
      of: 'of',
      documents: 'Documents',
      no_documents: 'No documents uploaded yet',
      upload_documents: 'Upload Documents',
      need_help: 'Need help?',
      contact_us: 'Contact us via WhatsApp',
      error_title: 'Application Not Found',
      error_message: 'The link may be invalid or expired. Please contact support.',
    },
    'pt-br': {
      title: 'Rastreador de Aplicação',
      subtitle: 'Acompanhe o progresso da sua aplicação na Brasil Legalize',
      password_label: 'Digite sua senha de acesso',
      password_placeholder: 'Senha',
      login_button: 'Acessar Rastreador',
      app_id: 'ID da Aplicação',
      progress: 'Progresso',
      current_status: 'Status Atual',
      timeline: 'Linha do Tempo',
      phase: 'Fase',
      step: 'Etapa',
      of: 'de',
      documents: 'Documentos',
      no_documents: 'Nenhum documento enviado ainda',
      upload_documents: 'Enviar Documentos',
      need_help: 'Precisa de ajuda?',
      contact_us: 'Fale conosco via WhatsApp',
      error_title: 'Aplicação Não Encontrada',
      error_message: 'O link pode ser inválido ou expirado. Entre em contato com o suporte.',
    },
    es: {
      title: 'Rastreador de Aplicación',
      subtitle: 'Sigue el progreso de tu aplicación en Brasil Legalize',
      password_label: 'Ingresa tu contraseña de acceso',
      password_placeholder: 'Contraseña',
      login_button: 'Acceder al Rastreador',
      app_id: 'ID de Aplicación',
      progress: 'Progreso',
      current_status: 'Estado Actual',
      timeline: 'Cronología',
      phase: 'Fase',
      step: 'Paso',
      of: 'de',
      documents: 'Documentos',
      no_documents: 'No hay documentos subidos aún',
      upload_documents: 'Subir Documentos',
      need_help: '¿Necesitas ayuda?',
      contact_us: 'Contáctanos por WhatsApp',
      error_title: 'Aplicación No Encontrada',
      error_message: 'El enlace puede ser inválido o expirado. Contacta al soporte.',
    },
    ar: {
      title: 'متتبع الطلب',
      subtitle: 'تتبع تقدم طلبك في Brasil Legalize',
      password_label: 'أدخل كلمة المرور الخاصة بك',
      password_placeholder: 'كلمة المرور',
      login_button: 'الوصول للمتتبع',
      app_id: 'رقم الطلب',
      progress: 'التقدم',
      current_status: 'الحالة الحالية',
      timeline: 'الجدول الزمني',
      phase: 'المرحلة',
      step: 'الخطوة',
      of: 'من',
      documents: 'المستندات',
      no_documents: 'لم يتم رفع أي مستندات بعد',
      upload_documents: 'رفع المستندات',
      need_help: 'تحتاج مساعدة؟',
      contact_us: 'تواصل معنا عبر واتساب',
      error_title: 'الطلب غير موجود',
      error_message: 'قد يكون الرابط غير صالح أو منتهي الصلاحية. يرجى الاتصال بالدعم.',
    },
  };

  const t = translations[locale] || translations.en;
  const isRTL = locale === 'ar';

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-3xl text-red-500"></i>
          </div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">{t.error_title}</h1>
          <p className="text-neutral-500 mb-6">{t.error_message}</p>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <i className="ri-whatsapp-line"></i>
            {t.contact_us}
          </a>
        </div>
      </div>
    );
  }

  // Password login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-shield-keyhole-line text-4xl text-primary"></i>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">{t.title}</h1>
            <p className="text-neutral-500 mt-2">{t.subtitle}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {t.password_label}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.password_placeholder}
                className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {t.login_button}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-500">{t.need_help}</p>
            <a
              href="https://wa.me/5511999999999"
              className="text-green-600 hover:text-green-700 text-sm font-medium inline-flex items-center gap-1 mt-1"
            >
              <i className="ri-whatsapp-line"></i>
              {t.contact_us}
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Main tracker view
  return (
    <div className="min-h-screen bg-neutral-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">{t.title}</h1>
              <p className="text-sm text-neutral-500 mt-1">
                {t.app_id}: <span className="font-mono">{application.id}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-500">{t.progress}</p>
              <p className="text-2xl font-bold text-primary">{getProgressPercentage()}%</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Progress Bar */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-neutral-900">{t.progress}</h2>
            <span className="text-sm text-neutral-500">
              {t.step} {getCurrentStep()} {t.of} 16
            </span>
          </div>
          
          {/* Phase Progress */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {WORKFLOW.phases.map((phase) => {
              const isActive = phase.id === application.phase;
              const isCompleted = phase.id < application.phase;
              return (
                <div key={phase.id} className="text-center">
                  <div className={`h-2 rounded-full mb-2 ${
                    isCompleted ? 'bg-primary' : isActive ? 'bg-primary/50' : 'bg-neutral-200'
                  }`}></div>
                  <span className={`text-xs ${
                    isActive ? 'text-primary font-medium' : 'text-neutral-500'
                  }`}>
                    {t.phase} {phase.id}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Full Progress Bar */}
          <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Current Status Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-neutral-900 mb-4">{t.current_status}</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <i className={`${WORKFLOW.statuses[application.status as keyof typeof WORKFLOW.statuses]?.icon || 'ri-loader-4-line'} text-3xl text-primary`}></i>
            </div>
            <div>
              <p className="text-xl font-bold text-neutral-900">
                {WORKFLOW.statuses[application.status as keyof typeof WORKFLOW.statuses]?.label || application.status}
              </p>
              <p className="text-neutral-500">
                {t.phase} {application.phase}: {WORKFLOW.phases[application.phase - 1]?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-neutral-900 mb-4">{t.timeline}</h2>
          <div className="space-y-4">
            {application.timeline.slice().reverse().map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full ${
                    index === 0 ? 'bg-primary' : 'bg-neutral-300'
                  }`}></div>
                  {index < application.timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-neutral-200 mt-1"></div>
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-neutral-900">
                      {WORKFLOW.statuses[event.status as keyof typeof WORKFLOW.statuses]?.label || event.status}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">{event.note}</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    {new Date(event.timestamp).toLocaleString(locale === 'ar' ? 'ar-SA' : locale)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents Section (only if in Phase 3) */}
        {application.phase >= 3 && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-neutral-900 mb-4">{t.documents}</h2>
            {application.documents.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-file-upload-line text-3xl text-neutral-400"></i>
                </div>
                <p className="text-neutral-500 mb-4">{t.no_documents}</p>
                <a
                  href={`/${locale}/upload?token=${token}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <i className="ri-upload-2-line"></i>
                  {t.upload_documents}
                </a>
              </div>
            ) : (
              <div className="space-y-2">
                {application.documents.map((doc: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <i className="ri-file-line text-xl text-neutral-400"></i>
                    <span className="flex-1">{doc.name}</span>
                    <span className="text-xs text-neutral-400">{doc.uploaded_at}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <h3 className="font-semibold text-green-900 mb-2">{t.need_help}</h3>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <i className="ri-whatsapp-line text-xl"></i>
            {t.contact_us}
          </a>
        </div>
      </main>
    </div>
  );
}
