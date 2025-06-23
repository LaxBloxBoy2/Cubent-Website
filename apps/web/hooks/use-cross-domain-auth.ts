'use client';

import { env } from '@/env';
import { useEffect, useState } from 'react';

export interface CrossDomainUser {
  id: string;
  name: string | null;
  email: string | null;
  picture: string | null;
  subscriptionTier: string;
  subscriptionStatus: string;
  firstName: string | null;
  lastName: string | null;
}

export interface CrossDomainAuthState {
  isAuthenticated: boolean;
  user: CrossDomainUser | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to check authentication status across domains
 *
 * This hook calls the app domain (app-cubent.vercel.app) to check if a user
 * is authenticated and returns their profile information if they are.
 *
 * The hook includes caching to avoid unnecessary API calls and handles
 * loading states and errors appropriately.
 * Force deployment trigger.
 */
export function useCrossDomainAuth(): CrossDomainAuthState {
  const [state, setState] = useState<CrossDomainAuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout | undefined;

    const checkAuth = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        // Use production URL in production, fallback to env var or localhost in development
        const appUrl = process.env.NODE_ENV === 'production'
          ? 'https://app-cubent.vercel.app'
          : env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(`${appUrl}/api/auth/check-for-website`, {
          method: 'GET',
          credentials: 'include', // Include cookies for cross-domain auth
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (isMounted) {
          setState({
            isAuthenticated: data.isAuthenticated || false,
            user: data.user || null,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Cross-domain auth check failed:', error);
        
        if (isMounted) {
          setState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to check authentication',
          });
        }
      }
    };

    // Initial check
    checkAuth();

    // Set up periodic refresh (every 5 minutes)
    const refreshInterval = setInterval(() => {
      if (isMounted) {
        checkAuth();
      }
    }, 5 * 60 * 1000);

    // Cleanup function
    return () => {
      isMounted = false;
      clearInterval(refreshInterval);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return state;
}

/**
 * Hook variant that only checks once and doesn't refresh
 * Useful for components that don't need real-time auth status
 */
export function useCrossDomainAuthOnce(): CrossDomainAuthState {
  const [state, setState] = useState<CrossDomainAuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        // Use production URL in production, fallback to env var or localhost in development
        const appUrl = process.env.NODE_ENV === 'production'
          ? 'https://app-cubent.vercel.app'
          : env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(`${appUrl}/api/auth/check-for-website`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (isMounted) {
          setState({
            isAuthenticated: data.isAuthenticated || false,
            user: data.user || null,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Cross-domain auth check failed:', error);
        
        if (isMounted) {
          setState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to check authentication',
          });
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
