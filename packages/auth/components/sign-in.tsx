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
        // Clean styling with solid white background
        rootBox: 'relative !bg-white rounded-2xl shadow-2xl min-w-[400px] mx-auto',
        card: '!bg-white shadow-2xl border border-gray-200 rounded-2xl p-8 mx-auto',
        main: '!bg-white',
        modalContent: '!bg-white',
      },
    }}
  />
);
