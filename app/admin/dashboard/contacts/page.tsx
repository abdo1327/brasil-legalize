"use client";

import { useState, useEffect } from "react";

// Icons
function IconMail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconPhone({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function IconEye({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function IconArchive({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21 8 21 21 3 21 3 8"/>
      <rect x="1" y="3" width="22" height="5"/>
      <line x1="10" y1="12" x2="14" y2="12"/>
    </svg>
  );
}

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  locale: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  contacted: "bg-purple-100 text-purple-800",
  resolved: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<string, string> = {
  new: "New",
  in_progress: "In Progress",
  contacted: "Contacted",
  resolved: "Resolved",
  archived: "Archived",
};

const localeNames: Record<string, string> = {
  en: "English",
  ar: "Arabic",
  es: "Spanish",
  "pt-br": "Portuguese",
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [filter, showArchived]);

  async function fetchContacts() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== "all") params.append("status", filter);
      if (showArchived) params.append("includeArchived", "true");

      const res = await fetch(`/api/contacts?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch contacts");

      setContacts(data.contacts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function updateContactStatus(id: number, status: string) {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      fetchContacts();
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, status });
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  }

  async function archiveContact(id: number) {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to archive contact");

      fetchContacts();
      setSelectedContact(null);
    } catch (err) {
      console.error("Error archiving contact:", err);
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  function timeAgo(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(dateStr);
  }

  const stats = {
    total: contacts.length,
    new: contacts.filter((c) => c.status === "new").length,
    inProgress: contacts.filter((c) => c.status === "in_progress").length,
    resolved: contacts.filter((c) => c.status === "resolved").length,
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
        <p className="text-gray-600 mt-1">
          Manage and respond to contact form submissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <div className="text-sm text-blue-600">New</div>
          <div className="text-2xl font-bold text-blue-700">{stats.new}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
          <div className="text-sm text-yellow-600">In Progress</div>
          <div className="text-2xl font-bold text-yellow-700">
            {stats.inProgress}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <div className="text-sm text-green-600">Resolved</div>
          <div className="text-2xl font-bold text-green-700">{stats.resolved}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            >
              <option value="all">All</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="contacted">Contacted</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="rounded border-gray-300"
            />
            Show Archived
          </label>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contact List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : contacts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No contacts found
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedContact?.id === contact.id
                        ? "bg-indigo-50 border-l-4 border-indigo-500"
                        : ""
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900 truncate">
                            {contact.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              statusColors[contact.status] || statusColors.new
                            }`}
                          >
                            {statusLabels[contact.status] || contact.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {contact.email}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {contact.message}
                        </p>
                      </div>
                      <div className="ml-4 flex flex-col items-end gap-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <IconClock className="w-3 h-3" />
                          {timeAgo(contact.created_at)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {localeNames[contact.locale] || contact.locale}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedContact ? (
            <div className="bg-white rounded-lg border border-gray-200 sticky top-6">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Contact Details</h2>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <IconX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Name */}
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Name
                  </label>
                  <p className="font-medium text-gray-900">
                    {selectedContact.name}
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Email
                  </label>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                  >
                    <IconMail className="w-4 h-4" />
                    {selectedContact.email}
                  </a>
                </div>

                {/* Phone */}
                {selectedContact.phone && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">
                      Phone
                    </label>
                    <div className="flex items-center gap-3">
                      <a
                        href={`tel:${selectedContact.phone}`}
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                      >
                        <IconPhone className="w-4 h-4" />
                        {selectedContact.phone}
                      </a>
                      <a
                        href={`https://wa.me/${selectedContact.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200"
                        title="Open WhatsApp"
                      >
                        <IconWhatsApp className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Message
                  </label>
                  <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg mt-1">
                    {selectedContact.message}
                  </p>
                </div>

                {/* Locale */}
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Language
                  </label>
                  <p className="text-gray-900">
                    {localeNames[selectedContact.locale] || selectedContact.locale}
                  </p>
                </div>

                {/* Date */}
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Submitted
                  </label>
                  <p className="text-gray-900">
                    {formatDate(selectedContact.created_at)}
                  </p>
                </div>

                {/* Status Update */}
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Status
                  </label>
                  <select
                    value={selectedContact.status}
                    onChange={(e) =>
                      updateContactStatus(selectedContact.id, e.target.value)
                    }
                    className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="contacted">Contacted</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-200 flex flex-col gap-2">
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: Your Contact Request`}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <IconMail className="w-4 h-4" />
                    Reply via Email
                  </a>
                  {selectedContact.phone && (
                    <a
                      href={`https://wa.me/${selectedContact.phone.replace(/\D/g, "")}?text=Hello ${encodeURIComponent(selectedContact.name)}, thank you for contacting Brasil Legalize!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <IconWhatsApp className="w-4 h-4" />
                      Reply via WhatsApp
                    </a>
                  )}
                  <button
                    onClick={() => archiveContact(selectedContact.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <IconArchive className="w-4 h-4" />
                    Archive
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
              <IconEye className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Select a contact to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
