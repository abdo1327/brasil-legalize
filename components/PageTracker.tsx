'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Generate or get visitor ID from localStorage
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = 'v_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('visitor_id', visitorId);
    }

    // Track session via API (stores in JSON file for admin dashboard)
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pagePath: pathname,
        visitorId,
      }),
    }).catch(() => {
      // Silently fail
    });
  }, [pathname]);

  return null;
}
