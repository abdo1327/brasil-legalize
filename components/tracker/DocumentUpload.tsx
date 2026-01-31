'use client';

import { useState, useRef } from 'react';

interface DocumentUploadProps {
  onUpload: (file: File, metadata?: { documentType?: string; label?: string }) => Promise<boolean>;
  acceptedTypes?: string[];
  maxSize?: number; // in bytes
  label?: string;
  description?: string;
  className?: string;
}

export function DocumentUpload({
  onUpload,
  acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'],
  maxSize = 25 * 1024 * 1024, // 25MB default
  label = 'Upload Document',
  description,
  className = '',
}: DocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File is too large. Maximum size is ${formatFileSize(maxSize)}`;
    }

    // Check file type by extension
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(ext)) {
      return `Invalid file type. Accepted: ${acceptedTypes.join(', ')}`;
    }

    // Check filename length
    if (file.name.length > 100) {
      return 'Filename is too long (max 100 characters)';
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    setError(null);
    setSuccess(false);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const result = await onUpload(selectedFile);

      clearInterval(progressInterval);
      setProgress(100);

      if (result) {
        setSuccess(true);
        setSelectedFile(null);
        setTimeout(() => {
          setSuccess(false);
          setProgress(0);
        }, 3000);
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
      />

      {/* Drop Zone */}
      {!selectedFile && !success && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-primary bg-primary/5 scale-[1.02]'
              : 'border-neutral-300 hover:border-primary hover:bg-neutral-50'
          }`}
        >
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-upload-cloud-2-line text-3xl text-neutral-400"></i>
          </div>
          <p className="font-medium text-neutral-700">{label}</p>
          {description && <p className="text-sm text-neutral-500 mt-1">{description}</p>}
          <p className="text-xs text-neutral-400 mt-3">
            {acceptedTypes.map((t) => t.replace('.', '').toUpperCase()).join(', ')} • Max {formatFileSize(maxSize)}
          </p>
        </div>
      )}

      {/* Selected File */}
      {selectedFile && !success && (
        <div className="border border-neutral-200 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              {selectedFile.type.includes('pdf') ? (
                <i className="ri-file-pdf-line text-2xl text-red-500"></i>
              ) : selectedFile.type.includes('image') ? (
                <i className="ri-image-line text-2xl text-blue-500"></i>
              ) : (
                <i className="ri-file-line text-2xl text-neutral-500"></i>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-neutral-900 truncate">{selectedFile.name}</p>
              <p className="text-sm text-neutral-500">{formatFileSize(selectedFile.size)}</p>
            </div>
            {!uploading && (
              <button
                onClick={handleCancel}
                className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="mt-4">
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-neutral-500 mt-1 text-center">{progress}%</p>
            </div>
          )}

          {/* Upload Button */}
          {!uploading && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <i className="ri-upload-2-line"></i>
                Upload
              </button>
            </div>
          )}
        </div>
      )}

      {/* Success State */}
      {success && (
        <div className="border border-green-200 bg-green-50 rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-check-line text-3xl text-green-600"></i>
          </div>
          <p className="font-medium text-green-700">Document uploaded successfully!</p>
          <p className="text-sm text-green-600 mt-1">Your document is now under review</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
          <i className="ri-error-warning-line"></i>
          {error}
        </div>
      )}
    </div>
  );
}
