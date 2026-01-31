'use client';

import { useAdminAuth } from '@/lib/admin/auth';
import { useAdminLocale } from '@/components/admin/Header';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'primary' | 'secondary' | 'accent' | 'neutral';
  href?: string;
}

function StatCard({ title, value, icon, trend, color, href }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    secondary: 'bg-blue-50 text-blue-600 border-blue-200',
    accent: 'bg-amber-50/70 text-amber-700 border-amber-100',
    neutral: 'bg-neutral-50 text-neutral-600 border-neutral-200',
  };

  const content = (
    <div className={`rounded-lg border p-4 hover:shadow-md transition-all cursor-pointer h-full min-h-[100px] ${colorClasses[color]}`}>
      <div className="flex items-center justify-between h-full">
        <div>
          <p className="text-xs font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 flex items-center gap-1 ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <i className={trend.isPositive ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} aria-hidden="true"></i>
              {trend.value}%
            </p>
          )}
        </div>
        <i className={`${icon} text-2xl opacity-60`} aria-hidden="true"></i>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

// Simple bar chart component
function BarChart({ data, title, href }: { data: { label: string; value: number; color: string }[]; title: string; href: string }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <Link href={href} className="bg-white rounded-xl border border-neutral-200 p-4 hover:shadow-md transition-all block">
      <h3 className="text-sm font-semibold text-neutral-700 mb-3">{title}</h3>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 w-20 truncate">{item.label}</span>
            <div className="flex-1 h-5 bg-neutral-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${item.color} transition-all`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-neutral-700 w-8 text-right">{item.value}</span>
          </div>
        ))}
      </div>
    </Link>
  );
}

// Donut chart component
function DonutChart({ data, title, href, total }: { data: { label: string; value: number; color: string }[]; title: string; href: string; total: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  
  return (
    <Link href={href} className="bg-white rounded-xl border border-neutral-200 p-4 hover:shadow-md transition-all block">
      <h3 className="text-sm font-semibold text-neutral-700 mb-3">{title}</h3>
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = total > 0 ? (item.value / total) * 100 : 0;
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -offset;
              offset += (percentage / 100) * circumference;
              
              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="12"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                />
              );
            })}
            <circle cx="50" cy="50" r="30" fill="white" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-neutral-900">{total}</span>
          </div>
        </div>
        <div className="space-y-1.5">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="text-xs text-neutral-600">{item.label}</span>
              <span className="text-xs font-semibold text-neutral-800">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}

interface DashboardStats {
  totalClients: number;
  activeCases: number;
  pendingDocuments: number;
  unreadMessages: number;
  newLeads: number;
}

interface DashboardTrends {
  clientsTrend: number;
  casesTrend: number;
}

interface ActivityItem {
  action: string;
  name: string;
  time: string;
  icon: string;
  color: string;
}

