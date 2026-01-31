'use client';

import { useState, useEffect, useRef } from 'react';
import { useAdminAuth } from '@/lib/admin/auth';
import Link from 'next/link';

interface Document {
  id: number;
  client_id: number;
  case_id: number | null;
  original_name: string;
  stored_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  document_type: string;
  label: string;
  description: string | null;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  uploaded_by_type: 'admin' | 'client';
  uploaded_by: string;
  created_at: string;
  client_name: string;
  client_email: string;
  client_code: string;
  case_code: string | null;
}

interface Client {
  id: number;
  client_id: string;
  name: string;
  email: string;
}

interface Case {
  id: number;
  application_id: string;
  name: string;
}

interface Stats {
  internal_count: number;
  external_count: number;
  pending_count: number;
  approved_count: number;
  rejected_count: number;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const statusIcons: Record<string, string> = {
  pending: 'ri-time-line',
  approved: 'ri-checkbox-circle-line',
  rejected: 'ri-close-circle-line',
};

export default function DocumentsPage() {
  const { admin, isLoading: authLoading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'internal' | 'external'>('external');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [uploadData, setUploadData] = useState({
    clientId: '',
    caseId: '',
    documentType: 'general',
    label: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewDoc, setReviewDoc] = useState<Document | null>(null);
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected'>('approved');
  const [rejectionReason, setRejectionReason] = useState('');
  const [reviewing, setReviewing] = useState(false);

  // Preview modal state
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('type', activeTab);
      if (statusFilter !== 'all') {
        params.set('status', statusFilter);
      }
      
      const res = await fetch(`/api/admin/documents?${params.toString()}`);
      const data = await res.json();
      
      if (data.success) {
        setDocuments(data.documents);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/admin/clients');
      const data = await res.json();
      if (data.success) {
        setClients(data.items || data.clients || []);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchCases = async (clientId: string) => {
    if (!clientId) {
      setCases([]);
      return;
    }
    try {
      const res = await fetch(`/api/admin/clients?id=${clientId}&action=cases`);
      const data = await res.json();
      if (data.success) {
        setCases(data.cases || []);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [activeTab, statusFilter]);

  useEffect(() => {
    if (showUploadModal) {
      fetchClients();
    }
  }, [showUploadModal]);

  useEffect(() => {
    if (uploadData.clientId) {
      fetchCases(uploadData.clientId);
    }
  }, [uploadData.clientId]);

  const handleUpload = async () => {
    if (!selectedFile || !uploadData.clientId) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('clientId', uploadData.clientId);
      if (uploadData.caseId) formData.append('caseId', uploadData.caseId);
      formData.append('documentType', uploadData.documentType);
      formData.append('label', uploadData.label || selectedFile.name);
      if (uploadData.description) formData.append('description', uploadData.description);
      formData.append('uploadedBy', admin?.name || 'Admin');

      const res = await fetch('/api/admin/documents', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setShowUploadModal(false);
        setSelectedFile(null);
        setUploadData({ clientId: '', caseId: '', documentType: 'general', label: '', description: '' });
        fetchDocuments();
      } else {
        alert(data.error || 'Failed to upload document');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleReview = async () => {
    if (!reviewDoc) return;
    
    setReviewing(true);
    try {
      const res = await fetch('/api/admin/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: reviewDoc.id,
          action: 'review',
          status: reviewAction,
          rejectionReason: reviewAction === 'rejected' ? rejectionReason : null,
          reviewedBy: admin?.name || 'Admin',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowReviewModal(false);
        setReviewDoc(null);
        setRejectionReason('');
        fetchDocuments();
      } else {
        alert(data.error || 'Failed to review document');
      }
    } catch (error) {
      console.error('Error reviewing:', error);
      alert('Failed to review document');
    } finally {
      setReviewing(false);
    }
  };

  const handleDelete = async (docId: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      const res = await fetch(`/api/admin/documents?id=${docId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        fetchDocuments();
      } else {
        alert(data.error || 'Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return 'ri-file-pdf-line text-red-500';
    if (mimeType.includes('image')) return 'ri-image-line text-blue-500';
    return 'ri-file-line text-neutral-500';
  };

  const filteredDocuments = documents.filter(doc => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      doc.original_name.toLowerCase().includes(query) ||
      doc.label?.toLowerCase().includes(query) ||
      doc.client_name?.toLowerCase().includes(query) ||
      doc.client_code?.toLowerCase().includes(query)
    );
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-neutral-900">Documents</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage client and internal documents</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto"
        >
          <i className="ri-upload-2-line" aria-hidden="true"></i>
          Upload Document
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
          <div className="bg-white rounded-xl p-4 border border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-folder-user-line text-blue-600"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{stats.external_count || 0}</p>
                <p className="text-xs text-neutral-500">Client Uploads</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-folder-shield-line text-purple-600"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{stats.internal_count || 0}</p>
                <p className="text-xs text-neutral-500">Internal Docs</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-yellow-600"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{stats.pending_count || 0}</p>
                <p className="text-xs text-neutral-500">Pending Review</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-green-600"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{stats.approved_count || 0}</p>
                <p className="text-xs text-neutral-500">Approved</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="ri-close-circle-line text-red-600"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{stats.rejected_count || 0}</p>
                <p className="text-xs text-neutral-500">Rejected</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs & Filters */}
      <div className="bg-white rounded-xl border border-neutral-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-neutral-200 px-4">
          <div className="flex border-b lg:border-b-0 border-neutral-100">
            <button
              onClick={() => setActiveTab('external')}
              className={`px-3 lg:px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'external'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <i className="ri-user-line mr-1 lg:mr-2"></i>
              <span className="hidden sm:inline">Client </span>Uploads
            </button>
            <button
              onClick={() => setActiveTab('internal')}
              className={`px-3 lg:px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'internal'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <i className="ri-shield-user-line mr-1 lg:mr-2"></i>
              Internal<span className="hidden sm:inline"> Docs</span>
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 py-3 lg:py-2">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></i>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-48 lg:w-64 pl-10 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Documents List */}
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <i className="ri-file-search-line text-5xl text-neutral-300"></i>
              <p className="text-neutral-500 mt-3">No documents found</p>
              <p className="text-neutral-400 text-sm mt-1">
                {activeTab === 'internal' 
                  ? 'Upload internal documents using the button above'
                  : 'Client documents will appear here when uploaded'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 border border-neutral-200 rounded-xl hover:border-primary/30 transition-colors"
                >
                  {/* File Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className={`${getFileIcon(doc.mime_type)} text-xl sm:text-2xl`}></i>
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium text-neutral-900 truncate text-sm sm:text-base">{doc.label || doc.original_name}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[doc.status]}`}>
                        <i className={`${statusIcons[doc.status]} mr-1`}></i>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-xs sm:text-sm text-neutral-500">
                      <span className="flex items-center gap-1">
                        <i className="ri-user-line"></i>
                        <Link href={`/admin/clients/${doc.client_code}`} className="hover:text-primary truncate max-w-[100px] sm:max-w-none">
                          {doc.client_name || doc.client_code}
                        </Link>
                      </span>
                      {doc.case_code && (
                        <span className="flex items-center gap-1">
                          <i className="ri-briefcase-line"></i>
                          {doc.case_code}
                        </span>
                      )}
                      <span>{formatFileSize(doc.file_size)}</span>
                      <span className="hidden sm:inline">{formatDate(doc.created_at)}</span>
                    </div>
                    {doc.status === 'rejected' && doc.rejection_reason && (
                      <p className="text-sm text-red-600 mt-1">
                        <i className="ri-error-warning-line mr-1"></i>
                        {doc.rejection_reason}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setPreviewDoc(doc);
                        setShowPreviewModal(true);
                      }}
                      className="p-2 text-neutral-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Preview"
                    >
                      <i className="ri-eye-line text-xl"></i>
                    </button>
                    {doc.status === 'pending' && (
                      <button
                        onClick={() => {
                          setReviewDoc(doc);
                          setReviewAction('approved');
                          setShowReviewModal(true);
                        }}
                        className="p-2 text-neutral-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Review"
                      >
                        <i className="ri-check-double-line text-xl"></i>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <i className="ri-delete-bin-line text-xl"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upload Internal Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 hover:bg-neutral-100 rounded-lg"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              {/* File Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  selectedFile ? 'border-primary bg-primary/5' : 'border-neutral-300 hover:border-primary'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                {selectedFile ? (
                  <div>
                    <i className="ri-file-check-line text-4xl text-primary"></i>
                    <p className="font-medium text-neutral-900 mt-2">{selectedFile.name}</p>
                    <p className="text-sm text-neutral-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                ) : (
                  <div>
                    <i className="ri-upload-cloud-line text-4xl text-neutral-400"></i>
                    <p className="font-medium text-neutral-700 mt-2">Click to upload</p>
                    <p className="text-sm text-neutral-500">PDF, JPG, PNG, WEBP (max 25MB)</p>
                  </div>
                )}
              </div>

              {/* Client Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Client *</label>
                <select
                  value={uploadData.clientId}
                  onChange={(e) => setUploadData({ ...uploadData, clientId: e.target.value, caseId: '' })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select a client</option>
                  {(clients || []).map((client) => (
                    <option key={client.id} value={client.client_id}>
                      {client.name} ({client.client_id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Case Selection */}
              {cases.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Case (Optional)</label>
                  <select
                    value={uploadData.caseId}
                    onChange={(e) => setUploadData({ ...uploadData, caseId: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">General (No specific case)</option>
                    {cases.map((c: any) => (
                      <option key={c.id} value={c.application_id}>
                        {c.application_id} - {c.service_type || 'Unknown service'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Document Type</label>
                <select
                  value={uploadData.documentType}
                  onChange={(e) => setUploadData({ ...uploadData, documentType: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="general">General</option>
                  <option value="contract">Contract</option>
                  <option value="receipt">Receipt</option>
                  <option value="certificate">Certificate</option>
                  <option value="form">Form</option>
                  <option value="report">Report</option>
                  <option value="correspondence">Correspondence</option>
                </select>
              </div>

              {/* Label */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Label</label>
                <input
                  type="text"
                  value={uploadData.label}
                  onChange={(e) => setUploadData({ ...uploadData, label: e.target.value })}
                  placeholder="Document label..."
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Description (Optional)</label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  placeholder="Add notes about this document..."
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || !uploadData.clientId || uploading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {uploading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && reviewDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Review Document</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-1 hover:bg-neutral-100 rounded-lg"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="p-4 bg-neutral-50 rounded-lg mb-4">
              <p className="font-medium text-neutral-900">{reviewDoc.label || reviewDoc.original_name}</p>
              <p className="text-sm text-neutral-500">
                Client: {reviewDoc.client_name} • {formatFileSize(reviewDoc.file_size)}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Decision</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setReviewAction('approved')}
                    className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                      reviewAction === 'approved'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-neutral-200 hover:border-green-200'
                    }`}
                  >
                    <i className="ri-checkbox-circle-line text-xl"></i>
                    <p className="font-medium mt-1">Approve</p>
                  </button>
                  <button
                    onClick={() => setReviewAction('rejected')}
                    className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                      reviewAction === 'rejected'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-neutral-200 hover:border-red-200'
                    }`}
                  >
                    <i className="ri-close-circle-line text-xl"></i>
                    <p className="font-medium mt-1">Reject</p>
                  </button>
                </div>
              </div>

              {reviewAction === 'rejected' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Rejection Reason *</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explain why the document was rejected..."
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    required
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReview}
                disabled={reviewing || (reviewAction === 'rejected' && !rejectionReason)}
                className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 ${
                  reviewAction === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {reviewing && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {reviewAction === 'approved' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewDoc && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <div>
                <h3 className="font-semibold text-neutral-900">{previewDoc.label || previewDoc.original_name}</h3>
                <p className="text-sm text-neutral-500">
                  {previewDoc.client_name} • {formatFileSize(previewDoc.file_size)}
                </p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-neutral-100 flex items-center justify-center">
              {previewDoc.mime_type.includes('image') ? (
                <img
                  src={`/api/admin/documents/file?id=${previewDoc.id}`}
                  alt={previewDoc.label || previewDoc.original_name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : previewDoc.mime_type.includes('pdf') ? (
                <div className="text-center text-neutral-500">
                  <i className="ri-file-pdf-line text-6xl text-red-400"></i>
                  <p className="mt-3">PDF Preview not available</p>
                  <p className="text-sm">Download to view the document</p>
                </div>
              ) : (
                <div className="text-center text-neutral-500">
                  <i className="ri-file-line text-6xl"></i>
                  <p className="mt-3">Preview not available for this file type</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
