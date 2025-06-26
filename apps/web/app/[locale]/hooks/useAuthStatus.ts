'use client';

import { useState, useEffect } from 'react';

type AuthUser = {
  id: string;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  emailAddresses: Array<{ emailAddress: string }>;
  imageUrl: string;
};

type AuthStatus = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
};

export function useAuthStatus(): AuthStatus {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        console.log('[AUTH] Checking authentication status...');
        console.log('[AUTH] All cookies:', document.cookie);

        // Check if we have the Clerk session cookie
        const sessionCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('__session='));

        console.log('[AUTH] Session cookie found:', !!sessionCookie);

        if (!sessionCookie) {
          console.log('[AUTH] No session cookie, setting not authenticated');
          setAuthStatus({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
          return;
        }

        console.log('[AUTH] Making API call to app.cubent.dev...');

        // Try to fetch user info from app.cubent.dev API
        const response = await fetch('https://app.cubent.dev/api/auth/user', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('[AUTH] API response status:', response.status);

        if (response.ok) {
          const userData = await response.json();
          console.log('[AUTH] User data received:', userData);
          setAuthStatus({
            isAuthenticated: true,
            user: userData,
            isLoading: false,
          });
        } else {
          const errorText = await response.text();
          console.log('[AUTH] API error response:', errorText);
          setAuthStatus({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('[AUTH] Failed to check auth status:', error);
        setAuthStatus({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    }

    checkAuthStatus();
  }, []);

  return authStatus;
}
