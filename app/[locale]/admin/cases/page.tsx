"use client";

import { useEffect, useState } from "react";

type CaseItem = {
  id: string;
  name: string;
  status: string;
};

export default function AdminCasesPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);

  useEffect(() => {
    fetch("/api/cases.php")
      .then((res) => res.json())
      .then((data) => setCases(data.items ?? []))
      .catch(() => setCases([]));
  }, []);

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-semibold">Pipeline</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {cases.map((item) => (
          <div key={item.id} className="card p-4">
            <h3 className="text-sm font-semibold">{item.name}</h3>
            <p className="text-xs text-slate-500">{item.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
