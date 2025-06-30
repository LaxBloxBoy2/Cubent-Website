import { SignUp as ClerkSignUp } from '@clerk/nextjs';

type SignUpProps = {
  fallbackRedirectUrl?: string;
  forceRedirectUrl?: string;
  signInFallbackRedirectUrl?: string;
  signInForceRedirectUrl?: string;
  // Legacy props for backward compatibility
  afterSignInUrl?: string;
  afterSignUpUrl?: string;
};

export const SignUp = ({
  fallbackRedirectUrl,
  forceRedirectUrl,
  signInFallbackRedirectUrl,
  signInForceRedirectUrl,
  afterSignInUrl,
  afterSignUpUrl
}: SignUpProps = {}) => (
  <ClerkSignUp
    fallbackRedirectUrl={fallbackRedirectUrl || afterSignUpUrl}
    forceRedirectUrl={forceRedirectUrl}
    signInFallbackRedirectUrl={signInFallbackRedirectUrl || afterSignInUrl}
    signInForceRedirectUrl={signInForceRedirectUrl}
    appearance={{
      elements: {
        header: 'hidden',
        footer: 'hidden',
        footerAction: 'hidden',
        footerActionLink: 'hidden',
      },
    }}
  />
);
