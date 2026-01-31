'use client';

import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { useAdminAuth } from '@/lib/admin/auth';
import Link from 'next/link';
import { type AdminLocale, getAdminDictionary, type AdminDictionary } from '@/lib/admin/translations';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  applicationId?: string;
  clientName?: string;
  read: boolean;
  created_at: string;
}

const localeLabels: Record<AdminLocale, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇺🇸' },
  'pt-br': { name: 'Português', flag: '🇧🇷' },
};

// Create context for admin locale
interface AdminLocaleContextType {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
  t: AdminDictionary;
}

export const AdminLocaleContext = createContext<AdminLocaleContextType>({
  locale: 'en',
  setLocale: () => {},
  t: getAdminDictionary('en'),
});

export const useAdminLocale = () => useContext(AdminLocaleContext);

export function AdminHeader() {
  const { admin, logout } = useAdminAuth();
  const { locale: adminLocale, setLocale: setAdminLocale } = useAdminLocale(); // Use context
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Load admin profile data
  useEffect(() => {
    if (admin) {
      setProfileData({
        name: admin.name || '',
        email: admin.email || '',
      });
    }
  }, [admin]);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications?limit=10');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
        setUnreadCount(data.unreadCount);
      }
    } catch (e) {
      console.error('Failed to fetch notifications:', e);
    }
  };

  // Fetch on mount and every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchNotifications();
    } catch (e) {
      console.error('Failed to mark as read:', e);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
      fetchNotifications();
    } catch (e) {
      console.error('Failed to mark all as read:', e);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (locale: AdminLocale) => {
    setAdminLocale(locale); // This now updates the context
    setShowLanguageDropdown(false);
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess(false);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch('/api/admin/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPasswordSuccess(true);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess(false);
        }, 2000);
      } else {
        setPasswordError(data.error || 'Failed to change password');
      }
    } catch (error) {
      setPasswordError('An error occurred');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleProfileUpdate = async () => {
    setUpdatingProfile(true);
    try {
      const res = await fetch('/api/admin/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();
      if (data.success) {
        setShowProfileModal(false);
        window.location.reload();
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      super_admin: 'Super Admin',
      admin: 'Administrator',
      support: 'Support',
      finance: 'Finance',
    };
    return labels[role] || role;
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'client_action':
        return 'ri-user-received-line text-blue-500';
      case 'system':
        return 'ri-checkbox-circle-line text-green-500';
      case 'reminder':
        return 'ri-alarm-line text-amber-500';
      default:
        return 'ri-notification-3-line text-neutral-500';
    }
  };

  return (
    <header className="bg-white border-b border-neutral-200 h-16 sticky top-0 z-40">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left: Mobile menu button */}
        <button
          onClick={() => {
            // Dispatch custom event to open sidebar
            window.dispatchEvent(new CustomEvent('openAdminSidebar'));
          }}
          className="lg:hidden w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <i className="ri-menu-line text-xl"></i>
        </button>
        {/* Spacer for desktop */}
        <div className="hidden lg:block"></div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Language Switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center gap-1.5 px-2 lg:px-3 py-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <span className="text-lg">{localeLabels[adminLocale].flag}</span>
              <span className="text-sm hidden lg:inline">{localeLabels[adminLocale].name}</span>
              <i className={`ri-arrow-down-s-line text-xs transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`}></i>
            </button>

            {showLanguageDropdown && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-neutral-200 rounded-xl shadow-lg py-1 z-50">
                {(Object.keys(localeLabels) as AdminLocale[]).map((locale) => (
                  <button
                    key={locale}
                    onClick={() => handleLanguageChange(locale)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-neutral-50 ${
                      adminLocale === locale ? 'text-primary font-medium' : 'text-neutral-700'
                    }`}
                  >
                    <span className="text-lg">{localeLabels[locale].flag}</span>
                    <span>{localeLabels[locale].name}</span>
                    {adminLocale === locale && <i className="ri-check-line ml-auto text-primary"></i>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-10 h-10 flex items-center justify-center text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <i className="ri-notification-3-line text-xl" aria-hidden="true"></i>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 min-w-[18px] h-[18px] bg-red-500 rounded-full text-white text-xs font-medium flex items-center justify-center px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-[320px] bg-white border border-neutral-200 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-100 bg-neutral-50">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700">Notifications</span>
                    {notifications.length > 0 && (
                      <span className="px-1.5 py-0.5 text-xs bg-neutral-200 text-neutral-600 rounded-full">
                        {notifications.length}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs text-primary hover:text-primary/80 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-neutral-500">
                      <i className="ri-notification-off-line text-2xl mb-2 block opacity-50"></i>
                      <p className="text-xs">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => {
                          markAsRead(notif.id);
                          if (notif.applicationId) {
                            window.location.href = '/admin/dashboard/applications';
                          }
                        }}
                        className={`w-full text-left px-4 py-2.5 border-b border-neutral-50 hover:bg-neutral-50 transition-colors ${
                          !notif.read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex gap-2.5">
                          <div className="mt-0.5">
                            <i className={`${getNotificationIcon(notif.type)} text-base`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-xs ${!notif.read ? 'font-semibold text-neutral-900' : 'font-medium text-neutral-700'}`}>
                                {notif.title}
                              </p>
                              {!notif.read && (
                                <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0 mt-1"></span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-500 truncate">{notif.message}</p>
                            <p className="text-xs text-neutral-400 mt-0.5">{getTimeAgo(notif.created_at)}</p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <div className="px-3 py-2 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
                  <Link 
                    href="/admin/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                  >
                    <i className="ri-history-line"></i>
                    View all history
                  </Link>
                  <span className="text-xs text-neutral-400">
                    {notifications.length} total
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors border border-neutral-200"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <i className="ri-user-3-line text-white" aria-hidden="true"></i>
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-sm font-semibold text-neutral-900 truncate max-w-[120px]">{admin?.name}</div>
                <div className="text-xs text-neutral-500">
                  {getRoleLabel(admin?.role || '')}
                </div>
              </div>
              <i
                className={`ri-arrow-down-s-line text-neutral-400 transition-transform hidden sm:block ${
                  showDropdown ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              ></i>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-neutral-100">
                  <div className="text-sm font-medium text-neutral-900 truncate">{admin?.name}</div>
                  <div className="text-xs text-neutral-500 truncate">{admin?.email}</div>
                </div>

                <div className="py-1">
                  <button 
                    onClick={() => {
                      setShowDropdown(false);
                      setShowProfileModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    <i className="ri-user-settings-line" aria-hidden="true"></i>
                    Profile Settings
                  </button>
                  <button 
                    onClick={() => {
                      setShowDropdown(false);
                      setShowPasswordModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    <i className="ri-lock-password-line" aria-hidden="true"></i>
                    Change Password
                  </button>
                  <button 
                    onClick={() => {
                      setShowDropdown(false);
                      setShowSessionsModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                  >
                    <i className="ri-device-line" aria-hidden="true"></i>
                    Active Sessions
                  </button>
                </div>

                <div className="border-t border-neutral-100 pt-1">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <i className="ri-logout-box-line" aria-hidden="true"></i>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Change Password</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordError('');
                }}
                className="p-1 hover:bg-neutral-100 rounded-lg"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            {passwordSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-check-line text-3xl text-green-600"></i>
                </div>
                <p className="text-green-600 font-medium">Password changed successfully!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {passwordError && (
                  <p className="text-sm text-red-600">
                    <i className="ri-error-warning-line mr-1"></i>
                    {passwordError}
                  </p>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordChange}
                    disabled={changingPassword || !passwordData.currentPassword || !passwordData.newPassword}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {changingPassword && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    Change Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Settings Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Profile Settings</h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-1 hover:bg-neutral-100 rounded-lg"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto">
                  <i className="ri-user-3-line text-3xl text-white"></i>
                </div>
                <p className="text-sm text-neutral-500 mt-2">{getRoleLabel(admin?.role || '')}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled
                />
                <p className="text-xs text-neutral-400 mt-1">Email cannot be changed</p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProfileUpdate}
                  disabled={updatingProfile}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {updatingProfile && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Sessions Modal */}
      {showSessionsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Active Sessions</h3>
              <button
                onClick={() => setShowSessionsModal(false)}
                className="p-1 hover:bg-neutral-100 rounded-lg"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-3">
              {/* Current Session */}
              <div className="p-4 border border-primary/30 bg-primary/5 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <i className="ri-computer-line text-xl text-primary"></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-neutral-900">Current Session</p>
                      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">Active</span>
                    </div>
                    <p className="text-sm text-neutral-500 mt-1">
                      {typeof window !== 'undefined' ? window.navigator.userAgent.split(' ').slice(-2).join(' ') : 'Browser'}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      <i className="ri-map-pin-line mr-1"></i>
                      Current location
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-neutral-500 text-center py-4">
                <i className="ri-information-line mr-1"></i>
                Session management shows your active login sessions across devices.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 mt-4">
              <button
                onClick={() => setShowSessionsModal(false)}
                className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (confirm('This will sign you out from all devices. Continue?')) {
                    logout();
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out All Devices
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
