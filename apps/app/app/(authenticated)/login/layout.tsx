import { env } from '@/env';
import { auth, currentUser } from '@repo/auth/server';
import { NotificationsProvider } from '@repo/notifications/components/provider';
import { secure } from '@repo/security';
import type { ReactNode } from 'react';
import { AppHeader } from '../components/app-header';
import { PostHogIdentifier } from '../components/posthog-identifier';

type LoginLayoutProperties = {
  readonly children: ReactNode;
};

const LoginLayout = async ({ children }: LoginLayoutProperties) => {
  if (env.ARCJET_KEY) {
    await secure(['CATEGORY:PREVIEW']);
  }

  const user = await currentUser();
  const { redirectToSignIn } = await auth();

  if (!user) {
    return redirectToSignIn();
  }

  return (
    <NotificationsProvider userId={user.id}>
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <div className="flex-1">
          {children}
          <PostHogIdentifier />
        </div>
      </div>
    </NotificationsProvider>
  );
};

export default LoginLayout;
