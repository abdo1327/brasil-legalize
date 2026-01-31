'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/lib/admin/auth';
import { useAdminLocale } from '@/components/admin/Header';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface Client {
  id: string;
  lead_id: number | null;
  name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  city: string | null;
  country: string | null;
  locale: string;
  avatar_url: string | null;
  service_type: string | null;
  package: string | null;
  family_adults: number;
  family_children: number;
  expected_travel_date: string | null;
  expected_due_date: string | null;
  source: string;
  referral_source: string | null;
  is_historical: boolean;
  tags: string[];
  financial: {
    total_paid: number;
    total_due: number;
    currency: string;
    payments: Payment[];
  };
  cases: string[];
  cases_data?: Case[];
  notes: Note[];
  communication: Communication[];
  created_at: string;
  updated_at: string;
}

interface Case {
  id: string;
  status: string;
  phase: number;
  service_type: string;
  package: string | null;
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
  status: 'pending' | 'approved' | 'rejected';
  uploaded_at: string;
}

interface Note {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
}

interface Communication {
  id: string;
  type: 'email' | 'whatsapp' | 'call' | 'note';
  subject: string;
  content: string;
  sent_at: string;
  sent_by: string;
}

interface Payment {
  id: string;
  amount: number;
  method: string;
  reference: string | null;
  date: string;
  notes: string;
  recorded_at: string;
  recorded_by: string;
}

