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
    // Form elements with orange accents and larger sizing - REMOVED DUPLICATE (moved to bottom with grey background)
    // Header elements - completely hidden
    header: 'hidden',
    headerTitle: 'hidden',
    headerSubtitle: 'hidden',
    // Hide alternative methods and identity preview
    alternativeMethodsBlockButton: 'hidden',
    alternativeMethodsBlockButtonText: 'hidden',
    identityPreview: 'hidden',
    identityPreviewText: 'hidden',
    identityPreviewEditButton: 'hidden',
    // Card styling with solid white background - FORCE ROUNDED modal box
    card: '!bg-white !shadow-none !border-0 !rounded-3xl p-4 mx-auto !overflow-hidden',
    main: '!bg-white !rounded-3xl !overflow-hidden',
    modalContent: '!bg-white !border-0 !shadow-none !rounded-3xl !overflow-hidden',
    rootBox: 'relative !bg-white !rounded-3xl shadow-2xl min-w-[400px] mx-auto !border-0 !overflow-hidden',
    // Style the form button (Continue button) - reduced height, NO ROUNDING
    formButtonPrimary: '!bg-gradient-to-r !from-orange-500 !to-orange-600 hover:!from-orange-600 hover:!to-orange-700 !text-white !shadow-md !transition-all !duration-200 !py-1.5 !px-6 !text-base !font-medium !w-full !rounded-none !border-0',
    // Style Google button with background
    socialButtonsBlockButton: '!bg-slate-50 !border !border-slate-200 hover:!bg-slate-100 !text-gray-700 !shadow-sm hover:!shadow-md !transition-all !duration-200 !py-3 !px-6 !rounded-lg',
    // Style email input with grey background
    formFieldInput: '!bg-slate-50 !border !border-slate-200 focus:!bg-white focus:!border-orange-500 focus:!ring-2 focus:!ring-orange-500/20 !rounded-lg !py-3 !px-4 !text-base !transition-all !duration-200',
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
