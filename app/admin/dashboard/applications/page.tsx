'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAdminLocale } from '@/components/admin/Header';

// Common document types for requests
const DOCUMENT_TYPES = [
  { id: 'passport', label: 'Passport Copy' },
  { id: 'birth_certificate', label: 'Birth Certificate' },
  { id: 'marriage_certificate', label: 'Marriage Certificate' },
  { id: 'proof_of_residence', label: 'Proof of Residence' },
  { id: 'bank_statement', label: 'Bank Statement' },
  { id: 'employment_letter', label: 'Employment Letter' },
  { id: 'photo', label: 'Passport Photo' },
  { id: 'other', label: 'Other Document' },
];

// 4 phases × 4 statuses = 16 total
const WORKFLOW = {
  phases: [
    { id: 1, name: 'Lead', description: 'No portal access', color: 'gray' },
    { id: 2, name: 'Potential', description: 'No portal access', color: 'yellow' },
    { id: 3, name: 'Active Client', description: 'Portal access granted', color: 'blue' },
    { id: 4, name: 'Completion', description: 'Portal access', color: 'green' },
  ],
  statuses: {
    // Phase 1: Lead
    new: { phase: 1, label: 'New', color: 'bg-gray-100 text-gray-700', icon: 'ri-user-add-line' },
    contacted: { phase: 1, label: 'Contacted', color: 'bg-blue-100 text-blue-700', icon: 'ri-phone-line' },
    meeting_scheduled: { phase: 1, label: 'Meeting Scheduled', color: 'bg-yellow-100 text-yellow-700', icon: 'ri-calendar-line' },
    meeting_completed: { phase: 1, label: 'Meeting Completed', color: 'bg-blue-100 text-blue-700', icon: 'ri-checkbox-circle-line' },
    // Phase 2: Potential
    proposal_sent: { phase: 2, label: 'Proposal Sent', color: 'bg-yellow-100 text-yellow-700', icon: 'ri-file-text-line' },
    negotiating: { phase: 2, label: 'Negotiating', color: 'bg-yellow-100 text-yellow-700', icon: 'ri-discuss-line' },
    awaiting_payment: { phase: 2, label: 'Awaiting Payment', color: 'bg-yellow-100 text-yellow-700', icon: 'ri-money-dollar-circle-line' },
    payment_received: { phase: 2, label: 'Payment Received', color: 'bg-blue-100 text-blue-700', icon: 'ri-checkbox-circle-fill' },
    // Phase 3: Active Client
    onboarding: { phase: 3, label: 'Onboarding', color: 'bg-blue-100 text-blue-700', icon: 'ri-rocket-line' },
    documents_pending: { phase: 3, label: 'Documents Pending', color: 'bg-yellow-100 text-yellow-700', icon: 'ri-file-warning-line' },
    documents_review: { phase: 3, label: 'Documents Review', color: 'bg-blue-100 text-blue-700', icon: 'ri-eye-line' },
    application_submitted: { phase: 3, label: 'Application Submitted', color: 'bg-blue-100 text-blue-700', icon: 'ri-send-plane-line' },
    // Phase 4: Completion
    processing: { phase: 4, label: 'Processing', color: 'bg-yellow-100 text-yellow-700', icon: 'ri-loader-4-line' },
    approved: { phase: 4, label: 'Approved', color: 'bg-green-100 text-green-700', icon: 'ri-checkbox-circle-fill' },
    finalizing: { phase: 4, label: 'Finalizing', color: 'bg-blue-100 text-blue-700', icon: 'ri-file-check-line' },
    completed: { phase: 4, label: 'Completed', color: 'bg-green-100 text-green-700', icon: 'ri-trophy-line' },
  },
};

const PHASE_STATUSES: Record<number, string[]> = {
  1: ['new', 'contacted', 'meeting_scheduled', 'meeting_completed'],
  2: ['proposal_sent', 'negotiating', 'awaiting_payment', 'payment_received'],
  3: ['onboarding', 'documents_pending', 'documents_review', 'application_submitted'],
  4: ['processing', 'approved', 'finalizing', 'completed'],
};

