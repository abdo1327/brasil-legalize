'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/lib/admin/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ClientForm {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  country: string;
  locale: string;
  service_type: string;
  package: string;
  family_adults: number;
  family_children: number;
  expected_travel_date: string;
  expected_due_date: string;
  source: string;
  referral_source: string;
  is_historical: boolean;
  tags: string[];
  total_due: number;
  total_paid: number;
  currency: string;
  initial_note: string;
  // New fields for status/phase
  client_status: 'lead' | 'potential' | 'active_client';
  application_status: string;
  create_application: boolean;
}

const countries = [
  { code: 'AR', name: 'Argentina' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'EG', name: 'Egypt' },
  { code: 'IN', name: 'India' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'MX', name: 'Mexico' },
  { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'QA', name: 'Qatar' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'UAE' },
  { code: 'US', name: 'United States' },
  { code: 'OTHER', name: 'Other' },
];

const serviceTypes = [
  { value: 'visa', label: 'Visa Services' },
  { value: 'residency', label: 'Residency' },
  { value: 'birth_tourism', label: 'Birth Tourism' },
  { value: 'document', label: 'Document Services' },
  { value: 'consultation', label: 'Consultation Only' },
];

const packages = [
  { value: '', label: 'No Package Selected' },
  { value: 'basic', label: 'Basic Package' },
  { value: 'complete', label: 'Complete Package' },
  { value: 'custom', label: 'Custom Package' },
];

const sources = [
  { value: 'manual', label: 'Manual Entry' },
  { value: 'phone', label: 'Phone Call' },
  { value: 'walkin', label: 'Walk-in' },
  { value: 'referral', label: 'Referral' },
  { value: 'website', label: 'Website Contact' },
  { value: 'social', label: 'Social Media' },
  { value: 'event', label: 'Event/Conference' },
];

const locales = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
  { value: 'es', label: 'Spanish' },
  { value: 'pt-br', label: 'Portuguese (Brazil)' },
];

// Client status options with corresponding application phases
const clientStatuses = [
  { 
    value: 'lead', 
    label: 'Lead', 
    phase: 1,
    description: 'New lead - No portal access',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    statuses: [
      { value: 'new', label: 'New' },
      { value: 'contacted', label: 'Contacted' },
      { value: 'meeting_scheduled', label: 'Meeting Scheduled' },
      { value: 'meeting_completed', label: 'Meeting Completed' },
    ]
  },
  { 
    value: 'potential', 
    label: 'Potential Client', 
    phase: 2,
    description: 'Negotiating - No portal access yet',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    statuses: [
      { value: 'proposal_sent', label: 'Proposal Sent' },
      { value: 'negotiating', label: 'Negotiating' },
      { value: 'awaiting_payment', label: 'Awaiting Payment' },
      { value: 'payment_received', label: 'Payment Received' },
    ]
  },
  { 
    value: 'active_client', 
    label: 'Active Client', 
    phase: 3,
    description: 'Paid - Has portal access',
    color: 'bg-green-100 text-green-700 border-green-200',
    statuses: [
      { value: 'onboarding', label: 'Onboarding' },
      { value: 'documents_pending', label: 'Documents Pending' },
      { value: 'documents_review', label: 'Documents Review' },
      { value: 'application_submitted', label: 'Application Submitted' },
    ]
  },
];

