'use client';

import { useState } from 'react';

interface Document {
  id: string | number;
  name: string;
  type: string;
  size: number;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  uploadedAt: string;
  mimeType?: string;
}

interface DocumentListProps {
  documents: Document[];
  onView?: (doc: Document) => void;
  onReupload?: (doc: Document) => void;
  onDownload?: (doc: Document) => void;
  showActions?: boolean;
  emptyMessage?: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: string; bgColor: string }> = {
  pending: { label: 'Under Review', color: 'text-yellow-700', icon: 'ri-time-line', bgColor: 'bg-yellow-100' },
  approved: { label: 'Approved', color: 'text-green-700', icon: 'ri-checkbox-circle-line', bgColor: 'bg-green-100' },
  rejected: { label: 'Rejected', color: 'text-red-700', icon: 'ri-close-circle-line', bgColor: 'bg-red-100' },
};

export function DocumentList({
  documents,
  onView,
  onReupload,
  onDownload,
  showActions = true,
  emptyMessage = 'No documents uploaded yet',
  className = '',
}: DocumentListProps) {
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
    });
  };

  const getFileIcon = (mimeType?: string, name?: string) => {
    const type = mimeType || '';
    if (type.includes('pdf') || name?.endsWith('.pdf')) return 'ri-file-pdf-line text-red-500';
    if (type.includes('image') || /\.(jpg|jpeg|png|webp)$/i.test(name || '')) return 'ri-image-line text-blue-500';
    return 'ri-file-line text-neutral-500';
  };

  if (documents.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-folder-open-line text-4xl text-neutral-300"></i>
        </div>
        <p className="text-neutral-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {documents.map((doc) => {
        const status = statusConfig[doc.status];
        const isRejected = doc.status === 'rejected';

        return (
          <div
            key={doc.id}
            className={`border rounded-xl p-4 transition-colors ${
              isRejected ? 'border-red-200 bg-red-50/50' : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* File Icon */}
              <div className={`w-12 h-12 ${status.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <i className={`${getFileIcon(doc.mimeType, doc.name)} text-2xl`}></i>
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-neutral-900 truncate">{doc.name}</h4>
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${status.bgColor} ${status.color}`}>
                    <i className={status.icon}></i>
                    {status.label}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-neutral-500">
                  <span className="flex items-center gap-1">
                    <i className="ri-time-line"></i>
                    {formatDate(doc.uploadedAt)}
                  </span>
                  <span>{formatFileSize(doc.size)}</span>
                  <span className="capitalize">{doc.type.replace(/_/g, ' ')}</span>
                </div>

                {/* Rejection Reason */}
                {isRejected && doc.rejectionReason && (
                  <div className="mt-2 p-2 bg-red-100 rounded-lg">
                    <p className="text-sm text-red-700">
                      <i className="ri-information-line mr-1"></i>
                      <strong>Reason:</strong> {doc.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {showActions && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  {onView && (
                    <button
                      onClick={() => onView(doc)}
                      className="p-2 text-neutral-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="View"
                    >
                      <i className="ri-eye-line text-lg"></i>
                    </button>
                  )}
                  {onDownload && (
                    <button
                      onClick={() => onDownload(doc)}
                      className="p-2 text-neutral-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Download"
                    >
                      <i className="ri-download-line text-lg"></i>
                    </button>
                  )}
                  {isRejected && onReupload && (
                    <button
                      onClick={() => onReupload(doc)}
                      className="px-3 py-1.5 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-1"
                    >
                      <i className="ri-upload-2-line"></i>
                      Reupload
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