interface Application {
  id: string;
  lead_id: number;
  client_id: number | null;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  package: string | null;
  phase: number;
  status: string;
  token: string | null;
  password: string | null;
  payment_amount: number | null;
  payment_method: string | null;
  payment_date: string | null;
  notes: any[];
  documents: any[];
  timeline: Array<{
    status: string;
    timestamp: string;
    by: string;
    note: string;
  }>;
  completed_at: string | null;
  archive_after: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

// Toast component for notifications
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'info' | 'warning'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 
                  type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200';
  const textColor = type === 'success' ? 'text-green-800' : 
                    type === 'warning' ? 'text-yellow-800' : 'text-blue-800';
  const iconColor = type === 'success' ? 'text-green-500' : 
                    type === 'warning' ? 'text-yellow-500' : 'text-blue-500';

  return (
    <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg border ${bgColor} shadow-lg max-w-md`}>
      <div className="flex items-start gap-3">
        <i className={`ri-information-line text-xl ${iconColor}`}></i>
        <div className="flex-1">
          <p className={`text-sm ${textColor}`}>{message}</p>
        </div>
        <button onClick={onClose} className={`${textColor} hover:opacity-70`}>
          <i className="ri-close-line"></i>
        </button>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const { t } = useAdminLocale();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [activePhase, setActivePhase] = useState<number>(1);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  
  // Document request modal state
  const [showDocRequestModal, setShowDocRequestModal] = useState(false);
  const [selectedDocTypes, setSelectedDocTypes] = useState<string[]>([]);
  const [docRequestMessage, setDocRequestMessage] = useState('');
  const [docRequestDueDate, setDocRequestDueDate] = useState('');
  const [creatingDocRequest, setCreatingDocRequest] = useState(false);
  const [generatedUploadLink, setGeneratedUploadLink] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/applications');
      const data = await res.json();
      if (data.success) {
        // API returns { success, items } not { success, data }
        setApplications(data.items || data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateStatus = async () => {
    if (!selectedApp || !newStatus) return;

    try {
      const res = await fetch('/api/admin/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedApp.id,
          status: newStatus,
          note: statusNote,
          admin_name: 'Admin',
          payment_amount: paymentAmount ? parseFloat(paymentAmount) : null,
          payment_method: paymentMethod || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchApplications();
        setSelectedApp(data.application || data.data || null);
        setShowStatusModal(false);
        setStatusNote('');
        setNewStatus('');
        setPaymentAmount('');
        setPaymentMethod('');
        
        // Show archive notification if application was completed
        if (data.archiveMessage) {
          setToast({ message: data.archiveMessage, type: 'info' });
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Create document request
  const createDocumentRequest = async () => {
    if (!selectedApp || selectedDocTypes.length === 0) {
      setToast({ message: 'Please select at least one document type', type: 'warning' });
      return;
    }

    setCreatingDocRequest(true);
    try {
      const res = await fetch('/api/admin/document-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: selectedApp.client_id,
          case_id: selectedApp.id,
          requested_documents: selectedDocTypes.map(type => {
            const docType = DOCUMENT_TYPES.find(d => d.id === type);
            return { type, label: docType?.label || type };
          }),
          message: docRequestMessage || 'Please upload the requested documents.',
          due_date: docRequestDueDate || null,
          admin_name: 'Admin',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedUploadLink(data.upload_link);
        setToast({ message: 'Document request created! Upload link generated.', type: 'success' });
        
        // Update application status to documents_pending if in phase 3
        if (selectedApp.phase === 3 && selectedApp.status !== 'documents_pending') {
          await fetch('/api/admin/applications', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: selectedApp.id,
              status: 'documents_pending',
              note: 'Document request sent to client',
              admin_name: 'Admin',
            }),
          });
          await fetchApplications();
        }
      } else {
        setToast({ message: data.error || 'Failed to create document request', type: 'warning' });
      }
    } catch (error) {
      console.error('Failed to create document request:', error);
      setToast({ message: 'Failed to create document request', type: 'warning' });
    } finally {
      setCreatingDocRequest(false);
    }
  };

  // Reset document request modal
  const resetDocRequestModal = () => {
    setShowDocRequestModal(false);
    setSelectedDocTypes([]);
    setDocRequestMessage('');
    setDocRequestDueDate('');
    setGeneratedUploadLink(null);
  };

  const getPhaseApps = (phase: number) => {
    return applications.filter((app) => app.phase === phase);
  };

  const getStatusApps = (status: string) => {
    return applications.filter((app) => app.status === status);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast notifications */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-neutral-900">{t.applications.title}</h1>
          <p className="text-neutral-500 text-sm mt-1">{t.applications.subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-500">
            Total: <strong className="text-primary">{applications?.length || 0}</strong>
          </span>
        </div>
      </div>

      {/* Phase Tabs - scrollable on mobile */}
      <div className="flex gap-2 md:gap-3 border-b border-neutral-200 pb-3 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        {WORKFLOW.phases.map((phase) => {
          const count = getPhaseApps(phase.id).length;
          return (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={`px-3 md:px-5 py-2 md:py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 md:gap-3 whitespace-nowrap text-sm md:text-base flex-shrink-0 ${
                activePhase === phase.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:border-primary hover:text-primary'
              }`}
            >
              <span className="hidden sm:inline">Phase {phase.id}:</span>
              <span>{phase.name}</span>
              <span className={`min-w-[24px] h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                activePhase === phase.id ? 'bg-white/25 text-white' : 'bg-blue-100 text-blue-700'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Phase Description */}
      <div className={`rounded-lg p-4 flex items-center gap-3 ${
        activePhase >= 3 ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
      }`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          activePhase >= 3 ? 'bg-green-100' : 'bg-blue-100'
        }`}>
          <i className={`${activePhase >= 3 ? 'ri-lock-unlock-line text-green-600' : 'ri-lock-line text-blue-600'} text-xl`}></i>
        </div>
        <div>
          <p className={`font-semibold ${activePhase >= 3 ? 'text-green-900' : 'text-blue-900'}`}>
            {WORKFLOW.phases[activePhase - 1].name} Phase
          </p>
          <p className={`text-sm flex items-center gap-1.5 ${activePhase >= 3 ? 'text-green-700' : 'text-blue-700'}`}>
            <i className={`${activePhase >= 3 ? 'ri-checkbox-circle-fill' : 'ri-lock-2-line'}`}></i>
            {activePhase >= 3 ? 'Client has portal access' : 'No portal access - client cannot track yet'}
          </p>
        </div>
      </div>

      {/* Kanban Board for Current Phase */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {PHASE_STATUSES[activePhase].map((statusKey) => {
          const statusInfo = WORKFLOW.statuses[statusKey as keyof typeof WORKFLOW.statuses];
          const apps = getStatusApps(statusKey);
          
          return (
            <div key={statusKey} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              {/* Column Header */}
              <div className="bg-blue-50 px-3 py-2 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <i className={`${statusInfo.icon} text-sm text-blue-600`}></i>
                    <h3 className="font-medium text-sm text-neutral-800">{statusInfo.label}</h3>
                  </div>
                  <span className="min-w-[22px] h-5 flex items-center justify-center rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                    {apps.length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2 min-h-[120px] max-h-[400px] overflow-y-auto bg-neutral-50">
                {apps.length === 0 ? (
                  <div className="text-center py-6 text-neutral-400 text-xs">
                    No applications
                  </div>
                ) : (
                  apps.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white rounded-lg p-3 border border-neutral-200 hover:border-primary hover:shadow-sm transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-[10px] font-mono text-neutral-400">{app.id}</span>
                        <div className="flex items-center gap-1">
                          {app.token && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                              🔑
                            </span>
                          )}
                          <Link
                            href={app.client_id 
                              ? `/admin/clients/${app.client_id}`
                              : `/admin/clients?search=${encodeURIComponent(app.email)}`
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-primary hover:bg-primary/10 rounded transition-all"
                            title="View Client Profile"
                          >
                            <i className="ri-user-line text-sm" aria-hidden="true"></i>
                          </Link>
                        </div>
                      </div>
                      <div onClick={() => setSelectedApp(app)}>
                        <h4 className="font-medium text-sm text-neutral-900 truncate">{app.name}</h4>
                        <p className="text-xs text-neutral-500 truncate">{app.email}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded capitalize">{app.service_type}</span>
                            {app.package && (
                              <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded capitalize">{app.package}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Application Detail Sidebar */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={(e) => e.target === e.currentTarget && setSelectedApp(null)}>
          <div className="w-full max-w-lg bg-white h-screen overflow-y-auto shadow-2xl flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary to-primary/90 text-white p-5 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg">{selectedApp.name}</h2>
                <p className="text-sm text-white/70 font-mono">{selectedApp.id}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Current Status */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-blue-900">Current Status</h3>
                  <button
                    onClick={() => setShowStatusModal(true)}
                    className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    Change Status
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    WORKFLOW.statuses[selectedApp.status as keyof typeof WORKFLOW.statuses]?.color || 'bg-gray-100'
                  }`}>
                    <i className={`${WORKFLOW.statuses[selectedApp.status as keyof typeof WORKFLOW.statuses]?.icon} mr-1`}></i>
                    {WORKFLOW.statuses[selectedApp.status as keyof typeof WORKFLOW.statuses]?.label || selectedApp.status}
                  </span>
                  <span className="text-sm text-blue-700 bg-blue-100 px-3 py-2 rounded-lg">
                    Phase {selectedApp.phase}: {WORKFLOW.phases[selectedApp.phase - 1]?.name}
                  </span>
                </div>
              </div>

              {/* Token & Password (only if generated) */}
              {selectedApp.token && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                    <i className="ri-key-2-line text-lg"></i>
                    Client Access Credentials
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-green-700 font-semibold uppercase tracking-wide">Tracker Link</label>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="text"
                          readOnly
                          value={`${typeof window !== 'undefined' ? window.location.origin : ''}/en/track/${selectedApp.token}`}
                          className="flex-1 text-sm bg-white border border-green-200 rounded-lg px-3 py-2 font-mono text-green-800"
                        />
                        <button
                          onClick={() => copyToClipboard(`${window.location.origin}/en/track/${selectedApp.token}`)}
                          className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                          title="Copy link"
                        >
                          <i className="ri-file-copy-line text-green-700"></i>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-green-700 font-semibold uppercase tracking-wide">Password</label>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="text"
                          readOnly
                          value={selectedApp.password || ''}
                          className="flex-1 text-sm bg-white border border-green-200 rounded-lg px-3 py-2 font-mono text-green-800 tracking-wider"
                        />
                        <button
                          onClick={() => copyToClipboard(selectedApp.password || '')}
                          className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                          title="Copy password"
                        >
                          <i className="ri-file-copy-line text-green-700"></i>
                        </button>
                      </div>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3 text-xs text-green-700 flex items-start gap-2">
                      <i className="ri-information-line mt-0.5"></i>
                      <span>Send password separately via WhatsApp or email for security</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="bg-white border border-neutral-200 rounded-xl p-4">
                <h3 className="font-semibold text-neutral-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <a href={`mailto:${selectedApp.email}`} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="ri-mail-line text-blue-600"></i>
                    </div>
                    <span className="text-blue-700 font-medium">{selectedApp.email}</span>
                  </a>
                  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                      <i className="ri-phone-line text-neutral-600"></i>
                    </div>
                    <span className="font-medium text-neutral-700 flex-1">{selectedApp.phone}</span>
                    <a
                      href={`https://wa.me/${selectedApp.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors"
                    >
                      <i className="ri-whatsapp-line text-green-600 text-lg"></i>
                    </a>
                  </div>
                </div>
              </div>

              {/* Client Profile Link */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
                <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <i className="ri-user-star-line text-lg"></i>
                  Client Profile
                </h3>
                <Link
                  href={selectedApp.client_id 
                    ? `/admin/clients/${selectedApp.client_id}`
                    : `/admin/clients?search=${encodeURIComponent(selectedApp.email)}`
                  }
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-purple-100 transition-colors border border-purple-100"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-purple-600"></i>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-purple-700">View Client Profile</p>
                    <p className="text-xs text-purple-600">See full client history & details</p>
                  </div>
                  <i className="ri-arrow-right-line text-purple-600"></i>
                </Link>
              </div>

              {/* Email Actions */}
              <div className="bg-white border border-neutral-200 rounded-xl p-4">
                <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <i className="ri-mail-send-line text-primary"></i>
                  Send Email to Client
                </h3>
                <div className="space-y-2">
                  {selectedApp.token && (
                    <button
                      onClick={async () => {
                        // Open email client with portal access info
                        const subject = encodeURIComponent('Your Brasil Legalize Portal Access');
                        const body = encodeURIComponent(`Hello ${selectedApp.name},\n\nHere are your portal access credentials:\n\nToken: ${selectedApp.token}\nPassword: ${selectedApp.password || 'Contact support'}\n\nAccess your portal at: ${window.location.origin}/track\n\nBest regards,\nBrasil Legalize Team`);
                        window.open(`mailto:${selectedApp.email}?subject=${subject}&body=${body}`, '_blank');
                        setToast({ message: 'Email client opened with portal access details', type: 'success' });
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="ri-key-2-line text-green-600"></i>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-green-700">Resend Portal Access</p>
                        <p className="text-xs text-green-600">Send token link & password again</p>
                      </div>
                      <i className="ri-send-plane-line text-green-600"></i>
                    </button>
                  )}
                  <button
                    onClick={() => setShowDocRequestModal(true)}
                    className="w-full flex items-center gap-3 p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <i className="ri-file-warning-line text-yellow-600"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-yellow-700">Request Documents</p>
                      <p className="text-xs text-yellow-600">Create upload link & notify client</p>
                    </div>
                    <i className="ri-add-circle-line text-yellow-600"></i>
                  </button>
                  <button
                    onClick={() => {
                      const statusLabel = WORKFLOW.statuses[selectedApp.status as keyof typeof WORKFLOW.statuses]?.label || selectedApp.status;
                      const phaseName = WORKFLOW.phases[selectedApp.phase - 1]?.name || 'Unknown';
                      const subject = encodeURIComponent('Application Status Update - Brasil Legalize');
                      const body = encodeURIComponent(`Hello ${selectedApp.name},\n\nYour application status has been updated:\n\nCurrent Phase: ${phaseName}\nStatus: ${statusLabel}\n\nIf you have any questions, please don't hesitate to contact us.\n\nBest regards,\nBrasil Legalize Team`);
                      window.open(`mailto:${selectedApp.email}?subject=${subject}&body=${body}`, '_blank');
                      setToast({ message: 'Email client opened for status update', type: 'success' });
                    }}
                    className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="ri-refresh-line text-blue-600"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-blue-700">Send Status Update</p>
                      <p className="text-xs text-blue-600">Notify client of current status</p>
                    </div>
                    <i className="ri-send-plane-line text-blue-600"></i>
                  </button>
                </div>
              </div>

              {/* Service Details */}
              <div className="bg-white border border-neutral-200 rounded-xl p-4">
                <h3 className="font-semibold text-neutral-900 mb-4">Service Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <span className="text-blue-600 text-xs font-medium uppercase">Service</span>
                    <p className="font-semibold capitalize text-blue-900 mt-1">{selectedApp.service_type}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <span className="text-blue-600 text-xs font-medium uppercase">Package</span>
                    <p className="font-semibold capitalize text-blue-900 mt-1">{selectedApp.package || 'Not selected'}</p>
                  </div>
                  {selectedApp.payment_amount && (
                    <>
                      <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                        <span className="text-green-600 text-xs font-medium uppercase">Payment</span>
                        <p className="font-semibold text-green-900 mt-1">${selectedApp.payment_amount}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                        <span className="text-green-600 text-xs font-medium uppercase">Method</span>
                        <p className="font-semibold capitalize text-green-900 mt-1">{selectedApp.payment_method}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white border border-neutral-200 rounded-xl p-4">
                <h3 className="font-semibold text-neutral-900 mb-4">Timeline</h3>
                <div className="space-y-1">
                  {selectedApp.timeline.slice().reverse().map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          index === 0 ? 'bg-primary border-primary' : 'bg-white border-neutral-300'
                        }`}></div>
                        {index < selectedApp.timeline.length - 1 && (
                          <div className="w-0.5 flex-1 bg-neutral-200 my-1"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                            WORKFLOW.statuses[event.status as keyof typeof WORKFLOW.statuses]?.color || 'bg-gray-100'
                          }`}>
                            {WORKFLOW.statuses[event.status as keyof typeof WORKFLOW.statuses]?.label || event.status}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-700 mt-2">{event.note}</p>
                        <p className="text-xs text-neutral-400 mt-1">
                          {new Date(event.timestamp).toLocaleString()} • <span className="font-medium">{event.by}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/90 p-5">
              <h3 className="text-lg font-bold text-white">Change Status</h3>
              <p className="text-white/70 text-sm">Update application workflow status</p>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select status...</option>
                  {Object.entries(WORKFLOW.statuses).map(([key, info]) => (
                    <option key={key} value={key}>
                      Phase {info.phase}: {info.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment fields (show when moving to payment_received) */}
              {newStatus === 'payment_received' && !selectedApp.token && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div>
                    <label className="block text-sm font-semibold text-blue-900 mb-2">Payment Amount (USD)</label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="e.g., 3004"
                      className="w-full border border-blue-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-900 mb-2">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full border border-blue-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select method...</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="crypto">Crypto</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 flex items-start gap-2">
                    <i className="ri-key-2-line text-yellow-600 mt-0.5"></i>
                    <span>A <strong>token</strong> and <strong>password</strong> will be generated automatically for client access</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Note (optional)</label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Add a note about this status change..."
                  rows={3}
                  className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 p-5 bg-neutral-50 border-t border-neutral-200">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setNewStatus('');
                  setStatusNote('');
                  setPaymentAmount('');
                  setPaymentMethod('');
                }}
                className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg hover:bg-white transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={updateStatus}
                disabled={!newStatus}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Request Modal */}
      {showDocRequestModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-5">
              <h3 className="text-lg font-bold text-white">Request Documents</h3>
              <p className="text-white/80 text-sm">Create an upload link for {selectedApp.name}</p>
            </div>
            
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Generated Upload Link */}
              {generatedUploadLink && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <i className="ri-checkbox-circle-fill text-green-600"></i>
                    Upload Link Generated!
                  </h4>
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}${generatedUploadLink}`}
                      className="flex-1 text-sm bg-white border border-green-200 rounded-lg px-3 py-2 font-mono text-green-800"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}${generatedUploadLink}`);
                        setToast({ message: 'Upload link copied!', type: 'success' });
                      }}
                      className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                      title="Copy link"
                    >
                      <i className="ri-file-copy-line text-green-700"></i>
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      const docs = selectedDocTypes.map(t => DOCUMENT_TYPES.find(d => d.id === t)?.label || t).join('\n- ');
                      const subject = encodeURIComponent('Documents Required - Brasil Legalize');
                      const body = encodeURIComponent(`Hello ${selectedApp.name},\n\nWe need the following documents to proceed with your application:\n\n- ${docs}\n\nPlease upload them using this secure link:\n${window.location.origin}${generatedUploadLink}\n\n${docRequestMessage ? `Note: ${docRequestMessage}\n\n` : ''}Best regards,\nBrasil Legalize Team`);
                      window.open(`mailto:${selectedApp.email}?subject=${subject}&body=${body}`, '_blank');
                      setToast({ message: 'Email client opened with upload link', type: 'success' });
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <i className="ri-mail-send-line"></i>
                    Send Link via Email
                  </button>
                </div>
              )}

              {!generatedUploadLink && (
                <>
                  {/* Document Types Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-3">
                      Select Documents to Request
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {DOCUMENT_TYPES.map((docType) => (
                        <button
                          key={docType.id}
                          onClick={() => {
                            setSelectedDocTypes(prev => 
                              prev.includes(docType.id) 
                                ? prev.filter(t => t !== docType.id)
                                : [...prev, docType.id]
                            );
                          }}
                          className={`p-3 rounded-lg border text-left text-sm transition-all ${
                            selectedDocTypes.includes(docType.id)
                              ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                              : 'bg-white border-neutral-200 text-neutral-700 hover:border-yellow-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <i className={`${selectedDocTypes.includes(docType.id) ? 'ri-checkbox-circle-fill text-yellow-600' : 'ri-checkbox-blank-circle-line text-neutral-300'}`}></i>
                            <span>{docType.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Message */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Message to Client (optional)
                    </label>
                    <textarea
                      value={docRequestMessage}
                      onChange={(e) => setDocRequestMessage(e.target.value)}
                      placeholder="Add any specific instructions or notes..."
                      rows={3}
                      className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Due Date (optional)
                    </label>
                    <input
                      type="date"
                      value={docRequestDueDate}
                      onChange={(e) => setDocRequestDueDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border border-neutral-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>

                  {/* Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 flex items-start gap-2">
                    <i className="ri-information-line text-blue-600 mt-0.5"></i>
                    <span>This will create a unique upload link and folder structure for the client's documents.</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 p-5 bg-neutral-50 border-t border-neutral-200">
              <button
                onClick={resetDocRequestModal}
                className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg hover:bg-white transition-colors font-medium"
              >
                {generatedUploadLink ? 'Close' : 'Cancel'}
              </button>
              {!generatedUploadLink && (
                <button
                  onClick={createDocumentRequest}
                  disabled={selectedDocTypes.length === 0 || creatingDocRequest}
                  className="flex-1 px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                >
                  {creatingDocRequest ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="ri-link"></i>
                      Generate Upload Link
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