export default function NewClientPage() {
  const { admin } = useAdminAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');

  const [form, setForm] = useState<ClientForm>({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    city: '',
    country: '',
    locale: 'en',
    service_type: '',
    package: '',
    family_adults: 2,
    family_children: 0,
    expected_travel_date: '',
    expected_due_date: '',
    source: 'manual',
    referral_source: '',
    is_historical: false,
    tags: [],
    total_due: 0,
    total_paid: 0,
    currency: 'USD',
    initial_note: '',
    // New status fields
    client_status: 'lead',
    application_status: 'new',
    create_application: true,
  });

  // Get the available statuses based on selected client status
  const selectedClientStatus = clientStatuses.find(s => s.value === form.client_status);
  const availableStatuses = selectedClientStatus?.statuses || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else if (type === 'number') {
      setForm({ ...form, [name]: parseFloat(value) || 0 });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleClientStatusChange = (status: 'lead' | 'potential' | 'active_client') => {
    const newStatus = clientStatuses.find(s => s.value === status);
    setForm({ 
      ...form, 
      client_status: status,
      application_status: newStatus?.statuses[0]?.value || 'new'
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get phase from client status
      const phase = selectedClientStatus?.phase || 1;

      const response = await fetch('/api/client/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          whatsapp: form.whatsapp || form.phone,
          created_by: admin?.name || 'Admin',
          // Include application creation data
          create_application: form.create_application,
          application_phase: phase,
          application_status: form.application_status,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/admin/clients/${data.client.client_id || data.client.id}`);
      } else {
        setError(data.error || 'Failed to create client');
      }
    } catch (err) {
      setError('Failed to create client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/dashboard/clients"
          className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <i className="ri-arrow-left-line text-xl" aria-hidden="true"></i>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Add New Client</h1>
          <p className="text-neutral-500">Manually add a new client or lead to the system</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="+1 234 567 8900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">WhatsApp</label>
              <input
                type="tel"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Same as phone if empty"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="São Paulo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Country</label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Preferred Language</label>
              <select
                name="locale"
                value={form.locale}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {locales.map((locale) => (
                  <option key={locale.value} value={locale.value}>
                    {locale.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Client Status & Application Phase */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Client Status & Application</h2>
          
          {/* Status Selection Cards */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Select Client Status <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {clientStatuses.map((status) => (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => handleClientStatusChange(status.value as 'lead' | 'potential' | 'active_client')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    form.client_status === status.value
                      ? `${status.color} border-current ring-2 ring-current/20`
                      : 'bg-white border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      form.client_status === status.value ? 'bg-white/50' : 'bg-neutral-100'
                    }`}>
                      <i className={`${
                        status.value === 'lead' ? 'ri-user-add-line' :
                        status.value === 'potential' ? 'ri-user-star-line' :
                        'ri-user-follow-line'
                      } text-lg`} aria-hidden="true"></i>
                    </div>
                    <div>
                      <p className="font-semibold">{status.label}</p>
                      <p className="text-xs opacity-75">Phase {status.phase}</p>
                    </div>
                  </div>
                  <p className="text-sm opacity-75">{status.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Application Status within Phase */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Application Status
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableStatuses.map((status) => (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => setForm({ ...form, application_status: status.value })}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                    form.application_status === status.value
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-primary hover:text-primary'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Create Application Toggle */}
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <input
              type="checkbox"
              id="create_application"
              name="create_application"
              checked={form.create_application}
              onChange={handleChange}
              className="w-5 h-5 rounded border-blue-300 text-primary focus:ring-primary"
            />
            <label htmlFor="create_application" className="flex-1">
              <span className="font-medium text-blue-900">Create Application Automatically</span>
              <p className="text-sm text-blue-700">
                Creates an application record in Phase {selectedClientStatus?.phase || 1} with status "{availableStatuses.find(s => s.value === form.application_status)?.label || 'New'}"
              </p>
            </label>
          </div>
        </div>

        {/* Service Information */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Service Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Service Type</label>
              <select
                name="service_type"
                value={form.service_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Select Service</option>
                {serviceTypes.map((service) => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Package</label>
              <select
                name="package"
                value={form.package}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {packages.map((pkg) => (
                  <option key={pkg.value} value={pkg.value}>
                    {pkg.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Adults in Family</label>
              <input
                type="number"
                name="family_adults"
                value={form.family_adults}
                onChange={handleChange}
                min="1"
                max="10"
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Children in Family</label>
              <input
                type="number"
                name="family_children"
                value={form.family_children}
                onChange={handleChange}
                min="0"
                max="10"
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Expected Travel Date</label>
              <input
                type="date"
                name="expected_travel_date"
                value={form.expected_travel_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Expected Due Date (Birth Tourism)</label>
              <input
                type="date"
                name="expected_due_date"
                value={form.expected_due_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Source & Tracking */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Source & Tracking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Lead Source</label>
              <select
                name="source"
                value={form.source}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {sources.map((source) => (
                  <option key={source.value} value={source.value}>
                    {source.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Referral Source (if referred)</label>
              <input
                type="text"
                name="referral_source"
                value={form.referral_source}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Name of person who referred"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Tags</label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                      <i className="ri-close-line" aria-hidden="true"></i>
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Add tag (e.g., VIP, priority)"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_historical"
                  checked={form.is_historical}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-neutral-700">
                  Mark as Historical Client (past client being added to the system)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Financial Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Currency</label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="USD">USD ($)</option>
                <option value="BRL">BRL (R$)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Total Amount Due</label>
              <input
                type="number"
                name="total_due"
                value={form.total_due}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Total Already Paid</label>
              <input
                type="number"
                name="total_paid"
                value={form.total_paid}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Initial Note */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Initial Note</h2>
          <textarea
            name="initial_note"
            value={form.initial_note}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Add any initial notes about this client..."
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/dashboard/clients"
            className="px-6 py-2 text-neutral-600 hover:text-neutral-900"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Creating...
              </>
            ) : (
              <>
                <i className="ri-user-add-line" aria-hidden="true"></i>
                Create Client
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
