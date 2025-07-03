import { env } from '@/env';
import { auth, currentUser } from '@repo/auth/server';
import { SidebarProvider } from '@repo/design-system/components/ui/sidebar';
import { showBetaFeature } from '@repo/feature-flags';
import { NotificationsProvider } from '@repo/notifications/components/provider';
import { secure } from '@repo/security';
import type { ReactNode } from 'react';
import { AppHeader } from './components/app-header';
import { PostHogIdentifier } from './components/posthog-identifier';
import { GlobalSidebar } from './components/sidebar';

type AppLayoutProperties = {
  readonly children: ReactNode;
};

const AppLayout = async ({ children }: AppLayoutProperties) => {
  if (env.ARCJET_KEY) {
    await secure(['CATEGORY:PREVIEW']);
  }

  const user = await currentUser();
  const { redirectToSignIn } = await auth();
  const betaFeature = await showBetaFeature();

  if (!user) {
    return redirectToSignIn();
  }

  return (
    <NotificationsProvider userId={user.id}>
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <div className="flex-1 flex">
          <SidebarProvider>
            <GlobalSidebar>
              {betaFeature && (
                <div className="m-4 rounded-full bg-blue-500 p-1.5 text-center text-sm text-white">
                  Beta feature now available
                </div>
              )}
              {children}
            </GlobalSidebar>
            <PostHogIdentifier />
          </SidebarProvider>
        </div>
      </div>
    </NotificationsProvider>
  );
};

export default AppLayout;
