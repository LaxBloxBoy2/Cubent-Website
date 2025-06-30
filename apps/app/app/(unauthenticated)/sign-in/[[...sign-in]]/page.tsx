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
      <div className="flex flex-col space-y-4 text-center">
        <div className="space-y-3">
          {/* Logo and brand */}
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Cubent
            </h2>
          </div>

          {/* Welcome message */}
          <h1 className="font-bold text-3xl tracking-tight text-white">
            ✨ Welcome back!
          </h1>
          <p className="text-gray-300 text-lg font-medium">Ready to dive back in?</p>
          <p className="text-muted-foreground text-sm leading-relaxed">Sign in to continue your journey</p>
        </div>
        {/* Orange accent line */}
        <div className="mx-auto w-20 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-80" />
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