export default function DashboardPage() {
  const { admin } = useAdminAuth();
  const { t, locale } = useAdminLocale();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<DashboardTrends | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const result = await response.json();
      // API returns { stats, trends, recentActivity } directly
      if (result.stats) {
        setStats(result.stats);
        setTrends(result.trends);
        setRecentActivity(result.recentActivity || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Chart data with translations
  const casesByPhase = [
    { label: t.applications.phases.lead, value: stats?.newLeads || 0, color: 'bg-blue-500' },
    { label: t.applications.phases.onboarding, value: Math.floor((stats?.activeCases || 0) * 0.3), color: 'bg-amber-500' },
    { label: t.applications.phases.documents, value: stats?.pendingDocuments || 0, color: 'bg-purple-500' },
    { label: t.applications.phases.completed, value: Math.floor((stats?.totalClients || 0) * 0.5), color: 'bg-green-500' },
  ];

  const documentStatus = [
    { label: t.documents.pending, value: stats?.pendingDocuments || 0, color: '#f59e0b' },
    { label: t.documents.approved, value: Math.floor((stats?.totalClients || 0) * 2), color: '#22c55e' },
    { label: t.documents.rejected, value: Math.floor((stats?.pendingDocuments || 0) * 0.1), color: '#ef4444' },
  ];

  const docTotal = documentStatus.reduce((sum, d) => sum + d.value, 0);
  const dateLocale = locale === 'pt-br' ? 'pt-BR' : 'en-US';

  return (
    <div className="space-y-4">
      {/* Welcome Header - Compact */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-lg px-4 py-3 text-white flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">{t.dashboard.welcome}, {admin?.name?.split(' ')[0] || 'Admin'}!</h1>
          <p className="text-white/80 text-xs">{t.dashboard.subtitle}</p>
        </div>
        <div className="text-right text-xs text-white/70">
          <p>{new Date().toLocaleDateString(dateLocale, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Grid - Unified Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          title={t.dashboard.totalClients}
          value={stats?.totalClients || 0}
          icon="ri-user-line"
          color="primary"
          trend={trends ? { value: Math.abs(trends.clientsTrend), isPositive: trends.clientsTrend >= 0 } : undefined}
          href="/admin/dashboard/clients"
        />
        <StatCard
          title={t.dashboard.activeCases}
          value={stats?.activeCases || 0}
          icon="ri-briefcase-line"
          color="secondary"
          trend={trends ? { value: Math.abs(trends.casesTrend), isPositive: trends.casesTrend >= 0 } : undefined}
          href="/admin/dashboard/applications"
        />
        <StatCard
          title={t.dashboard.pendingDocs}
          value={stats?.pendingDocuments || 0}
          icon="ri-file-warning-line"
          color="accent"
          href="/admin/dashboard/documents"
        />
        <StatCard
          title={t.dashboard.newLeads}
          value={stats?.newLeads || 0}
          icon="ri-user-heart-line"
          color="neutral"
          href="/admin/dashboard/eligibility"
        />
        <StatCard
          title={t.dashboard.sessions}
          value={stats?.unreadMessages || 0}
          icon="ri-eye-line"
          color="neutral"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <BarChart 
          data={casesByPhase}
          title={t.dashboard.casesByPhase}
          href="/admin/dashboard/applications"
        />
        <DonutChart 
          data={documentStatus}
          title={t.dashboard.documentStatus}
          href="/admin/dashboard/documents"
          total={docTotal}
        />
        
        {/* Recent Activity - Compact */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-neutral-700">{t.dashboard.recentActivity}</h3>
            <Link href="/admin/dashboard/applications" className="text-xs text-primary hover:underline">{t.dashboard.viewAll}</Link>
          </div>
          <div className="space-y-2">
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 4).map((activity, index) => (
                <Link 
                  key={index} 
                  href="/admin/dashboard/applications"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <div className={`w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center ${activity.color}`}>
                    <i className={`${activity.icon} text-xs`} aria-hidden="true"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-700 truncate">{activity.action}</p>
                    <p className="text-xs text-neutral-400 truncate">{activity.name}</p>
                  </div>
                  <span className="text-xs text-neutral-400">{activity.time}</span>
                </Link>
              ))
            ) : (
              <p className="text-xs text-neutral-400 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Links Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/admin/dashboard/clients" className="flex items-center gap-3 p-3 bg-white rounded-lg border border-neutral-200 hover:border-primary hover:shadow-sm transition-all">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <i className="ri-user-line text-primary" aria-hidden="true"></i>
          </div>
          <span className="text-sm font-medium text-neutral-700">{t.dashboard.viewClients}</span>
        </Link>
        <Link href="/admin/dashboard/clients/new" className="flex items-center gap-3 p-3 bg-white rounded-lg border border-neutral-200 hover:border-secondary hover:shadow-sm transition-all">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
            <i className="ri-user-add-line text-secondary" aria-hidden="true"></i>
          </div>
          <span className="text-sm font-medium text-neutral-700">{t.dashboard.addClient}</span>
        </Link>
        <Link href="/admin/dashboard/documents" className="flex items-center gap-3 p-3 bg-white rounded-lg border border-neutral-200 hover:border-amber-500 hover:shadow-sm transition-all">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <i className="ri-folder-line text-amber-600" aria-hidden="true"></i>
          </div>
          <span className="text-sm font-medium text-neutral-700">{t.sidebar.documents}</span>
        </Link>
        <Link href="/admin/dashboard/applications" className="flex items-center gap-3 p-3 bg-white rounded-lg border border-neutral-200 hover:border-neutral-400 hover:shadow-sm transition-all">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
            <i className="ri-flow-chart text-neutral-600" aria-hidden="true"></i>
          </div>
          <span className="text-sm font-medium text-neutral-700">{t.sidebar.applications}</span>
        </Link>
      </div>
    </div>
  );
}
