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
        // Hide only header elements - keep footer for sign in link
        header: 'hidden',
        headerTitle: 'hidden',
        headerSubtitle: 'hidden',
        // Hide alternative methods and identity preview
        alternativeMethodsBlockButton: 'hidden',
        alternativeMethodsBlockButtonText: 'hidden',
        identityPreview: 'hidden',
        identityPreviewText: 'hidden',
        identityPreviewEditButton: 'hidden',
        // Clean styling with solid white background and no internal shadows
        rootBox: 'relative !bg-white rounded-3xl shadow-2xl min-w-[400px] mx-auto !border-0',
        card: '!bg-white !shadow-none !border-0 rounded-3xl p-8 mx-auto',
        main: '!bg-white !border-0 !shadow-none',
        modalContent: '!bg-white !border-0 !shadow-none',
        // Style the form button (Continue button) - force orange background
        formButtonPrimary: '!bg-gradient-to-r !from-orange-500 !to-orange-600 hover:!from-orange-600 hover:!to-orange-700 !text-white !shadow-lg !transition-all !duration-200 !py-3 !px-6 !text-base !w-full !rounded-lg !border-0',
      },
    }}
  />
);
