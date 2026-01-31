'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/lib/admin/auth';

interface Package {
  id: number;
  package_key: string;
  name_en: string;
  name_ar: string;
  name_es: string;
  name_pt: string;
  description_en: string;
  base_price: number;
  original_price: number | null;
  discount_percent: number;
  discount_ends_at: string | null;
  currency: string;
  adults_included: number;
  children_included: number;
  price_per_extra_adult: number;
  price_per_extra_child: number;
  is_active: boolean;
  is_popular: boolean;
  display_order: number;
}

interface Service {
  id: number;
  service_key: string;
  name_en: string;
  name_ar: string;
  name_es: string;
  name_pt: string;
  description_en: string;
  price: number;
  currency: string;
  icon: string;
  color: string;
  category: string;
  included_in_basic: boolean;
  included_in_complete: boolean;
  is_active: boolean;
  display_order: number;
}

export default function PricingPage() {
  const { hasPermission } = useAdminAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'packages' | 'services'>('packages');
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  const canEdit = hasPermission('pricing.edit');

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const res = await fetch('/api/admin/pricing.php', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch pricing');
      const data = await res.json();
      if (data.success) {
        setPackages(data.packages || []);
        setServices(data.services || []);
      } else {
        setError(data.error || 'Failed to load pricing');
      }
    } catch (err) {
      setError('Failed to load pricing data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePackage = async (pkg: Package) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/pricing.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type: 'package', item: pkg }),
      });
      const result = await res.json();
      if (result.success) {
        setSaveSuccess('Package updated successfully!');
        setEditingPackage(null);
        fetchPricing();
        setTimeout(() => setSaveSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to save');
      }
    } catch (err) {
      setError('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveService = async (svc: Service) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/pricing.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type: 'service', item: svc }),
      });
      const result = await res.json();
      if (result.success) {
        setSaveSuccess('Service updated successfully!');
        setEditingService(null);
        fetchPricing();
        setTimeout(() => setSaveSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to save');
      }
    } catch (err) {
      setError('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-primary animate-spin" aria-hidden="true"></i>
          <p className="mt-2 text-neutral-500">Loading pricing data...</p>
        </div>
      </div>
    );
  }

  const categoryGroups = services.reduce((acc, svc) => {
    const cat = svc.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(svc);
    return acc;
  }, {} as Record<string, Service[]>);

  const categoryLabels: Record<string, { label: string; color: string; icon: string }> = {
    essential: { label: 'Essential Services', color: 'bg-emerald-100 text-emerald-700', icon: 'ri-shield-check-line' },
    addon: { label: 'Add-on Services', color: 'bg-blue-100 text-blue-700', icon: 'ri-add-circle-line' },
    premium: { label: 'Premium Services', color: 'bg-purple-100 text-purple-700', icon: 'ri-vip-crown-line' },
    other: { label: 'Other Services', color: 'bg-neutral-100 text-neutral-700', icon: 'ri-more-line' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Pricing Management</h1>
          <p className="text-neutral-500 mt-1">Manage packages, discounts, and service pricing</p>
        </div>
        {saveSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse">
            <i className="ri-checkbox-circle-line" aria-hidden="true"></i>
            {saveSuccess}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <i className="ri-error-warning-line" aria-hidden="true"></i>
          {error}
          <button onClick={() => setError('')} className="ml-auto hover:bg-red-100 p-1 rounded">
            <i className="ri-close-line" aria-hidden="true"></i>
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <i className="ri-gift-line text-primary text-xl" aria-hidden="true"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{packages.length}</p>
              <p className="text-sm text-neutral-500">Packages</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <i className="ri-service-line text-secondary text-xl" aria-hidden="true"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{services.length}</p>
              <p className="text-sm text-neutral-500">Services</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <i className="ri-percent-line text-amber-600 text-xl" aria-hidden="true"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">
                {packages.filter(p => p.discount_percent > 0).length}
              </p>
              <p className="text-sm text-neutral-500">Active Discounts</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <i className="ri-check-double-line text-emerald-600 text-xl" aria-hidden="true"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">
                {services.filter(s => s.is_active).length}
              </p>
              <p className="text-sm text-neutral-500">Active Services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('packages')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'packages'
                ? 'bg-primary/5 text-primary border-b-2 border-primary'
                : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <i className="ri-gift-line mr-2" aria-hidden="true"></i>
            Packages ({packages.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'services'
                ? 'bg-primary/5 text-primary border-b-2 border-primary'
                : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <i className="ri-service-line mr-2" aria-hidden="true"></i>
            Services ({services.length})
          </button>
        </div>

        <div className="p-6">
          {/* Packages Tab */}
          {activeTab === 'packages' && (
            <div className="grid gap-6 md:grid-cols-2">
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  canEdit={canEdit}
                  isEditing={editingPackage?.id === pkg.id}
                  onEdit={() => setEditingPackage(pkg)}
                  onCancel={() => setEditingPackage(null)}
                  onSave={handleSavePackage}
                  isSaving={isSaving}
                />
              ))}
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-8">
              {Object.entries(categoryGroups).map(([category, categoryServices]) => (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${categoryLabels[category]?.color || categoryLabels.other.color}`}>
                      <i className={categoryLabels[category]?.icon || categoryLabels.other.icon} aria-hidden="true"></i>
                      {categoryLabels[category]?.label || category}
                    </span>
                    <span className="text-neutral-400 text-sm">({categoryServices.length})</span>
                  </div>
                  <div className="grid gap-3">
                    {categoryServices.map((svc) => (
                      <ServiceRow
                        key={svc.id}
                        service={svc}
                        canEdit={canEdit}
                        isEditing={editingService?.id === svc.id}
                        onEdit={() => setEditingService(svc)}
                        onCancel={() => setEditingService(null)}
                        onSave={handleSaveService}
                        isSaving={isSaving}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Package Card Component
function PackageCard({
  pkg,
  canEdit,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  isSaving,
}: {
  pkg: Package;
  canEdit: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (pkg: Package) => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState(pkg);

  useEffect(() => {
    setEditData(pkg);
  }, [pkg, isEditing]);

  const hasDiscount = editData.discount_percent > 0;
  const discountedPrice = hasDiscount
    ? editData.base_price * (1 - editData.discount_percent / 100)
    : editData.base_price;

  if (isEditing) {
    return (
      <div className="bg-primary/5 rounded-xl border-2 border-primary p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-neutral-900">{pkg.name_en}</h3>
          <span className="text-sm text-primary">Editing</span>
        </div>

        <div className="space-y-4">
          {/* Pricing Section */}
          <div className="bg-white rounded-lg p-4 border border-neutral-200">
            <h4 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
              <i className="ri-money-dollar-circle-line" aria-hidden="true"></i>
              Pricing
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Base Price (USD)</label>
                <input
                  type="number"
                  value={editData.base_price}
                  onChange={(e) => setEditData({ ...editData, base_price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Extra Adult</label>
                <input
                  type="number"
                  value={editData.price_per_extra_adult}
                  onChange={(e) => setEditData({ ...editData, price_per_extra_adult: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Extra Child</label>
                <input
                  type="number"
                  value={editData.price_per_extra_child}
                  onChange={(e) => setEditData({ ...editData, price_per_extra_child: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* Discount Section */}
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h4 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <i className="ri-percent-line" aria-hidden="true"></i>
              Discount
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-amber-700 mb-1">Discount %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editData.discount_percent || 0}
                  onChange={(e) => setEditData({ ...editData, discount_percent: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-amber-700 mb-1">Ends At (optional)</label>
                <input
                  type="datetime-local"
                  value={editData.discount_ends_at?.slice(0, 16) || ''}
                  onChange={(e) => setEditData({ ...editData, discount_ends_at: e.target.value || null })}
                  className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none bg-white"
                />
              </div>
            </div>
            {editData.discount_percent > 0 && (
              <div className="mt-3 p-2 bg-amber-100 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Preview:</strong> ${editData.base_price.toLocaleString()} → 
                  <span className="text-emerald-700 font-bold"> ${discountedPrice.toLocaleString()}</span>
                  <span className="text-amber-600"> (-{editData.discount_percent}%)</span>
                </p>
              </div>
            )}
          </div>

          {/* Status Section */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editData.is_active}
                onChange={(e) => setEditData({ ...editData, is_active: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary/20"
              />
              <span className="text-sm text-neutral-700">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editData.is_popular}
                onChange={(e) => setEditData({ ...editData, is_popular: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-300 text-secondary focus:ring-secondary/20"
              />
              <span className="text-sm text-neutral-700">Mark as Popular</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(editData)}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && <i className="ri-loader-4-line animate-spin" aria-hidden="true"></i>}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border-2 ${pkg.is_popular ? 'border-secondary' : 'border-neutral-200'} p-6 relative overflow-hidden`}>
      {pkg.is_popular && (
        <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          POPULAR
        </div>
      )}
      
      {pkg.discount_percent > 0 && (
        <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg flex items-center gap-1">
          <i className="ri-percent-line" aria-hidden="true"></i>
          {pkg.discount_percent}% OFF
        </div>
      )}

      <div className="flex items-start justify-between mb-4 mt-2">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${pkg.is_popular ? 'bg-secondary' : 'bg-primary/10'} flex items-center justify-center`}>
            <i className={`${pkg.is_popular ? 'ri-vip-crown-line text-white' : 'ri-user-heart-line text-primary'} text-2xl`} aria-hidden="true"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900">{pkg.name_en}</h3>
            <p className="text-sm text-neutral-500">{pkg.package_key}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          pkg.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-500'
        }`}>
          {pkg.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Price Display */}
      <div className="mb-4">
        {pkg.discount_percent > 0 ? (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">${discountedPrice.toLocaleString()}</span>
            <span className="text-lg text-neutral-400 line-through">${pkg.base_price.toLocaleString()}</span>
          </div>
        ) : (
          <span className="text-3xl font-bold text-primary">${pkg.base_price.toLocaleString()}</span>
        )}
        <p className="text-sm text-neutral-500 mt-1">for {pkg.adults_included} adults + {pkg.children_included} child</p>
      </div>

      {/* Extra Pricing */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-neutral-50 rounded-lg">
        <div>
          <p className="text-xs text-neutral-500">Extra Adult</p>
          <p className="text-sm font-semibold text-neutral-700">+${pkg.price_per_extra_adult}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500">Extra Child</p>
          <p className="text-sm font-semibold text-neutral-700">+${pkg.price_per_extra_child}</p>
        </div>
      </div>

      {/* Edit Button */}
      {canEdit && (
        <button
          onClick={onEdit}
          className="w-full py-2.5 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
        >
          <i className="ri-pencil-line" aria-hidden="true"></i>
          Edit Package
        </button>
      )}
    </div>
  );
}

// Service Row Component
function ServiceRow({
  service,
  canEdit,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  isSaving,
}: {
  service: Service;
  canEdit: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (svc: Service) => void;
  isSaving: boolean;
}) {
  const [editData, setEditData] = useState(service);

  useEffect(() => {
    setEditData(service);
  }, [service, isEditing]);

  if (isEditing) {
    return (
      <div className="bg-primary/5 rounded-lg border-2 border-primary p-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <i className={`${service.icon || 'ri-service-line'} text-primary text-lg`} aria-hidden="true"></i>
          </div>
          <div className="flex-1">
            <p className="font-medium text-neutral-900">{service.name_en}</p>
            <p className="text-xs text-neutral-500">{service.service_key}</p>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Price (USD)</label>
              <input
                type="number"
                value={editData.price}
                onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) || 0 })}
                className="w-24 px-3 py-1.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editData.is_active}
                onChange={(e) => setEditData({ ...editData, is_active: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-300 text-primary"
              />
              <span className="text-sm text-neutral-700">Active</span>
            </label>
            <button
              onClick={onCancel}
              className="px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(editData)}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1"
            >
              {isSaving && <i className="ri-loader-4-line animate-spin" aria-hidden="true"></i>}
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-4 hover:border-neutral-300 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <i className={`${service.icon || 'ri-service-line'} text-primary text-lg`} aria-hidden="true"></i>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-neutral-900 truncate">{service.name_en}</p>
            {service.included_in_basic && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-emerald-100 text-emerald-700 rounded">BASIC</span>
            )}
            {service.included_in_complete && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 rounded">COMPLETE</span>
            )}
          </div>
          <p className="text-xs text-neutral-500">{service.description_en}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-neutral-900">${service.price}</span>
          <span className={`w-2 h-2 rounded-full ${service.is_active ? 'bg-emerald-500' : 'bg-neutral-300'}`}></span>
          {canEdit && (
            <button
              onClick={onEdit}
              className="p-2 text-neutral-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              <i className="ri-pencil-line" aria-hidden="true"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
