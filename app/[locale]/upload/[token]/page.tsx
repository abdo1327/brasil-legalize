"use client";

import { useState, useEffect } from "react";

interface DocumentRequest {
  id: number;
  request_id: string;
  requested_documents: Array<{ type: string; label: string }>;
  message: string;
  due_date: string | null;
  status: string;
  client_name?: string;
}

export default function UploadPage({ params }: { params: { token: string; locale: string } }) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [docRequest, setDocRequest] = useState<DocumentRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate the token and get document request info
    const validateToken = async () => {
      try {
        const res = await fetch(`/api/upload/validate?token=${params.token}`);
        const data = await res.json();
        if (data.success && data.documentRequest) {
          setDocRequest(data.documentRequest);
        }
      } catch (err) {
        console.error('Failed to validate token:', err);
      } finally {
        setLoading(false);
      }
    };
    validateToken();
  }, [params.token]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files[]", file));
      formData.append("token", params.token);

      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await response.json();

      if (data.success) {
        setUploadedFiles(prev => [...prev, ...files.map(f => f.name)]);
        setFiles([]);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-upload-cloud-2-line text-3xl text-white"></i>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Upload Documents</h1>
          <p className="text-gray-600 mt-2">
            {docRequest?.message || 'Please upload the requested documents securely'}
          </p>
        </div>

        {/* Requested Documents Info */}
        {docRequest && docRequest.requested_documents?.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i className="ri-file-list-3-line text-primary"></i>
              Requested Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {docRequest.requested_documents.map((doc, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <i className="ri-file-text-line text-blue-600"></i>
                  <span className="text-sm text-blue-800">{doc.label}</span>
                </div>
              ))}
            </div>
            {docRequest.due_date && (
              <p className="mt-4 text-sm text-orange-700 bg-orange-50 rounded-lg p-3 flex items-center gap-2">
                <i className="ri-calendar-line"></i>
                Due by: {new Date(docRequest.due_date).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Upload Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Drag & Drop Area */}
          <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all block">
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-file-add-line text-2xl text-gray-400"></i>
            </div>
            <p className="text-gray-700 font-medium">Click to select files</p>
            <p className="text-gray-500 text-sm mt-1">or drag and drop them here</p>
            <p className="text-gray-400 text-xs mt-3">PDF, JPG, PNG, WEBP (max 10MB each)</p>
          </label>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-3">Selected Files ({files.length})</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className={`${file.type.includes('pdf') ? 'ri-file-pdf-line text-red-500' : 'ri-image-line text-blue-500'} text-lg`}></i>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <i className="ri-error-warning-line"></i>
              {error}
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className="mt-6 w-full py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <i className="ri-loader-4-line animate-spin"></i>
                Uploading...
              </>
            ) : (
              <>
                <i className="ri-upload-2-line"></i>
                Upload {files.length > 0 ? `${files.length} File${files.length > 1 ? 's' : ''}` : 'Files'}
              </>
            )}
          </button>
        </div>

        {/* Uploaded Files Success */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <i className="ri-checkbox-circle-fill text-green-600"></i>
              Successfully Uploaded
            </h3>
            <div className="space-y-2">
              {uploadedFiles.map((name, index) => (
                <div key={index} className="flex items-center gap-2 text-green-800 text-sm">
                  <i className="ri-check-line"></i>
                  {name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <p className="text-center text-gray-500 text-sm mt-8">
          Your documents are encrypted and securely stored.
          <br />
          Need help? Contact support@maocean360.com
        </p>
      </div>
    </div>
  );
}
