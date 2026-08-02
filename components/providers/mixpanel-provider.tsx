'use client';

import { useEffect } from 'react';
import { initMixpanel } from '@/lib/mixpanel';

export function MixpanelProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize mixpanel on mount
    initMixpanel();
  }, []);


  return <>{children}</>;
}
