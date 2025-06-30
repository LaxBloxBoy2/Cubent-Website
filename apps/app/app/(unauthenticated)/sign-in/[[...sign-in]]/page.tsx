import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

const title = 'Welcome back';
const description = 'Enter your details to sign in.';
const SignIn = dynamic(() =>
  import('@repo/auth/components/sign-in').then((mod) => mod.SignIn)
);

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
          <h1 className="font-semibold text-2xl tracking-tight bg-gradient-to-r from-foreground via-orange-400 to-foreground bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
        {/* Orange accent line */}
        <div className="mx-auto w-16 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-60" />
      </div>
      <SignIn fallbackRedirectUrl={fallbackRedirectUrl} />
    </>
  );
};

export default SignInPage;
