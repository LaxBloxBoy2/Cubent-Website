'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export function CrossDomainAuthSync() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    async function setCrossDomainToken() {
      if (isLoaded && isSignedIn && user) {
        try {
          console.log('[CROSS-DOMAIN] Setting auth token for cubent.dev...');
          
          const response = await fetch('/api/auth/set-cross-domain-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            console.log('[CROSS-DOMAIN] Auth token set successfully');
          } else {
            console.error('[CROSS-DOMAIN] Failed to set auth token:', response.status);
          }
        } catch (error) {
          console.error('[CROSS-DOMAIN] Error setting auth token:', error);
        }
      }
    }

    setCrossDomainToken();
  }, [isLoaded, isSignedIn, user]);

  // This component doesn't render anything
  return null;
}
