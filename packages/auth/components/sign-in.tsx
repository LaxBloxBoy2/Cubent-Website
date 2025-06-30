import { SignIn as ClerkSignIn } from '@clerk/nextjs';

type SignInProps = {
  fallbackRedirectUrl?: string;
  forceRedirectUrl?: string;
  signUpFallbackRedirectUrl?: string;
  signUpForceRedirectUrl?: string;
  // Legacy props for backward compatibility
  afterSignInUrl?: string;
  afterSignUpUrl?: string;
};

export const SignIn = ({
  fallbackRedirectUrl,
  forceRedirectUrl,
  signUpFallbackRedirectUrl,
  signUpForceRedirectUrl,
  afterSignInUrl,
  afterSignUpUrl
}: SignInProps) => (
  <ClerkSignIn
    fallbackRedirectUrl={fallbackRedirectUrl || afterSignInUrl}
    forceRedirectUrl={forceRedirectUrl}
    signUpFallbackRedirectUrl={signUpFallbackRedirectUrl || afterSignUpUrl}
    signUpForceRedirectUrl={signUpForceRedirectUrl}
    appearance={{
      elements: {
        header: 'hidden',
        headerTitle: 'hidden',
        headerSubtitle: 'hidden',
        footer: 'hidden',
        footerAction: 'hidden',
        footerActionLink: 'hidden',
        footerActionText: 'hidden',
        footerPages: 'hidden',
        footerPagesLink: 'hidden',
      },
    }}
  />
);
