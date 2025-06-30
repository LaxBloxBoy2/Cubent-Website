'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import type { Theme } from '@clerk/types';
import { useTheme } from 'next-themes';
import type { ComponentProps } from 'react';

type AuthProviderProperties = ComponentProps<typeof ClerkProvider> & {
  privacyUrl?: string;
  termsUrl?: string;
  helpUrl?: string;
};

export const AuthProvider = ({
  privacyUrl,
  termsUrl,
  helpUrl,
  ...properties
}: AuthProviderProperties) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const baseTheme = isDark ? dark : undefined;

  const variables: Theme['variables'] = {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontFamilyButtons: 'system-ui, -apple-system, sans-serif',
    fontWeight: {
      bold: 700,
      normal: 400,
      medium: 500,
    },
    // Orange color theming
    colorPrimary: '#f97316', // orange-500
    colorSuccess: '#10b981', // emerald-500
    colorWarning: '#f59e0b', // amber-500
    colorDanger: '#ef4444', // red-500
    colorNeutral: '#6b7280', // gray-500
    colorText: '#1f2937', // darker gray-800 for main text
    colorTextOnPrimaryBackground: '#ffffff',
    colorTextSecondary: '#374151', // darker gray-700 for secondary text like "Continue with Google"
    colorInputBackground: '#ffffff', // white background for inputs
    colorInputText: '#111827', // dark text for inputs
    borderRadius: '0.75rem', // rounded-xl
    spacingUnit: '1.25rem', // Increased spacing for larger form
  };

  const elements: Theme['elements'] = {
    dividerLine: 'bg-border',
    socialButtonsIconButton: 'bg-card hover:bg-orange-500/10 border-orange-500/20 transition-colors py-3 px-4',
    navbarButton: 'text-foreground',
    organizationSwitcherTrigger__open: 'bg-background',
    organizationPreviewMainIdentifier: 'text-foreground',
    organizationSwitcherTriggerIcon: 'text-muted-foreground',
    organizationPreview__organizationSwitcherTrigger: 'gap-2',
    organizationPreviewAvatarContainer: 'shrink-0',
    // Form elements with orange accents and larger sizing
    formButtonPrimary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg transition-all duration-200 py-3 px-6 text-base',
    formFieldInput: 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/20 bg-white py-3 px-4 text-base',
    // Header elements - completely hidden
    header: 'hidden',
    headerTitle: 'hidden',
    headerSubtitle: 'hidden',
    // Footer elements - completely hidden
    footer: 'hidden',
    footerAction: 'hidden',
    footerActionLink: 'hidden',
    footerActionText: 'hidden',
    footerPages: 'hidden',
    footerPagesLink: 'hidden',
    footerActionLinkText: 'hidden',
    // Additional elements to hide
    alternativeMethodsBlockButton: 'hidden',
    alternativeMethodsBlockButtonText: 'hidden',
    identityPreview: 'hidden',
    identityPreviewText: 'hidden',
    identityPreviewEditButton: 'hidden',
    // Clerk branding and links
    footerActionLinkPages: 'hidden',
    footerActionLinkPagesText: 'hidden',
    // Card styling with solid white background
    card: '!bg-white shadow-2xl border border-gray-200 rounded-2xl p-8 mx-auto',
    rootBox: '!bg-white rounded-2xl shadow-2xl min-w-[400px] mx-auto',
    main: '!bg-white',
    modalContent: '!bg-white',
  };

  const layout: Theme['layout'] = {
    privacyPageUrl: privacyUrl,
    termsPageUrl: termsUrl,
    helpPageUrl: helpUrl,
  };

  return (
    <ClerkProvider
      {...properties}
      appearance={{ layout, baseTheme, elements, variables }}
    />
  );
};
