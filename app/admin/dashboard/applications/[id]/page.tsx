'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '@/lib/admin/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Application {
  id: string;
  lead_id: number | null;
  client_id: number | null;
  client_data?: {
    id: number;
    client_id: string;
    name: string;
    email: string;
  } | null;
  name: string;
  email: string;
  phone: string;
  locale: string;
  service_type: string;
  package: string | null;
  phase: number;
  status: string;
  token: string | null;
  password: string | null;
  payment_amount: number | null;
  payment_method: string | null;
  payment_date: string | null;
  notes: Note[];
  documents: Document[];
  timeline: TimelineEvent[];
  completed_at: string | null;
  archive_after: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  uploaded_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
}

interface Note {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
}

interface TimelineEvent {
  status: string;
  timestamp: string;
  by: string;
  note: string;
}

const statusLabels: Record<string, { label: string; color: string; icon: string }> = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700', icon: 'ri-user-add-line' },
  contacted: { label: 'Contacted', color: 'bg-purple-100 text-purple-700', icon: 'ri-phone-line' },
  meeting_scheduled: { label: 'Meeting Scheduled', color: 'bg-cyan-100 text-cyan-700', icon: 'ri-calendar-line' },
  meeting_completed: { label: 'Meeting Completed', color: 'bg-teal-100 text-teal-700', icon: 'ri-checkbox-circle-line' },
  proposal_sent: { label: 'Proposal Sent', color: 'bg-amber-100 text-amber-700', icon: 'ri-file-text-line' },
  negotiating: { label: 'Negotiating', color: 'bg-orange-100 text-orange-700', icon: 'ri-discuss-line' },
  awaiting_payment: { label: 'Awaiting Payment', color: 'bg-yellow-100 text-yellow-700', icon: 'ri-money-dollar-circle-line' },
  payment_received: { label: 'Payment Received', color: 'bg-green-100 text-green-700', icon: 'ri-checkbox-circle-fill' },
  onboarding: { label: 'Onboarding', color: 'bg-blue-100 text-blue-700', icon: 'ri-rocket-line' },
  documents_pending: { label: 'Documents Pending', color: 'bg-yellow-100 text-yellow-700', icon: 'ri-file-warning-line' },
  documents_review: { label: 'Documents Review', color: 'bg-indigo-100 text-indigo-700', icon: 'ri-eye-line' },
  application_submitted: { label: 'Application Submitted', color: 'bg-violet-100 text-violet-700', icon: 'ri-send-plane-line' },
  processing: { label: 'Processing', color: 'bg-sky-100 text-sky-700', icon: 'ri-loader-4-line' },
  approved: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700', icon: 'ri-checkbox-circle-fill' },
  finalizing: { label: 'Finalizing', color: 'bg-lime-100 text-lime-700', icon: 'ri-file-check-line' },
  completed: { label: 'Completed', color: 'bg-green-200 text-green-800', icon: 'ri-trophy-line' },
};

