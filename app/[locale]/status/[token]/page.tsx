"use client";

import { useEffect, useState } from "react";

type StatusData = {
  milestones: string[];
  nextActions: string[];
};

export default function StatusPage({ params }: { params: { token: string } }) {
  const [data, setData] = useState<StatusData | null>(null);

  useEffect(() => {
    fetch(`/api/status.php?token=${params.token}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData({ milestones: ["Docs review"], nextActions: ["Awaiting documents"] }));
  }, [params.token]);

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-semibold">Case Status</h1>
      <div className="mt-6 card p-6">
        <h2 className="text-sm font-semibold">Milestones</h2>
        <ul className="mt-3 list-disc pl-6 text-sm text-slate-600">
          {(data?.milestones ?? []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h2 className="mt-6 text-sm font-semibold">Next actions required</h2>
        <ul className="mt-3 list-disc pl-6 text-sm text-slate-600">
          {(data?.nextActions ?? []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
