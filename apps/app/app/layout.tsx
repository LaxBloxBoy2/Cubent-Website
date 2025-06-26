import { env } from '@/env';
import './styles.css';
import { AnalyticsProvider } from '@repo/analytics';
import { DesignSystemProvider } from '@repo/design-system';
import { fonts } from '@repo/design-system/lib/fonts';
import { Toolbar } from '@repo/feature-flags/components/toolbar';
import type { ReactNode } from 'react';
import { CrossDomainAuthSync } from './(authenticated)/components/CrossDomainAuthSync';

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html lang="en" className={fonts} suppressHydrationWarning>
    <body>
      <AnalyticsProvider>
        <DesignSystemProvider
          privacyUrl={new URL(
            '/legal/privacy',
            env.NEXT_PUBLIC_WEB_URL
          ).toString()}
          termsUrl={new URL('/legal/terms', env.NEXT_PUBLIC_WEB_URL).toString()}
          helpUrl={env.NEXT_PUBLIC_DOCS_URL}
        >
          {children}
          <CrossDomainAuthSync />
        </DesignSystemProvider>
        <Toolbar />
      </AnalyticsProvider>
    </body>
  </html>
);

export default RootLayout;
