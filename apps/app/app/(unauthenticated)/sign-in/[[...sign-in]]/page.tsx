import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SignIn } from '@repo/auth/components/sign-in';

const title = 'Welcome back';
const description = 'Enter your details to sign in.';

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

  return <SignIn fallbackRedirectUrl={fallbackRedirectUrl} />;
};

export default SignInPage;
