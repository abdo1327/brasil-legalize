'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin/auth';
import { useState, useEffect } from 'react';
import { useAdminLocale } from './Header';

interface NavItem {
  key: string;
  href: string;
  icon: string;
  permission?: string;
}

const navigationItems: NavItem[] = [
  { key: 'dashboard', href: '/admin/dashboard', icon: 'ri-dashboard-line' },
  { key: 'applications', href: '/admin/dashboard/applications', icon: 'ri-flow-chart' },
  { key: 'clients', href: '/admin/dashboard/clients', icon: 'ri-user-line' },
  { key: 'contacts', href: '/admin/dashboard/contacts', icon: 'ri-mail-line' },
  { key: 'notifications', href: '/admin/dashboard/notifications', icon: 'ri-notification-line' },
  { key: 'documents', href: '/admin/dashboard/documents', icon: 'ri-folder-line' },
  { key: 'eligibility', href: '/admin/dashboard/eligibility', icon: 'ri-checkbox-circle-line' },
  { key: 'pricing', href: '/admin/dashboard/pricing', icon: 'ri-price-tag-3-line', permission: 'pricing.view' },
];

// Export state setter for Header to control mobile menu
let setMobileMenuOpen: ((open: boolean) => void) | null = null;
export const openMobileMenu = () => setMobileMenuOpen?.(true);

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Register the setter for external control
  useEffect(() => {
    setMobileMenuOpen = setMobileOpen;
    return () => { setMobileMenuOpen = null; };
  }, []);
  const pathname = usePathname();
  const { hasPermission, admin } = useAdminAuth();
  const { t } = useAdminLocale();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Listen for open sidebar event from Header
  useEffect(() => {
    const handleOpenSidebar = () => setMobileOpen(true);
    window.addEventListener('openAdminSidebar', handleOpenSidebar);
    return () => window.removeEventListener('openAdminSidebar', handleOpenSidebar);
  }, []);

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleNavItems = navigationItems.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  const getNavName = (key: string): string => {
    const navMap: Record<string, string> = {
      dashboard: t.sidebar.dashboard,
      applications: t.sidebar.applications,
      clients: t.sidebar.clients,
      contacts: t.sidebar.contacts || 'Contacts',
      notifications: t.sidebar.notifications || 'Notifications',
      documents: t.sidebar.documents,
      eligibility: t.sidebar.eligibility,
      pricing: t.sidebar.pricing,
    };
    return navMap[key] || key;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between border-b border-neutral-200 px-4">
        {collapsed && !mobileOpen ? (
          <span className="text-2xl font-bold text-primary mx-auto">BL</span>
        ) : (
          <span className="text-xl font-bold text-primary">Brasil Legalize</span>
        )}
        {/* Mobile close button */}
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 text-neutral-500 hover:text-neutral-700"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleNavItems.map((item) => {
          const isActive = item.href === '/admin/dashboard' 
            ? pathname === '/admin/dashboard'
            : pathname === item.href || pathname.startsWith(item.href + '/');
          const name = getNavName(item.key);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center ${collapsed && !mobileOpen ? 'justify-center' : ''} gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? collapsed && !mobileOpen ? '' : 'bg-primary text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
              title={collapsed && !mobileOpen ? name : undefined}
            >
              <div className={`flex items-center justify-center flex-shrink-0 ${
                collapsed && !mobileOpen
                  ? `w-10 h-10 rounded-xl ${isActive ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`
                  : ''
              }`}>
                <i className={`${item.icon} text-xl`} aria-hidden="true"></i>
              </div>
              {(!collapsed || mobileOpen) && <span className="font-medium truncate">{name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle - Desktop only */}
      <div className="p-4 border-t border-neutral-200 hidden lg:block">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : ''} gap-2 px-3 py-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors`}
        >
          <i
            className={`${collapsed ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'} text-xl flex-shrink-0`}
            aria-hidden="true"
          ></i>
          {!collapsed && <span className="text-sm">{t.sidebar.collapse}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-white border-r border-neutral-200 h-screen flex-shrink-0 transition-all duration-300
          ${mobileOpen ? 'fixed inset-y-0 left-0 z-50 w-64' : 'hidden lg:block lg:sticky lg:top-0'}
          ${!mobileOpen && collapsed ? 'lg:w-16' : 'lg:w-64'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
