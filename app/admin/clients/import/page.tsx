'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/lib/admin/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HistoricalClient {
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  service_type: string;
  package: string;
  total_paid: number;
  total_due: number;
  completed_date: string;
  notes: string;
}

export default function ImportHistoricalPage() {
  const { admin } = useAdminAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [importMethod, setImportMethod] = useState<'single' | 'bulk'>('single');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bulkData, setBulkData] = useState('');

  const [form, setForm] = useState<HistoricalClient>({
    name: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    service_type: '',
    package: '',
    total_paid: 0,
    total_due: 0,
    completed_date: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setForm({ ...form, [name]: parseFloat(value) || 0 });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/clients.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          is_historical: true,
          source: 'historical_import',
          created_by: admin?.name || 'Admin',
          initial_note: `Historical client imported. Original service completed on ${form.completed_date}. ${form.notes}`,
          // Create as completed application (Phase 4, status: completed)
          create_application: true,
          application_phase: 4,
          application_status: 'completed',
          completed_date: form.completed_date,
          skip_workflow: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Successfully imported: ${form.name}`);
        setForm({
          name: '',
          email: '',
          phone: '',
          city: '',
          country: '',
          service_type: '',
          package: '',
          total_paid: 0,
          total_due: 0,
          completed_date: '',
          notes: '',
        });
      } else {
        setError(data.error || 'Failed to import client');
      }
    } catch (err) {
      setError('Failed to import client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Parse CSV/JSON data
      const lines = bulkData.trim().split('\n');
      const results = { success: 0, failed: 0, errors: [] as string[] };

      for (const line of lines) {
        try {
          // Try JSON first
          let client: HistoricalClient;
          if (line.trim().startsWith('{')) {
            client = JSON.parse(line);
          } else {
            // CSV format: name,email,phone,city,country,service_type,package,total_paid,total_due,completed_date
            const parts = line.split(',').map((p) => p.trim());
            if (parts.length < 10) {
              results.errors.push(`Invalid line: ${line.substring(0, 50)}...`);
              results.failed++;
              continue;
            }
            client = {
              name: parts[0],
              email: parts[1],
              phone: parts[2],
              city: parts[3],
              country: parts[4],
              service_type: parts[5],
              package: parts[6],
              total_paid: parseFloat(parts[7]) || 0,
              total_due: parseFloat(parts[8]) || 0,
              completed_date: parts[9],
              notes: parts[10] || '',
            };
          }

          const response = await fetch('/api/clients.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...client,
              is_historical: true,
              source: 'historical_import',
              created_by: admin?.name || 'Admin',
              initial_note: `Historical client imported. Original service completed on ${client.completed_date}. ${client.notes}`,
              // Create as completed application (Phase 4, status: completed)
              create_application: true,
              application_phase: 4,
              application_status: 'completed',
              completed_date: client.completed_date,
              skip_workflow: true,
            }),
          });

          const data = await response.json();
          if (data.success) {
            results.success++;
          } else {
            results.failed++;
            results.errors.push(`${client.name}: ${data.error}`);
          }
        } catch (lineError) {
          results.failed++;
          results.errors.push(`Parse error: ${line.substring(0, 50)}...`);
        }
      }

      if (results.success > 0) {
        setSuccess(`Successfully imported ${results.success} clients. ${results.failed} failed.`);
      }
      if (results.errors.length > 0) {
        setError(results.errors.join('\n'));
      }
    } catch (err) {
      setError('Failed to process bulk import. Please check the data format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/clients"
          className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <i className="ri-arrow-left-line text-xl" aria-hidden="true"></i>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Import Historical Clients</h1>
          <p className="text-neutral-500">Add past clients to maintain a complete client database</p>
        </div>
      </div>

      {/* Import Method Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 pb-2">
        <button
          onClick={() => setImportMethod('single')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            importMethod === 'single'
              ? 'bg-primary text-white'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Single Client
        </button>
        <button
          onClick={() => setImportMethod('bulk')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            importMethod === 'bulk'
              ? 'bg-primary text-white'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Bulk Import
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 whitespace-pre-wrap">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
          {success}
        </div>
      )}

      {importMethod === 'single' ? (
        <form onSubmit={handleSingleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Client Information</h2>
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
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
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
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Service Type</label>
                <select
                  name="service_type"
                  value={form.service_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                >
                  <option value="">Select Service</option>
                  <option value="visa">Visa Services</option>
                  <option value="residency">Residency</option>
                  <option value="birth_tourism">Birth Tourism</option>
                  <option value="document">Document Services</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Package</label>
                <select
                  name="package"
                  value={form.package}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                >
                  <option value="">No Package</option>
                  <option value="basic">Basic</option>
                  <option value="complete">Complete</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Completion Date</label>
                <input
                  type="date"
                  name="completed_date"
                  value={form.completed_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                />
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
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Total Paid</label>
                <input
                  type="number"
                  name="total_paid"
                  value={form.total_paid}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                placeholder="Any additional information about this historical client..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/admin/clients" className="px-6 py-2 text-neutral-600 hover:text-neutral-900">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Importing...' : 'Import Client'}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleBulkSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Bulk Import</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-blue-900 mb-2">CSV Format (one client per line):</h3>
              <code className="text-sm text-blue-700 block">
                name,email,phone,city,country,service_type,package,total_paid,total_due,completed_date,notes
              </code>
              <p className="text-sm text-blue-700 mt-2">
                Example: John Doe,john@example.com,+1234567890,São Paulo,BR,visa,complete,5000,5000,2025-06-15,VIP client
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-amber-900 mb-2">Or JSON Format (one per line):</h3>
              <code className="text-sm text-amber-700 block">
                {`{"name":"John Doe","email":"john@example.com","phone":"+1234567890",...}`}
              </code>
            </div>

            <textarea
              value={bulkData}
              onChange={(e) => setBulkData(e.target.value)}
              rows={10}
              className="w-full px-4 py-2 border border-neutral-200 rounded-lg font-mono text-sm"
              placeholder="Paste your client data here..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/admin/clients" className="px-6 py-2 text-neutral-600 hover:text-neutral-900">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !bulkData.trim()}
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Importing...' : 'Import All'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
