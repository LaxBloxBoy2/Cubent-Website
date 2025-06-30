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
        // Hide only header elements - keep footer for sign up link
        header: 'hidden',
        headerTitle: 'hidden',
        headerSubtitle: 'hidden',
        // Hide alternative methods and identity preview
        alternativeMethodsBlockButton: 'hidden',
        alternativeMethodsBlockButtonText: 'hidden',
        identityPreview: 'hidden',
        identityPreviewText: 'hidden',
        identityPreviewEditButton: 'hidden',
        // Clean styling with solid white background and no internal shadows - more rounded
        rootBox: 'relative !bg-white rounded-[24px] shadow-2xl min-w-[400px] mx-auto !border-0',
        card: '!bg-white !shadow-none !border-0 rounded-[24px] p-8 mx-auto',
        main: '!bg-white !border-0 !shadow-none',
        modalContent: '!bg-white !border-0 !shadow-none',
        // Style the form button (Continue button) - reduced height
        formButtonPrimary: '!bg-gradient-to-r !from-orange-500 !to-orange-600 hover:!from-orange-600 hover:!to-orange-700 !text-white !shadow-md !transition-all !duration-200 !py-2 !px-6 !text-base !font-medium !w-full !rounded-xl !border-0',
        // Style Google button
        socialButtonsBlockButton: '!bg-slate-50 !border !border-slate-200 hover:!bg-slate-100 !text-gray-700 !shadow-sm hover:!shadow-md !transition-all !duration-200 !py-3 !px-6 !rounded-xl',
        // Style email input
        formFieldInput: '!bg-slate-50 !border !border-slate-200 focus:!bg-white focus:!border-orange-500 focus:!ring-2 focus:!ring-orange-500/20 !rounded-xl !py-3 !px-4 !text-base !transition-all !duration-200',
      },
    }}
  />
);
