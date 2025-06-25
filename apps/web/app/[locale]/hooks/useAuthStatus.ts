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
        const response = await fetch('/api/auth-status');
        const data = await response.json();
        
        setAuthStatus({
          isAuthenticated: data.isAuthenticated,
          user: data.user || null,
          isLoading: false,
        });
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
