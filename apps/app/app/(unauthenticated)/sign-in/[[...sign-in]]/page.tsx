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

  // Handle redirect_url parameter by updating the after-sign-in URL
  let afterSignInUrl = '/auth-success';
  if (params.redirect_url) {
    afterSignInUrl = `/auth-success?redirect_url=${encodeURIComponent(params.redirect_url)}`;
  }

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <SignIn afterSignInUrl={afterSignInUrl} />
    </>
  );
};

export default SignInPage;
