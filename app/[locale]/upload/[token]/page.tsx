"use client";

import { useState } from "react";

export default function UploadPage({ params }: { params: { token: string } }) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!files || files.length === 0) return;
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files[]", file));
    formData.append("token", params.token);

    const response = await fetch("/api/upload.php", { method: "POST", body: formData });
    const data = await response.json();
    setStatus(data.message ?? "Uploaded");
  };

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-semibold">Upload Documents</h1>
      <div className="mt-6 card p-6">
        <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFiles(e.target.files)} />
        <button className="btn-primary mt-4" onClick={handleUpload}>Upload</button>
        {status && <p className="mt-3 text-sm text-slate-600">{status}</p>}
      </div>
    </div>
  );
}
