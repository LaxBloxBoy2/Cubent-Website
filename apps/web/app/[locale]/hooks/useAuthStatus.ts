'use client';

import { useState } from 'react';

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
  // For now, just return not authenticated since cross-domain auth is complex
  // The user will need to click "Sign In" to go to app.cubent.dev
  return {
    isAuthenticated: false,
    user: null,
    isLoading: false,
  };
}