interface TimelineEvent {
  status: string;
  timestamp: string;
  by: string;
  note: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'Contacted', color: 'bg-purple-100 text-purple-700' },
  qualified: { label: 'Qualified', color: 'bg-indigo-100 text-indigo-700' },
  consultation_booked: { label: 'Consultation Booked', color: 'bg-cyan-100 text-cyan-700' },
  consultation_done: { label: 'Consultation Done', color: 'bg-teal-100 text-teal-700' },
  proposal_sent: { label: 'Proposal Sent', color: 'bg-amber-100 text-amber-700' },
  contract_signed: { label: 'Contract Signed', color: 'bg-lime-100 text-lime-700' },
  payment_received: { label: 'Payment Received', color: 'bg-green-100 text-green-700' },
  docs_requested: { label: 'Docs Requested', color: 'bg-orange-100 text-orange-700' },
  docs_uploading: { label: 'Docs Uploading', color: 'bg-yellow-100 text-yellow-700' },
  docs_complete: { label: 'Docs Complete', color: 'bg-emerald-100 text-emerald-700' },
  under_review: { label: 'Under Review', color: 'bg-sky-100 text-sky-700' },
  submitted: { label: 'Submitted', color: 'bg-violet-100 text-violet-700' },
  in_progress: { label: 'In Progress', color: 'bg-fuchsia-100 text-fuchsia-700' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700' },
  completed: { label: 'Completed', color: 'bg-green-200 text-green-800' },
  on_hold: { label: 'On Hold', color: 'bg-gray-100 text-gray-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
};

const phaseLabels: Record<number, string> = {
  1: 'Lead Capture & Qualification',
  2: 'Onboarding & Payment',
  3: 'Document Collection & Processing',
  4: 'Submission & Completion',
};

// Cases Tab Component with Reopen functionality
function CasesTab({ 
  client, 
  onRefresh, 
  statusLabels, 
  phaseLabels 
}: { 
  client: Client; 
  onRefresh: () => void;
  statusLabels: Record<string, { label: string; color: string }>;
  phaseLabels: Record<number, string>;
}) {
  const { t } = useAdminLocale();
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [reopenCaseId, setReopenCaseId] = useState<string | null>(null);
  const [reopenPhase, setReopenPhase] = useState<number>(3);
  const [reopenStatus, setReopenStatus] = useState<string>('onboarding');
  const [reopenNote, setReopenNote] = useState('');
  const [isReopening, setIsReopening] = useState(false);
  const [isCreatingCase, setIsCreatingCase] = useState(false);
  const [newCase, setNewCase] = useState({
    service_type: '',
    package: '',
    phase: 1,
    status: 'new',
    note: '',
  });

  const phaseStatuses: Record<number, { value: string; label: string }[]> = {
    1: [
      { value: 'new', label: 'New' },
      { value: 'contacted', label: 'Contacted' },
      { value: 'meeting_scheduled', label: 'Meeting Scheduled' },
      { value: 'meeting_completed', label: 'Meeting Completed' },
    ],
    2: [
      { value: 'proposal_sent', label: 'Proposal Sent' },
      { value: 'negotiating', label: 'Negotiating' },
      { value: 'awaiting_payment', label: 'Awaiting Payment' },
      { value: 'payment_received', label: 'Payment Received' },
    ],
    3: [
      { value: 'onboarding', label: 'Onboarding' },
      { value: 'documents_pending', label: 'Documents Pending' },
      { value: 'documents_review', label: 'Documents Review' },
      { value: 'application_submitted', label: 'Application Submitted' },
    ],
    4: [
      { value: 'processing', label: 'Processing' },
      { value: 'approved', label: 'Approved' },
      { value: 'finalizing', label: 'Finalizing' },
      { value: 'completed', label: 'Completed' },
    ],
  };

  const handlePhaseChange = (phase: number) => {
    setReopenPhase(phase);
    setReopenStatus(phaseStatuses[phase][0].value);
  };

  const handleReopen = async () => {
    if (!reopenCaseId) return;
    setIsReopening(true);

    try {
      const response = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: reopenCaseId,
          action: 'reopen',
          phase: reopenPhase,
          status: reopenStatus,
          note: reopenNote || `Application reopened to Phase ${reopenPhase}`,
          admin_name: 'Admin',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShowReopenModal(false);
        setReopenCaseId(null);
        setReopenNote('');
        onRefresh();
      } else {
        alert(data.error || 'Failed to reopen application');
      }
    } catch (error) {
      console.error('Error reopening application:', error);
      alert('Failed to reopen application');
    } finally {
      setIsReopening(false);
    }
  };

  const createNewCase = async () => {
    setIsCreatingCase(true);
    try {
      const response = await fetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone,
          locale: client.locale,
          service_type: newCase.service_type,
          package: newCase.package,
          phase: newCase.phase,
          status: newCase.status,
          note: newCase.note || `New case created for client ${client.name}`,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShowNewCaseModal(false);
        setNewCase({ service_type: '', package: '', phase: 1, status: 'new', note: '' });
        onRefresh();
      } else {
        alert(data.error || 'Failed to create case');
      }
    } catch (error) {
      console.error('Error creating case:', error);
      alert('Failed to create case');
    } finally {
      setIsCreatingCase(false);
    }
  };

  const openReopenModal = (caseId: string) => {
    setReopenCaseId(caseId);
    setReopenPhase(3);
    setReopenStatus('onboarding');
    setReopenNote('');
    setShowReopenModal(true);
  };

  // Helper to check if a case is archived or completed
  const isArchivedOrCompleted = (caseItem: Case) => {
    return caseItem.status === 'completed' || (caseItem as any).archived === true;
  };

  // Calculate days until archive
  const getDaysUntilArchive = (archiveAfter: string | null) => {
    if (!archiveAfter) return null;
    const diff = new Date(archiveAfter).getTime() - Date.now();
    if (diff <= 0) return 'archived';
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="font-semibold text-neutral-900">{t.clients.allCases} ({client.cases_data?.length || 0})</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewCaseModal(true)}
            className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-1"
          >
            <i className="ri-add-line" aria-hidden="true"></i>
            {t.clients.newCase}
          </button>
          <Link
            href={`/admin/dashboard/applications?client=${client.id}`}
            className="text-sm text-primary hover:underline"
          >
            {t.clients.viewInPipeline}
          </Link>
        </div>
      </div>
      
      {client.cases_data && client.cases_data.length > 0 ? (
        <div className="space-y-3">
          {client.cases_data.map((caseItem) => {
            const isCompletedOrArchived = isArchivedOrCompleted(caseItem);
            const daysUntilArchive = getDaysUntilArchive(caseItem.archive_after);
            
            return (
              <div
                key={caseItem.id}
                className={`border rounded-xl p-4 transition-colors ${
                  isCompletedOrArchived 
                    ? 'border-green-200 bg-green-50/50' 
                    : 'border-neutral-200 hover:border-primary'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-medium">{caseItem.id}</span>
                      <span className={`px-2 py-1 text-xs rounded ${statusLabels[caseItem.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                        {statusLabels[caseItem.status]?.label || caseItem.status}
                      </span>
                      <span className="px-2 py-1 text-xs bg-neutral-100 text-neutral-600 rounded">
                        Phase {caseItem.phase}: {phaseLabels[caseItem.phase]}
                      </span>
                      {isCompletedOrArchived && daysUntilArchive && daysUntilArchive !== 'archived' && (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
                          Archives in {daysUntilArchive} days
                        </span>
                      )}
                      {daysUntilArchive === 'archived' && (
                        <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                          Archived
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500 mt-1">
                      {caseItem.service_type || 'No service'} • {caseItem.package || 'No package'} • 
                      Created {new Date(caseItem.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Reopen button for completed/archived cases */}
                    {isCompletedOrArchived && (
                      <button
                        onClick={() => openReopenModal(caseItem.id)}
                        className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1"
                      >
                        <i className="ri-restart-line" aria-hidden="true"></i>
                        Reopen
                      </button>
                    )}
                    <Link
                      href={`/admin/dashboard/applications/${caseItem.id}`}
                      className="p-2 text-neutral-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <i className="ri-arrow-right-line text-xl" aria-hidden="true"></i>
                    </Link>
                  </div>
                </div>
                
                {caseItem.timeline && caseItem.timeline.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-neutral-100">
                    <p className="text-xs text-neutral-500">
                      Last update: {caseItem.timeline[caseItem.timeline.length - 1].note} - {' '}
                      {new Date(caseItem.timeline[caseItem.timeline.length - 1].timestamp).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <i className="ri-briefcase-line text-4xl text-neutral-300" aria-hidden="true"></i>
          <p className="text-neutral-500 mt-2">No cases yet</p>
          <button
            onClick={() => setShowNewCaseModal(true)}
            className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Create First Case
          </button>
        </div>
      )}

      {/* New Case Modal */}
      {showNewCaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create New Case</h3>
              <button
                onClick={() => setShowNewCaseModal(false)}
                className="p-1 hover:bg-neutral-100 rounded-lg"
              >
                <i className="ri-close-line text-xl" aria-hidden="true"></i>
              </button>
            </div>
            
            <p className="text-neutral-600 text-sm mb-4">
              Create a new case for {client.name}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Service Type</label>
                <select
                  value={newCase.service_type}
                  onChange={(e) => setNewCase({ ...newCase, service_type: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Service</option>
                  <option value="visa">Visa Services</option>
                  <option value="residency">Residency</option>
                  <option value="birth_tourism">Birth Tourism</option>
                  <option value="citizenship">Citizenship</option>
                  <option value="document">Document Services</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Package</label>
                <select
                  value={newCase.package}
                  onChange={(e) => setNewCase({ ...newCase, package: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">No Package</option>
                  <option value="basic">Basic</option>
                  <option value="complete">Complete</option>
                  <option value="premium">Premium</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Starting Phase</label>
                <select
                  value={newCase.phase}
                  onChange={(e) => {
                    const phase = parseInt(e.target.value);
                    setNewCase({ ...newCase, phase, status: phaseStatuses[phase][0].value });
                  }}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={1}>Phase 1: Lead</option>
                  <option value={2}>Phase 2: Potential</option>
                  <option value={3}>Phase 3: Active Client</option>
                  <option value={4}>Phase 4: Completion</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Starting Status</label>
                <select
                  value={newCase.status}
                  onChange={(e) => setNewCase({ ...newCase, status: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {phaseStatuses[newCase.phase].map((status) => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Note (Optional)</label>
                <textarea
                  value={newCase.note}
                  onChange={(e) => setNewCase({ ...newCase, note: e.target.value })}
                  placeholder="Add a note about this case..."
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNewCaseModal(false)}
                className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createNewCase}
                disabled={isCreatingCase}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isCreatingCase && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Create Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reopen Modal */}
      {showReopenModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Reopen Case</h3>
              <button
                onClick={() => setShowReopenModal(false)}
                className="p-1 hover:bg-neutral-100 rounded-lg"
              >
                <i className="ri-close-line text-xl" aria-hidden="true"></i>
              </button>
            </div>
            
            <p className="text-neutral-600 text-sm mb-4">
              Reopening this case will remove it from completed status and return it to active workflow.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Target Phase
                </label>
                <select
                  value={reopenPhase}
                  onChange={(e) => handlePhaseChange(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={1}>Phase 1: Lead</option>
                  <option value={2}>Phase 2: Potential</option>
                  <option value={3}>Phase 3: Active Client</option>
                  <option value={4}>Phase 4: Completion</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Target Status
                </label>
                <select
                  value={reopenStatus}
                  onChange={(e) => setReopenStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {phaseStatuses[reopenPhase].map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Note (Optional)
                </label>
                <textarea
                  value={reopenNote}
                  onChange={(e) => setReopenNote(e.target.value)}
                  placeholder="Reason for reopening..."
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowReopenModal(false)}
                className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReopen}
                disabled={isReopening}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isReopening && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Reopen Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClientProfilePage({ params }: { params: { id: string } }) {
  const { admin } = useAdminAuth();
  const { t } = useAdminLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'documents' | 'financial' | 'communication' | 'notes'>('overview');
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({ amount: '', method: 'card', reference: '', notes: '' });

  // Handle tab from URL query parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'cases', 'documents', 'financial', 'communication', 'notes'].includes(tab)) {
      setActiveTab(tab as typeof activeTab);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchClient();
  }, [params.id]);

  const fetchClient = async () => {
    try {
      const response = await fetch(`/api/admin/clients?id=${params.id}&action=profile`);
      const data = await response.json();
      
      if (data.success) {
        // Normalize the client data structure
        const clientData = data.client;
        setClient({
          ...clientData,
          id: clientData.client_id || clientData.id,
          tags: Array.isArray(clientData.tags) ? clientData.tags : [],
          financial: {
            total_paid: parseFloat(clientData.total_paid) || 0,
            total_due: parseFloat(clientData.total_due) || 0,
            currency: clientData.currency || 'USD',
            payments: Array.isArray(clientData.payments) ? clientData.payments : [],
          },
          notes: Array.isArray(clientData.notes) ? clientData.notes : [],
          communication: Array.isArray(clientData.communications) ? clientData.communications : [],
          cases_data: clientData.cases_data || [],
        });
      }
    } catch (error) {
      console.error('Error fetching client:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      const response = await fetch(`/api/admin/clients`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: params.id, 
          action: 'add-note',
          note: newNote, 
          by: admin?.name || 'Admin' 
        }),
      });

      if (response.ok) {
        setNewNote('');
        setShowAddNote(false);
        fetchClient();
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const addPayment = async () => {
    if (!newPayment.amount) return;

    try {
      const response = await fetch(`/api/admin/clients`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: params.id,
          action: 'add-payment',
          amount: parseFloat(newPayment.amount),
          method: newPayment.method,
          description: newPayment.notes,
          by: admin?.name || 'Admin',
        }),
      });

      if (response.ok) {
        setNewPayment({ amount: '', method: 'card', reference: '', notes: '' });
        setShowAddPayment(false);
        fetchClient();
      }
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-user-unfollow-line text-3xl text-neutral-400" aria-hidden="true"></i>
        </div>
        <h3 className="font-semibold text-neutral-900">Client not found</h3>
        <p className="text-neutral-500 mt-1">The client you're looking for doesn't exist.</p>
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <i className="ri-arrow-left-line" aria-hidden="true"></i>
          Back to Clients
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/clients"
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <i className="ri-arrow-left-line text-xl" aria-hidden="true"></i>
          </Link>
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-2xl font-bold">
            {getInitials(client.name)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-neutral-900">{client.name}</h1>
              {client.is_historical && (
                <span className="px-2 py-1 text-xs bg-neutral-100 text-neutral-600 rounded">Historical</span>
              )}
              {client.tags?.map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-neutral-500">{client.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`mailto:${client.email}`}
            className="p-2 text-neutral-500 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
            title="Send Email"
          >
            <i className="ri-mail-line text-xl" aria-hidden="true"></i>
          </a>
          {client.whatsapp && (
            <a
              href={`https://wa.me/${client.whatsapp?.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-neutral-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="WhatsApp"
            >
              <i className="ri-whatsapp-line text-xl" aria-hidden="true"></i>
            </a>
          )}
          <Link
            href={`/admin/clients/${client.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <i className="ri-edit-line" aria-hidden="true"></i>
            {t.common.edit}
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <p className="text-sm text-neutral-500">{t.clients.totalCases}</p>
          <p className="text-2xl font-bold text-neutral-900">{client.cases_data?.length || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <p className="text-sm text-neutral-500">{t.clients.totalPaid}</p>
          <p className="text-2xl font-bold text-green-600">${client.financial?.total_paid?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <p className="text-sm text-neutral-500">{t.clients.balanceDue}</p>
          <p className="text-2xl font-bold text-red-600">
            ${((client.financial?.total_due || 0) - (client.financial?.total_paid || 0)).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <p className="text-sm text-neutral-500">{t.clients.family}</p>
          <p className="text-2xl font-bold text-neutral-900">
            {client.family_adults} + {client.family_children}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <p className="text-sm text-neutral-500">{t.clients.source}</p>
          <p className="text-lg font-semibold text-neutral-900 capitalize">{client.source}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-neutral-200">
        <div className="flex border-b border-neutral-200 overflow-x-auto scrollbar-hide">
          {(['overview', 'cases', 'documents', 'financial', 'communication', 'notes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {t.clients.tabs[tab]}
            </button>
          ))}
        </div>

        <div className="p-4 md:p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-neutral-800">{t.clients.contactInfo}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <i className="ri-mail-line text-neutral-400" aria-hidden="true"></i>
                    <span>{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-3">
                      <i className="ri-phone-line text-neutral-400" aria-hidden="true"></i>
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.whatsapp && (
                    <div className="flex items-center gap-3">
                      <i className="ri-whatsapp-line text-green-600" aria-hidden="true"></i>
                      <span>{client.whatsapp}</span>
                    </div>
                  )}
                  {client.city && (
                    <div className="flex items-center gap-3">
                      <i className="ri-map-pin-line text-neutral-400" aria-hidden="true"></i>
                      <span>{client.city}, {client.country}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-neutral-800">{t.clients.serviceDetails}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">{t.clients.serviceType}</span>
                    <span className="font-medium capitalize">{client.service_type || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">{t.clients.package}</span>
                    <span className="font-medium capitalize">{client.package || 'Not selected'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">{t.clients.preferredLanguage}</span>
                    <span className="font-medium uppercase">{client.locale}</span>
                  </div>
                  {client.expected_travel_date && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">{t.clients.expectedTravel}</span>
                      <span className="font-medium">
                        {new Date(client.expected_travel_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-neutral-800">{t.clients.accountInfo}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">{t.clients.clientSince}</span>
                    <span className="font-medium">
                      {new Date(client.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">{t.clients.lastUpdated}</span>
                    <span className="font-medium">
                      {new Date(client.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  {client.referral_source && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">{t.clients.referredBy}</span>
                      <span className="font-medium">{client.referral_source}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Cases Tab */}
          {activeTab === 'cases' && (
            <CasesTab 
              client={client} 
              onRefresh={fetchClient}
              statusLabels={statusLabels}
              phaseLabels={phaseLabels}
            />
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-neutral-800">All Documents</h3>
              {client.cases_data?.some((c) => c.documents?.length > 0) ? (
                <div className="space-y-4">
                  {client.cases_data.map((caseItem) =>
                    caseItem.documents?.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                            <i
                              className={`text-lg ${
                                doc.type.includes('pdf') ? 'ri-file-pdf-line text-red-500' : 'ri-file-image-line text-blue-500'
                              }`}
                              aria-hidden="true"
                            ></i>
                          </div>
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-neutral-500">
                              Case: {caseItem.id} • Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
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
                      </div>
                    ))
                  )}
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
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-800">Payment History</h3>
                <button
                  onClick={() => setShowAddPayment(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <i className="ri-add-line" aria-hidden="true"></i>
                  Add Payment
                </button>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm text-green-700">Total Paid</p>
                  <p className="text-2xl font-bold text-green-700">
                    ${client.financial?.total_paid?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                  <p className="text-sm text-amber-700">Total Due</p>
                  <p className="text-2xl font-bold text-amber-700">
                    ${client.financial?.total_due?.toLocaleString() || 0}
                  </p>
                </div>
                <div className={`rounded-xl p-4 ${
                  (client.financial?.total_due || 0) - (client.financial?.total_paid || 0) > 0
                    ? 'bg-red-50'
                    : 'bg-green-50'
                }`}>
                  <p className={`text-sm ${
                    (client.financial?.total_due || 0) - (client.financial?.total_paid || 0) > 0
                      ? 'text-red-700'
                      : 'text-green-700'
                  }`}>Balance</p>
                  <p className={`text-2xl font-bold ${
                    (client.financial?.total_due || 0) - (client.financial?.total_paid || 0) > 0
                      ? 'text-red-700'
                      : 'text-green-700'
                  }`}>
                    ${((client.financial?.total_due || 0) - (client.financial?.total_paid || 0)).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Payments List */}
              {client.financial?.payments && client.financial.payments.length > 0 ? (
                <div className="space-y-3">
                  {client.financial.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-green-600">+${payment.amount.toLocaleString()}</span>
                          <span className="text-sm text-neutral-500 capitalize">via {payment.method}</span>
                        </div>
                        <p className="text-sm text-neutral-500">
                          {new Date(payment.date).toLocaleDateString()} • Recorded by {payment.recorded_by}
                        </p>
                        {payment.notes && <p className="text-sm text-neutral-600 mt-1">{payment.notes}</p>}
                      </div>
                      {payment.reference && (
                        <span className="text-sm text-neutral-500">Ref: {payment.reference}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="ri-money-dollar-circle-line text-4xl text-neutral-300" aria-hidden="true"></i>
                  <p className="text-neutral-500 mt-2">No payments recorded yet</p>
                </div>
              )}

              {/* Add Payment Modal */}
              {showAddPayment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 w-full max-w-md">
                    <h3 className="font-semibold text-lg mb-4">Add Payment</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-neutral-600 mb-1">Amount *</label>
                        <input
                          type="number"
                          value={newPayment.amount}
                          onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                          className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-neutral-600 mb-1">Method</label>
                        <select
                          value={newPayment.method}
                          onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                          className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                        >
                          <option value="card">Credit Card</option>
                          <option value="bank">Bank Transfer</option>
                          <option value="cash">Cash</option>
                          <option value="pix">PIX</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-neutral-600 mb-1">Reference</label>
                        <input
                          type="text"
                          value={newPayment.reference}
                          onChange={(e) => setNewPayment({ ...newPayment, reference: e.target.value })}
                          className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                          placeholder="Transaction ID, check number, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-neutral-600 mb-1">Notes</label>
                        <textarea
                          value={newPayment.notes}
                          onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                          className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                          rows={2}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={() => setShowAddPayment(false)}
                        className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addPayment}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                      >
                        Add Payment
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Communication Tab */}
          {activeTab === 'communication' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-neutral-800">Communication History</h3>
              {client.communication && client.communication.length > 0 ? (
                <div className="space-y-3">
                  {client.communication.map((comm) => (
                    <div key={comm.id} className="p-4 border border-neutral-200 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <i
                          className={`${
                            comm.type === 'email'
                              ? 'ri-mail-line'
                              : comm.type === 'whatsapp'
                              ? 'ri-whatsapp-line text-green-600'
                              : comm.type === 'call'
                              ? 'ri-phone-line'
                              : 'ri-sticky-note-line'
                          }`}
                          aria-hidden="true"
                        ></i>
                        <span className="font-medium capitalize">{comm.type}</span>
                        <span className="text-sm text-neutral-500">
                          • {new Date(comm.sent_at).toLocaleString()}
                        </span>
                      </div>
                      {comm.subject && <p className="font-medium">{comm.subject}</p>}
                      <p className="text-neutral-600">{comm.content}</p>
                      <p className="text-sm text-neutral-500 mt-2">By {comm.sent_by}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="ri-chat-1-line text-4xl text-neutral-300" aria-hidden="true"></i>
                  <p className="text-neutral-500 mt-2">No communication logged yet</p>
                </div>
              )}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-800">Internal Notes</h3>
                <button
                  onClick={() => setShowAddNote(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <i className="ri-add-line" aria-hidden="true"></i>
                  Add Note
                </button>
              </div>

              {showAddNote && (
                <div className="p-4 border border-primary rounded-xl">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                    rows={3}
                    placeholder="Add a note..."
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setShowAddNote(false)}
                      className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addNote}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              )}

              {client.notes && client.notes.length > 0 ? (
                <div className="space-y-3">
                  {client.notes.map((note) => (
                    <div key={note.id} className="p-4 border border-neutral-200 rounded-xl">
                      <p className="text-neutral-900">{note.content}</p>
                      <p className="text-sm text-neutral-500 mt-2">
                        {note.created_by} • {new Date(note.created_at).toLocaleString()}
                      </p>
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
        </div>
      </div>
    </div>
  );
}
