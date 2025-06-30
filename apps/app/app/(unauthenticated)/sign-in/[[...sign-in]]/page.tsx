import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SignIn } from '@repo/auth/components/sign-in';

const title = 'Sign in to Cubent.dev';
const description = 'Welcome back! Please sign in to continue.';

export const metadata: Metadata = createMetadata({ title, description });

type SignInPageProps = {
  searchParams: Promise<{
    device_id?: string;
    state?: string;
    redirect_url?: string;
  }>;
};

const SignInPage = async ({ searchParams }: SignInPageProps) => {
  const params = await searchParams;

  // Handle device OAuth flow - redirect to login page with device parameters
  if (params.device_id && params.state) {
    redirect(`/login?device_id=${params.device_id}&state=${params.state}`);
  }

  // Handle redirect_url parameter by updating the fallback redirect URL
  let fallbackRedirectUrl = '/auth-success';
  if (params.redirect_url) {
    fallbackRedirectUrl = `/auth-success?redirect_url=${encodeURIComponent(params.redirect_url)}`;
  }

  return (
    <>
      <div className="flex flex-col space-y-3 text-center">
        <div className="space-y-2">
          <h1 className="font-semibold text-2xl tracking-tight text-white">
            {title}
          </h1>
          <p className="text-white text-sm leading-relaxed">{description}</p>
        </div>
        {/* Orange accent line */}
        <div className="mx-auto w-16 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-60" />
      </div>
      <SignIn fallbackRedirectUrl={fallbackRedirectUrl} />
      {/* Privacy and Terms text */}
      <div className="text-center text-xs text-muted-foreground mt-4">
        By signing in, you agree to our{' '}
        <a
          href="/legal/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-500 hover:text-orange-600 underline transition-colors"
        >
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          href="/legal/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-500 hover:text-orange-600 underline transition-colors"
        >
          Privacy Policy
        </a>
        .
      </div>
    </>
  );
};

export default SignInPage;
