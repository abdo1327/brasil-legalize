"use client";

import { useState } from "react";

export default function TemplatesPage() {
  const [template, setTemplate] = useState("");

  const saveTemplate = async () => {
    await fetch("/api/admin/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ template })
    });
  };

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-semibold">Templates</h1>
      <div className="mt-6 card p-6 space-y-3">
        <textarea
          className="w-full rounded-lg border border-slate-200 p-3"
          rows={6}
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
        />
        <button className="btn-primary" onClick={saveTemplate}>Save</button>
      </div>
    </div>
  );
}
