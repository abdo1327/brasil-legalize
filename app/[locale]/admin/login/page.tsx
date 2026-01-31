"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    const response = await fetch("/api/auth.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    setMessage(data.message ?? "Logged in");
  };

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-semibold">Admin Login</h1>
      <div className="mt-6 card p-6 space-y-3">
        <input className="w-full rounded-lg border border-slate-200 px-4 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded-lg border border-slate-200 px-4 py-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn-primary" onClick={handleLogin}>Login</button>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </div>
    </div>
  );
}
