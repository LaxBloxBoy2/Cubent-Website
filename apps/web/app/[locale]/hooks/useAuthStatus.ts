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
    function checkAuthStatus() {
      try {
        console.log('[AUTH] Checking authentication status...');
        console.log('[AUTH] All cookies:', document.cookie);

        // Check if we have our custom auth token
        const authTokenCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('cubent_auth_token='));

        console.log('[AUTH] Auth token cookie found:', !!authTokenCookie);

        if (!authTokenCookie) {
          console.log('[AUTH] No auth token cookie, setting not authenticated');
          setAuthStatus({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
          return;
        }

        // Extract and decode the token
        const rawToken = authTokenCookie.split('=')[1];
        const token = decodeURIComponent(rawToken); // URL decode first
        console.log('[AUTH] Token found:', token.substring(0, 50) + '...');

        try {
          const userData = JSON.parse(atob(token));
          console.log('[AUTH] User data decoded:', userData);

          // Check if token is not too old (7 days)
          const tokenAge = Date.now() - userData.timestamp;
          const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

          if (tokenAge > maxAge) {
            console.log('[AUTH] Token expired, setting not authenticated');
            setAuthStatus({
              isAuthenticated: false,
              user: null,
              isLoading: false,
            });
            return;
          }

          setAuthStatus({
            isAuthenticated: true,
            user: userData,
            isLoading: false,
          });
        } catch (decodeError) {
          console.error('[AUTH] Failed to decode token:', decodeError);
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
