'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initMixpanel, trackEvent } from '@/lib/mixpanel';

export function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize mixpanel on mount
    initMixpanel();
  }, []);

  useEffect(() => {
    if (pathname) {
      // Track page views when pathname changes
      trackEvent('Page Viewed', {
        pathname,
        url: `${window.location.origin}${pathname}${searchParams ? `?${searchParams}` : ''}`,
      });
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}
