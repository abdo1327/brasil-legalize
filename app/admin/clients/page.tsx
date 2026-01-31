'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/lib/admin/auth';
import { useAdminLocale } from '@/components/admin/Header';
import Link from 'next/link';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  country: string | null;
  service_type: string | null;
  package: string | null;
  source: string;
  is_historical: boolean;
  tags: string[];
  cases_count: number;
  created_at: string;
  financial: {
    total_paid: number;
    total_due: number;
    currency: string;
  };
}

const sourceLabels: Record<string, string> = {
  eligibility: 'Eligibility Form',
  manual: 'Manual Entry',
  referral: 'Referral',
  phone: 'Phone Call',
  walkin: 'Walk-in',
  website: 'Website Contact',
};

const serviceTypeLabels: Record<string, string> = {
  visa: 'Visa Services',
  residency: 'Residency',
  birth_tourism: 'Birth Tourism',
  document: 'Document Services',
  consultation: 'Consultation Only',
  citizenship: 'Citizenship',
};

export default function ClientsListPage() {
  const { admin } = useAdminAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [historicalFilter, setHistoricalFilter] = useState<'all' | 'current' | 'historical'>('all');
  const [viewMode, setViewMode] = useState<'clients' | 'cases'>('clients');

  useEffect(() => {
    if (viewMode === 'clients') {
      fetchClients();
    } else {
      // For cases view, fetch both cases AND clients (for matching by email)
      fetchCases();
      fetchClients();
    }
  }, [searchQuery, sourceFilter, historicalFilter, viewMode]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (sourceFilter !== 'all') params.append('source', sourceFilter);
      if (historicalFilter !== 'all') {
        params.append('historical', historicalFilter === 'historical' ? 'true' : 'false');
      }

      const response = await fetch(`/api/admin/clients?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        // Normalize the data structure - keep both db id and client_id
        setClients(data.clients.map((c: any) => ({
          ...c,
          db_id: c.id, // Database ID (integer)
          id: c.client_id || c.id, // Display ID (CLT-xxxx)
          tags: Array.isArray(c.tags) ? c.tags : [],
          cases_count: c.cases_count || 0,
          financial: {
            total_paid: parseFloat(c.total_paid) || 0,
            total_due: parseFloat(c.total_due) || 0,
            currency: c.currency || 'USD',
          },
        })));
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCases = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/admin/applications?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setCases(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const { t } = useAdminLocale();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {viewMode === 'clients' ? t.clients.title : t.applications.title}
          </h1>
          <p className="text-neutral-500">
            {viewMode === 'clients' 
              ? t.clients.subtitle
              : t.applications.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/clients/import"
            className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <i className="ri-upload-line" aria-hidden="true"></i>
            {t.common.import}
          </Link>
          <Link
            href="/admin/clients/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <i className="ri-user-add-line" aria-hidden="true"></i>
            {t.clients.addNew}
          </Link>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setViewMode('clients')}
          className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
            viewMode === 'clients'
              ? 'bg-white text-primary shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <i className="ri-user-line" aria-hidden="true"></i>
          {t.clients.byClient}
        </button>
        <button
          onClick={() => setViewMode('cases')}
          className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
            viewMode === 'cases'
              ? 'bg-white text-primary shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <i className="ri-briefcase-line" aria-hidden="true"></i>
          {t.clients.byCase}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden="true"></i>
              <input
                type="text"
                placeholder={t.clients.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Source Filter - only show for clients view */}
          {viewMode === 'clients' && (
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">{t.clients.allSources}</option>
              <option value="eligibility">Eligibility Form</option>
              <option value="manual">Manual Entry</option>
              <option value="referral">Referral</option>
              <option value="phone">Phone Call</option>
            </select>
          )}

          {/* Historical Filter */}
          <select
            value={historicalFilter}
            onChange={(e) => setHistoricalFilter(e.target.value as 'all' | 'current' | 'historical')}
            className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">{t.clients.allClients}</option>
            <option value="current">{t.clients.currentClients}</option>
            <option value="historical">{t.clients.historicalClients}</option>
          </select>
        </div>
      </div>

      {/* Clients Table */}
      {viewMode === 'clients' && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-neutral-500 mt-2">{t.common.loading}</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-user-line text-3xl text-neutral-400" aria-hidden="true"></i>
              </div>
              <h3 className="font-semibold text-neutral-900">{t.clients.noClients}</h3>
              <p className="text-neutral-500 mt-1">
                {searchQuery ? 'Try adjusting your search or filters' : 'Add your first client to get started'}
              </p>
              <Link
                href="/admin/clients/new"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <i className="ri-user-add-line" aria-hidden="true"></i>
                Add Client
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Client</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Contact</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Service</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Cases</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Source</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Financial</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-neutral-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/clients/${client.id}`}
                            className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold hover:bg-primary/20 transition-colors"
                            title="View profile"
                          >
                            {getInitials(client.name)}
                          </Link>
                          <div>
                            <div className="flex items-center gap-2">
                              <Link href={`/admin/clients/${client.id}`} className="font-medium text-neutral-900 hover:text-primary">
                                {client.name}
                              </Link>
                              {client.is_historical && (
                                <span className="px-2 py-0.5 text-xs bg-neutral-100 text-neutral-600 rounded">
                                  Historical
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-neutral-500">{client.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div className="text-neutral-900">{client.email}</div>
                          {client.phone && (
                            <div className="text-neutral-500 flex items-center gap-1">
                              <i className="ri-whatsapp-line text-green-600" aria-hidden="true"></i>
                              {client.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div className="text-neutral-900">
                            {serviceTypeLabels[client.service_type || ''] || client.service_type || '-'}
                          </div>
                          {client.package && (
                            <div className="text-neutral-500 capitalize">{client.package} Package</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/clients/${client.id}?tab=cases`}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary rounded text-sm hover:bg-secondary/20 transition-colors"
                          title="View cases"
                        >
                          <i className="ri-briefcase-line" aria-hidden="true"></i>
                          {client.cases_count}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-600">
                          {sourceLabels[client.source] || client.source}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div className="text-green-600 font-medium">
                            ${client.financial?.total_paid?.toLocaleString() || 0} paid
                          </div>
                          {(client.financial?.total_due || 0) > (client.financial?.total_paid || 0) && (
                            <div className="text-red-600">
                              ${((client.financial?.total_due || 0) - (client.financial?.total_paid || 0)).toLocaleString()} due
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/clients/${client.id}`}
                            className="p-2 text-neutral-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="View Profile"
                          >
                            <i className="ri-user-line text-lg" aria-hidden="true"></i>
                          </Link>
                          <a
                            href={`mailto:${client.email}`}
                            className="p-2 text-neutral-500 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                            title="Send Email"
                          >
                            <i className="ri-mail-line text-lg" aria-hidden="true"></i>
                          </a>
                          {client.phone && (
                            <a
                              href={`https://wa.me/${client.phone?.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-neutral-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="WhatsApp"
                            >
                              <i className="ri-whatsapp-line text-lg" aria-hidden="true"></i>
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Cases Table */}
      {viewMode === 'cases' && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-neutral-500 mt-2">Loading cases...</p>
            </div>
          ) : cases.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-briefcase-line text-3xl text-neutral-400" aria-hidden="true"></i>
              </div>
              <h3 className="font-semibold text-neutral-900">No cases found</h3>
              <p className="text-neutral-500 mt-1">
                {searchQuery ? 'Try adjusting your search' : 'No cases exist yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Case ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Client</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Service</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Phase</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Created</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {/* Group cases by email */}
                  {(() => {
                    // Sort cases by email first to group them visually
                    const sortedCases = [...cases].sort((a, b) => {
                      const emailA = a.email?.toLowerCase() || '';
                      const emailB = b.email?.toLowerCase() || '';
                      if (emailA !== emailB) return emailA.localeCompare(emailB);
                      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    });
                    
                    return sortedCases.map((caseItem, index) => {
                      // Check if this is first case for this email (show client info) or same email as previous row
                      const prevCase = index > 0 ? sortedCases[index - 1] : null;
                      const sameEmail = prevCase && prevCase.email?.toLowerCase() === caseItem.email?.toLowerCase();
                      const showClientInfo = !sameEmail;
                      
                      // Find client by email match
                      const matchingClient = clients.find(c => c.email?.toLowerCase() === caseItem.email?.toLowerCase());
                      
                      return (
                        <tr key={caseItem.id} className={`hover:bg-neutral-50 transition-colors ${showClientInfo && index > 0 ? 'border-t-2 border-neutral-200' : ''}`}>
                          <td className="px-4 py-2.5">
                            <Link
                              href={`/admin/dashboard/applications/${caseItem.id}`}
                              className="font-mono text-sm text-primary hover:underline"
                            >
                              {caseItem.id}
                            </Link>
                            {caseItem.archived && (
                              <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-neutral-100 text-neutral-500 rounded">
                                Archived
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2.5">
                            {showClientInfo ? (
                              <div className="flex items-center gap-2">
                                {matchingClient ? (
                                  <Link
                                    href={`/admin/clients/${matchingClient.id}`}
                                    className="w-7 h-7 bg-primary/10 text-primary rounded-full flex items-center justify-center font-medium text-xs hover:bg-primary/20 transition-colors"
                                    title={`View ${matchingClient.name}'s profile`}
                                  >
                                    {getInitials(caseItem.name)}
                                  </Link>
                                ) : (
                                  <div 
                                    className="w-7 h-7 bg-neutral-100 text-neutral-500 rounded-full flex items-center justify-center font-medium text-xs cursor-help"
                                    title="No client found with this email"
                                  >
                                    {getInitials(caseItem.name)}
                                  </div>
                                )}
                                <div>
                                  <div className="text-sm text-neutral-900">{caseItem.name}</div>
                                  <div className="text-xs text-neutral-400">{caseItem.email}</div>
                                  {matchingClient && (
                                    <Link 
                                      href={`/admin/clients/${matchingClient.id}`}
                                      className="text-[10px] text-green-600 hover:underline"
                                    >
                                      {matchingClient.id}
                                    </Link>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-neutral-300 pl-9">↳ same email</span>
                            )}
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-sm text-neutral-700">
                              {serviceTypeLabels[caseItem.service_type || ''] || caseItem.service_type || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${
                              caseItem.phase === 1 ? 'bg-blue-50 text-blue-600' :
                              caseItem.phase === 2 ? 'bg-amber-50 text-amber-600' :
                              caseItem.phase === 3 ? 'bg-purple-50 text-purple-600' :
                              'bg-green-50 text-green-600'
                            }`}>
                              P{caseItem.phase}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-sm text-neutral-600 capitalize">
                              {caseItem.status?.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-xs text-neutral-500">
                              {new Date(caseItem.created_at).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                href={`/admin/dashboard/applications/${caseItem.id}`}
                                className="p-1.5 text-neutral-400 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                                title="View Case"
                              >
                                <i className="ri-eye-line" aria-hidden="true"></i>
                              </Link>
                              {matchingClient && (
                                <Link
                                  href={`/admin/clients/${matchingClient.id}`}
                                  className="p-1.5 text-neutral-400 hover:text-secondary hover:bg-secondary/10 rounded transition-colors"
                                  title="View Client Profile"
                                >
                                  <i className="ri-user-line" aria-hidden="true"></i>
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Stats Summary */}
      {viewMode === 'clients' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                <i className="ri-user-line text-xl" aria-hidden="true"></i>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total Clients</p>
                <p className="text-xl font-bold text-neutral-900">{clients.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center">
                <i className="ri-briefcase-line text-xl" aria-hidden="true"></i>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total Cases</p>
                <p className="text-xl font-bold text-neutral-900">
                  {clients.reduce((sum, c) => sum + (c.cases_count || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-xl" aria-hidden="true"></i>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total Revenue</p>
                <p className="text-xl font-bold text-neutral-900">
                  ${clients.reduce((sum, c) => sum + (c.financial?.total_paid || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-xl" aria-hidden="true"></i>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Historical</p>
                <p className="text-xl font-bold text-neutral-900">
                  {clients.filter((c) => c.is_historical).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                <i className="ri-briefcase-line text-xl" aria-hidden="true"></i>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total Cases</p>
                <p className="text-xl font-bold text-neutral-900">{cases.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <i className="ri-play-circle-line text-xl" aria-hidden="true"></i>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Phase 1 (Lead)</p>
                <p className="text-xl font-bold text-neutral-900">
                  {cases.filter((c) => c.phase === 1).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <i className="ri-loader-4-line text-xl" aria-hidden="true"></i>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Phase 3 (Active)</p>
                <p className="text-xl font-bold text-neutral-900">
                  {cases.filter((c) => c.phase === 3).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <i className="ri-check-double-line text-xl" aria-hidden="true"></i>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Phase 4 (Completed)</p>
                <p className="text-xl font-bold text-neutral-900">
                  {cases.filter((c) => c.phase === 4).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
