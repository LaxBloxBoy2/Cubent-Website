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
        // Completely hide all header elements
        header: 'hidden',
        headerTitle: 'hidden',
        headerSubtitle: 'hidden',
        // Completely hide all footer elements
        footer: 'hidden',
        footerAction: 'hidden',
        footerActionLink: 'hidden',
        footerActionText: 'hidden',
        footerPages: 'hidden',
        footerPagesLink: 'hidden',
        footerActionLinkText: 'hidden',
        // Hide alternative methods and identity preview
        alternativeMethodsBlockButton: 'hidden',
        alternativeMethodsBlockButtonText: 'hidden',
        identityPreview: 'hidden',
        identityPreviewText: 'hidden',
        identityPreviewEditButton: 'hidden',
        // Additional elements to hide
        footerActionLinkPages: 'hidden',
        footerActionLinkPagesText: 'hidden',
        // Use display none for stubborn elements
        rootBox: 'relative [&_.cl-footer]:!hidden [&_.cl-footerAction]:!hidden [&_.cl-footerActionLink]:!hidden [&_.cl-footerPages]:!hidden [&_.cl-header]:!hidden',
        card: 'bg-white shadow-2xl border border-gray-200 rounded-2xl p-8 mx-auto [&_.cl-footer]:!hidden [&_.cl-footerAction]:!hidden [&_.cl-footerActionLink]:!hidden [&_.cl-footerPages]:!hidden [&_.cl-header]:!hidden',
      },
    }}
  />
);
