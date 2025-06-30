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
    fontFamily: 'var(--font-sans)',
    fontFamilyButtons: 'var(--font-sans)',
    fontWeight: {
      bold: 'var(--font-weight-bold)',
      normal: 'var(--font-weight-normal)',
      medium: 'var(--font-weight-medium)',
    },
    // Orange color theming
    colorPrimary: '#f97316', // orange-500
    colorSuccess: '#10b981', // emerald-500
    colorWarning: '#f59e0b', // amber-500
    colorDanger: '#ef4444', // red-500
    colorNeutral: '#6b7280', // gray-500
    colorTextOnPrimaryBackground: '#ffffff',
    colorTextSecondary: '#9ca3af', // gray-400
    colorInputBackground: 'rgba(0, 0, 0, 0.1)',
    colorInputText: 'var(--foreground)',
    borderRadius: '0.75rem', // rounded-xl
    spacingUnit: '1rem',
  };

  const elements: Theme['elements'] = {
    dividerLine: 'bg-border',
    socialButtonsIconButton: 'bg-card hover:bg-orange-500/10 border-orange-500/20 transition-colors',
    navbarButton: 'text-foreground',
    organizationSwitcherTrigger__open: 'bg-background',
    organizationPreviewMainIdentifier: 'text-foreground',
    organizationSwitcherTriggerIcon: 'text-muted-foreground',
    organizationPreview__organizationSwitcherTrigger: 'gap-2',
    organizationPreviewAvatarContainer: 'shrink-0',
    // Form elements with orange accents
    formButtonPrimary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg transition-all duration-200',
    formFieldInput: 'border-gray-600 focus:border-orange-500 focus:ring-orange-500/20 bg-background/50 backdrop-blur-sm',
    card: 'bg-transparent shadow-none border-none',
    rootBox: 'bg-transparent',
    // Header styling
    headerTitle: 'text-foreground font-semibold text-xl',
    headerSubtitle: 'text-muted-foreground text-sm',
    // Footer links with orange hover
    footerActionLink: 'text-orange-400 hover:text-orange-300 transition-colors',
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