const phaseLabels: Record<number, string> = {
  1: 'Lead',
  2: 'Potential',
  3: 'Active Client',
  4: 'Completion',
};

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const { admin } = useAdminAuth();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'financial' | 'communication' | 'notes' | 'timeline'>('overview');
  const [newNote, setNewNote] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  const fetchApplication = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/applications.php?id=${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setApplication(data.data);
      }
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const addNote = async () => {
    if (!newNote.trim() || !application) return;

    try {
      const response = await fetch(`/api/admin/applications.php?id=${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-note',
          note: newNote,
          by: admin?.name || 'Admin',
        }),
      });

      if (response.ok) {
        setNewNote('');
        setShowAddNote(false);
        fetchApplication();
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const updateStatus = async () => {
    if (!newStatus || !application) return;

    try {
      const response = await fetch('/api/admin/applications.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: application.id,
          status: newStatus,
          note: statusNote,
          admin_name: admin?.name || 'Admin',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShowStatusModal(false);
        setStatusNote('');
        setNewStatus('');
        fetchApplication();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const updateDocumentStatus = async (docId: string, status: 'approved' | 'rejected', reason?: string) => {
    try {
      const response = await fetch(`/api/admin/applications.php?id=${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-document',
          document_id: docId,
          status,
          rejection_reason: reason,
          by: admin?.name || 'Admin',
        }),
      });

      if (response.ok) {
        fetchApplication();
      }
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-file-unknow-line text-3xl text-neutral-400" aria-hidden="true"></i>
        </div>
        <h3 className="font-semibold text-neutral-900">Application not found</h3>
        <p className="text-neutral-500 mt-1">The application you're looking for doesn't exist.</p>
        <Link
          href="/admin/dashboard/applications"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <i className="ri-arrow-left-line" aria-hidden="true"></i>
          Back to Applications
        </Link>
      </div>
    );
  }

  const statusInfo = statusLabels[application.status] || { label: application.status, color: 'bg-gray-100 text-gray-700', icon: 'ri-question-line' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/clients"
            className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <i className="ri-arrow-left-line text-lg text-neutral-500" aria-hidden="true"></i>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-neutral-900">{application.id}</h1>
              <span className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${statusInfo.color}`}>
                <i className={statusInfo.icon} aria-hidden="true"></i>
                {statusInfo.label}
              </span>
              <span className="text-xs text-neutral-500">
                Phase {application.phase}: {phaseLabels[application.phase]}
              </span>
            </div>
            <p className="text-sm text-neutral-500">{application.name} • {application.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {application.client_data && (
            <Link
              href={`/admin/clients/${application.client_data.client_id}`}
              className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2"
            >
              <i className="ri-user-line" aria-hidden="true"></i>
              View Client
            </Link>
          )}
          <button
            onClick={() => setShowStatusModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <i className="ri-edit-line" aria-hidden="true"></i>
            Change Status
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white rounded-lg border border-neutral-200 p-3">
          <p className="text-xs text-neutral-400">Service</p>
          <p className="text-sm font-medium text-neutral-900 capitalize">{application.service_type || 'Not Set'}</p>
        </div>
        <div className="bg-white rounded-lg border border-neutral-200 p-3">
          <p className="text-xs text-neutral-400">Package</p>
          <p className="text-sm font-medium text-neutral-900 capitalize">{application.package || 'None'}</p>
        </div>
        <div className="bg-white rounded-lg border border-neutral-200 p-3">
          <p className="text-xs text-neutral-400">Payment</p>
          <p className="text-sm font-medium text-green-600">
            ${application.payment_amount?.toLocaleString() || '0'}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-neutral-200 p-3">
          <p className="text-xs text-neutral-400">Documents</p>
          <p className="text-sm font-medium text-neutral-900">{application.documents?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg border border-neutral-200 p-3">
          <p className="text-xs text-neutral-400">Created</p>
          <p className="text-sm font-medium text-neutral-900">
            {new Date(application.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Portal Access Info */}
      {application.token && application.phase >= 3 && (
        <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                <i className="ri-key-2-line text-blue-600" aria-hidden="true"></i>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">Client Portal Access</h3>
                <p className="text-xs text-blue-600">Token and password for client login</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] text-blue-500">Token</p>
                <code className="text-xs bg-blue-100 px-1.5 py-0.5 rounded">{application.token.substring(0, 16)}...</code>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-blue-500">Password</p>
                <code className="text-xs bg-blue-100 px-1.5 py-0.5 rounded">{application.password}</code>
              </div>
              <button
                onClick={() => copyToClipboard(`Token: ${application.token}\nPassword: ${application.password}`)}
                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded"
              >
                <i className="ri-file-copy-line" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="flex border-b border-neutral-200">
          {(['overview', 'documents', 'financial', 'communication', 'notes', 'timeline'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-neutral-800">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <i className="ri-user-line text-neutral-400 text-sm" aria-hidden="true"></i>
                    <span className="text-neutral-600">{application.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-mail-line text-neutral-400 text-sm" aria-hidden="true"></i>
                    <span className="text-neutral-600">{application.email}</span>
                  </div>
                  {application.phone && (
                    <div className="flex items-center gap-2">
                      <i className="ri-phone-line text-neutral-400 text-sm" aria-hidden="true"></i>
                      <span className="text-neutral-600">{application.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <i className="ri-translate-2 text-neutral-400 text-sm" aria-hidden="true"></i>
                    <span className="text-neutral-600 uppercase">{application.locale || 'en'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-neutral-800">Application Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Service Type</span>
                    <span className="text-neutral-700 capitalize">{application.service_type || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Package</span>
                    <span className="text-neutral-700 capitalize">{application.package || 'None'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Current Phase</span>
                    <span className="text-neutral-700">Phase {application.phase}: {phaseLabels[application.phase]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Current Status</span>
                    <span className={`px-1.5 py-0.5 text-xs rounded ${statusInfo.color}`}>{statusInfo.label}</span>
                  </div>
                </div>
              </div>

              {application.client_data && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-neutral-800">Linked Client</h3>
                  <Link
                    href={`/admin/clients/${application.client_data.client_id}`}
                    className="block p-3 border border-neutral-200 rounded-lg hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-medium text-sm">
                        {application.client_data.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{application.client_data.name}</p>
                        <p className="text-xs text-neutral-500">{application.client_data.client_id}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-neutral-800">Dates</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Created</span>
                    <span className="text-neutral-700">{new Date(application.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Last Updated</span>
                    <span className="text-neutral-700">{new Date(application.updated_at).toLocaleDateString()}</span>
                  </div>
                  {application.completed_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400">Completed</span>
                      <span className="text-green-600">{new Date(application.completed_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-800">Uploaded Documents</h3>
                <span className="text-sm text-neutral-500">{application.documents?.length || 0} documents</span>
              </div>
              {application.documents && application.documents.length > 0 ? (
                <div className="space-y-3">
                  {application.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                          <i
                            className={`text-lg ${
                              doc.type?.includes('pdf') ? 'ri-file-pdf-line text-red-500' : 'ri-file-image-line text-blue-500'
                            }`}
                            aria-hidden="true"
                          ></i>
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-neutral-500">
                            Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            doc.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : doc.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {doc.status}
                        </span>
                        {doc.status === 'pending' && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => updateDocumentStatus(doc.id, 'approved')}
                              className="p-1.5 text-green-600 hover:bg-green-100 rounded"
                            >
                              <i className="ri-checkbox-circle-line" aria-hidden="true"></i>
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Rejection reason:');
                                if (reason) updateDocumentStatus(doc.id, 'rejected', reason);
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-100 rounded"
                            >
                              <i className="ri-close-circle-line" aria-hidden="true"></i>
                            </button>
                          </div>
                        )}
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-neutral-600 hover:bg-neutral-100 rounded"
                        >
                          <i className="ri-external-link-line" aria-hidden="true"></i>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="ri-file-line text-4xl text-neutral-300" aria-hidden="true"></i>
                  <p className="text-neutral-500 mt-2">No documents uploaded yet</p>
                </div>
              )}
            </div>
          )}

          {/* Financial Tab */}
          {activeTab === 'financial' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-600">Amount Paid</p>
                  <p className="text-lg font-semibold text-green-700">${application.payment_amount?.toLocaleString() || '0'}</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-xs text-neutral-500">Payment Method</p>
                  <p className="text-lg font-semibold text-neutral-700 capitalize">{application.payment_method || 'N/A'}</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-xs text-neutral-500">Payment Date</p>
                  <p className="text-lg font-semibold text-neutral-700">
                    {application.payment_date ? new Date(application.payment_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-neutral-800 mb-3">Payment Timeline</h4>
                <div className="space-y-2">
                  {application.timeline
                    ?.filter(t => t.status === 'payment_received' || t.note.toLowerCase().includes('payment'))
                    .map((event, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-neutral-500">{new Date(event.timestamp).toLocaleDateString()}</span>
                        <span>{event.note}</span>
                      </div>
                    ))}
                  {!application.timeline?.some(t => t.status === 'payment_received' || t.note.toLowerCase().includes('payment')) && (
                    <p className="text-neutral-500 text-sm">No payment events recorded</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Communication Tab */}
          {activeTab === 'communication' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-800">Communication History</h3>
                <div className="flex gap-2">
                  <a
                    href={`mailto:${application.email}`}
                    className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50 flex items-center gap-1"
                  >
                    <i className="ri-mail-line" aria-hidden="true"></i>
                    Email
                  </a>
                  {application.phone && (
                    <a
                      href={`https://wa.me/${application.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-sm border border-green-200 text-green-600 rounded-lg hover:bg-green-50 flex items-center gap-1"
                    >
                      <i className="ri-whatsapp-line" aria-hidden="true"></i>
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
              <div className="text-center py-8 text-neutral-500">
                <i className="ri-chat-3-line text-4xl text-neutral-300 mb-2" aria-hidden="true"></i>
                <p>Communication log coming soon</p>
                <p className="text-sm">Email and WhatsApp history will appear here</p>
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-800">Internal Notes</h3>
                <button
                  onClick={() => setShowAddNote(true)}
                  className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-1"
                >
                  <i className="ri-add-line" aria-hidden="true"></i>
                  Add Note
                </button>
              </div>

              {showAddNote && (
                <div className="border border-neutral-200 rounded-lg p-4">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Write a note..."
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => {
                        setShowAddNote(false);
                        setNewNote('');
                      }}
                      className="px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addNote}
                      className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              )}

              {application.notes && application.notes.length > 0 ? (
                <div className="space-y-3">
                  {application.notes.map((note) => (
                    <div key={note.id} className="border border-neutral-200 rounded-lg p-4">
                      <p className="text-neutral-700">{note.content}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-neutral-500">
                        <span>{note.created_by}</span>
                        <span>•</span>
                        <span>{new Date(note.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="ri-sticky-note-line text-4xl text-neutral-300" aria-hidden="true"></i>
                  <p className="text-neutral-500 mt-2">No notes yet</p>
                </div>
              )}
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-neutral-800">Activity Timeline</h3>
              {application.timeline && application.timeline.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200"></div>
                  <div className="space-y-4">
                    {[...application.timeline].reverse().map((event, index) => {
                      const eventStatus = statusLabels[event.status];
                      return (
                        <div key={index} className="relative pl-10">
                          <div className={`absolute left-2 w-5 h-5 rounded-full flex items-center justify-center ${eventStatus?.color || 'bg-neutral-100'}`}>
                            <i className={`${eventStatus?.icon || 'ri-time-line'} text-xs`} aria-hidden="true"></i>
                          </div>
                          <div className="bg-neutral-50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-0.5 text-xs rounded ${eventStatus?.color || 'bg-neutral-100 text-neutral-600'}`}>
                                {eventStatus?.label || event.status}
                              </span>
                              <span className="text-xs text-neutral-500">
                                {new Date(event.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{event.note}</p>
                            <p className="text-xs text-neutral-500 mt-1">by {event.by}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="ri-time-line text-4xl text-neutral-300" aria-hidden="true"></i>
                  <p className="text-neutral-500 mt-2">No timeline events</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Change Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg"
                >
                  <option value="">Select status</option>
                  {Object.entries(statusLabels).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Note</label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Add a note about this change..."
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setNewStatus('');
                  setStatusNote('');
                }}
                className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={updateStatus}
                disabled={!newStatus}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
