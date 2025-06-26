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
        // Check if we have the Clerk session cookie
        const sessionCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('__session='));

        if (!sessionCookie) {
          setAuthStatus({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
          return;
        }

        // Try to fetch user info from app.cubent.dev API
        const response = await fetch('https://app.cubent.dev/api/auth/user', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setAuthStatus({
            isAuthenticated: true,
            user: userData,
            isLoading: false,
          });
        } else {
          setAuthStatus({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Failed to check auth status:', error);
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
