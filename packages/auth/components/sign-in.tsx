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
        // Clean styling with solid white background - ROUNDED modal box with EVEN LESS padding
        rootBox: 'relative !bg-white !rounded-3xl shadow-2xl min-w-[400px] mx-auto !border-0',
        card: '!bg-white !shadow-none !border-0 !rounded-3xl p-4 mx-auto',
        main: '!bg-white !border-0 !shadow-none',
        modalContent: '!bg-white !border-0 !shadow-none',
        // Style the form button (Continue button) - reduced height, NO ROUNDING
        formButtonPrimary: '!bg-gradient-to-r !from-orange-500 !to-orange-600 hover:!from-orange-600 hover:!to-orange-700 !text-white !shadow-md !transition-all !duration-200 !py-1.5 !px-6 !text-base !font-medium !w-full !rounded-none !border-0',
        // Style Google button with background - FORCE ICON DISPLAY
        // Style Google button - REDUCED PADDING, FORCE ICON
        socialButtonsBlockButton: '!bg-slate-50 !border !border-slate-200 hover:!bg-slate-100 !text-gray-700 !shadow-sm hover:!shadow-md !transition-all !duration-200 !py-2 !px-4 !rounded-lg !flex !items-center !justify-center !gap-2 !min-h-[40px]',
        // Force provider icon to show - TRANSPARENT BACKGROUND
        socialButtonsProviderIcon: '!inline-flex !w-[18px] !h-[18px] !opacity-100 !visible !bg-transparent !flex-shrink-0',
        socialButtonsProviderIcon__google: '!inline-flex !w-[18px] !h-[18px] !opacity-100 !visible !bg-transparent !flex-shrink-0',
        // Style email input - REDUCED PADDING
        formFieldInput: '!bg-slate-50 !border !border-slate-200 focus:!bg-white focus:!border-orange-500 focus:!ring-2 focus:!ring-orange-500/20 !rounded-lg !py-2 !px-3 !text-base !transition-all !duration-200',
      },
    }}
  />
);
