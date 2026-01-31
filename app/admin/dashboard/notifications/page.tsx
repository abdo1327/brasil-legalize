'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAdminAuth } from '@/lib/admin/auth';
import Link from 'next/link';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'client_action' | 'system' | 'reminder' | 'alert';
  read: boolean;
  created_at: string;
  applicationId?: string;
}

type FilterType = 'all' | 'unread' | 'read' | 'client_action' | 'system' | 'reminder';

export default function NotificationsPage() {
  const { admin } = useAdminAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/notifications');
      const result = await response.json();
      if (result.success) {
        setNotifications(result.items || result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/admin/notifications?id=${id}`, { method: 'DELETE' });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'client_action':
        return 'ri-user-received-line text-blue-500';
      case 'system':
        return 'ri-checkbox-circle-line text-green-500';
      case 'reminder':
        return 'ri-alarm-line text-amber-500';
      case 'alert':
        return 'ri-alert-line text-red-500';
      default:
        return 'ri-notification-3-line text-neutral-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'client_action': return 'Client';
      case 'system': return 'System';
      case 'reminder': return 'Reminder';
      case 'alert': return 'Alert';
      default: return 'Other';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!notif.title.toLowerCase().includes(query) && 
          !notif.message.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Type/status filter
    switch (filter) {
      case 'unread':
        return !notif.read;
      case 'read':
        return notif.read;
      case 'client_action':
      case 'system':
      case 'reminder':
        return notif.type === filter;
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Notifications</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'} · {notifications.length} total
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <i className="ri-check-double-line"></i>
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-neutral-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></i>
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: 'Unread' },
              { key: 'read', label: 'Read' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as FilterType)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  filter === tab.key
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {tab.label}
                {tab.key === 'unread' && unreadCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <select
            value={filter === 'client_action' || filter === 'system' || filter === 'reminder' ? filter : ''}
            onChange={(e) => setFilter((e.target.value || 'all') as FilterType)}
            className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="">All Types</option>
            <option value="client_action">Client Actions</option>
            <option value="system">System</option>
            <option value="reminder">Reminders</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <i className="ri-notification-off-line text-3xl text-neutral-400"></i>
            </div>
            <h3 className="text-lg font-medium text-neutral-700">No notifications</h3>
            <p className="text-sm text-neutral-500 mt-1">
              {searchQuery ? 'Try a different search term' : 'You\'re all caught up!'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 hover:bg-neutral-50 transition-colors ${
                  !notif.read ? 'bg-blue-50/50' : ''
                }`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center`}>
                      <i className={`${getNotificationIcon(notif.type)} text-lg`}></i>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-sm ${!notif.read ? 'font-semibold text-neutral-900' : 'font-medium text-neutral-700'}`}>
                            {notif.title}
                          </h3>
                          {!notif.read && (
                            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-600 mt-0.5">{notif.message}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            notif.type === 'client_action' ? 'bg-blue-100 text-blue-700' :
                            notif.type === 'system' ? 'bg-green-100 text-green-700' :
                            notif.type === 'reminder' ? 'bg-amber-100 text-amber-700' :
                            'bg-neutral-100 text-neutral-600'
                          }`}>
                            {getTypeLabel(notif.type)}
                          </span>
                          <span className="text-xs text-neutral-400">{getTimeAgo(notif.created_at)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notif.read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="p-2 text-neutral-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <i className="ri-check-line text-lg"></i>
                          </button>
                        )}
                        {notif.applicationId && (
                          <Link
                            href={`/admin/dashboard/applications`}
                            className="p-2 text-neutral-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View application"
                          >
                            <i className="ri-external-link-line text-lg"></i>
                          </Link>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <i className="ri-delete-bin-line text-lg"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back to Dashboard */}
      <div className="flex justify-center">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <i className="ri-arrow-left-line"></i>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
