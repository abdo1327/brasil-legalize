'use client';

import { useState, useEffect } from 'react';

interface DocumentViewerProps {
  documentId: string | number;
  documentName: string;
  mimeType: string;
  documentUrl?: string;
  onClose: () => void;
}

export function DocumentViewer({
  documentId,
  documentName,
  mimeType,
  documentUrl,
  onClose,
}: DocumentViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);

  const isImage = mimeType.includes('image');
  const isPdf = mimeType.includes('pdf');

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleZoomReset = () => setZoom(100);

  // Get document URL - could be API endpoint or direct URL
  const viewUrl = documentUrl || `/api/admin/documents/file?id=${documentId}`;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      }
      if (e.key === '-') {
        handleZoomOut();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
          <div>
            <h3 className="font-medium text-white">{documentName}</h3>
            <p className="text-sm text-white/60">{mimeType}</p>
          </div>
        </div>

        {/* Zoom Controls (for images) */}
        {isImage && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Zoom out"
            >
              <i className="ri-zoom-out-line text-xl"></i>
            </button>
            <button
              onClick={handleZoomReset}
              className="px-3 py-1 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {zoom}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Zoom in"
            >
              <i className="ri-zoom-in-line text-xl"></i>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-8">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {error && (
          <div className="text-center text-white">
            <i className="ri-error-warning-line text-5xl text-red-400 mb-4 block"></i>
            <p>{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {isImage && !error && (
          <img
            src={viewUrl}
            alt={documentName}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{ transform: `scale(${zoom / 100})` }}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError('Failed to load image');
            }}
          />
        )}

        {isPdf && !error && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="bg-white rounded-xl p-8 text-center max-w-md">
              <i className="ri-file-pdf-line text-6xl text-red-500 mb-4 block"></i>
              <h4 className="text-lg font-semibold text-neutral-900 mb-2">{documentName}</h4>
              <p className="text-neutral-500 mb-4">PDF preview is not available in this viewer.</p>
              <div className="flex gap-3 justify-center">
                <a
                  href={viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <i className="ri-external-link-line"></i>
                  Open in New Tab
                </a>
              </div>
            </div>
          </div>
        )}

        {!isImage && !isPdf && !error && (
          <div className="bg-white rounded-xl p-8 text-center max-w-md">
            <i className="ri-file-line text-6xl text-neutral-400 mb-4 block"></i>
            <h4 className="text-lg font-semibold text-neutral-900 mb-2">{documentName}</h4>
            <p className="text-neutral-500 mb-4">Preview not available for this file type.</p>
            <a
              href={viewUrl}
              download
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <i className="ri-download-line"></i>
              Download
            </a>
          </div>
        )}
      </div>

      {/* Footer with keyboard shortcuts */}
      <div className="px-4 py-2 bg-black/50 text-center text-white/40 text-xs">
        Press <kbd className="px-1 bg-white/10 rounded">Esc</kbd> to close
        {isImage && (
          <>
            {' • '}
            <kbd className="px-1 bg-white/10 rounded">+</kbd>/<kbd className="px-1 bg-white/10 rounded">-</kbd> to zoom
          </>
        )}
      </div>
    </div>
  );
}
