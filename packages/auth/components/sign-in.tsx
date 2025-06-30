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
}: SignInProps) => {
  console.log('SignIn component rendering with props:', {
    fallbackRedirectUrl,
    forceRedirectUrl,
    signUpFallbackRedirectUrl,
    signUpForceRedirectUrl,
    afterSignInUrl,
    afterSignUpUrl
  });

  try {
    return (
      <div style={{ minHeight: '400px', border: '2px solid red', padding: '20px' }}>
        <p style={{ color: 'red', marginBottom: '10px' }}>DEBUG: SignIn wrapper rendering</p>
        <ClerkSignIn
          fallbackRedirectUrl={fallbackRedirectUrl || afterSignInUrl}
          forceRedirectUrl={forceRedirectUrl}
          signUpFallbackRedirectUrl={signUpFallbackRedirectUrl || afterSignUpUrl}
          signUpForceRedirectUrl={signUpForceRedirectUrl}
          appearance={{
            elements: {
              header: 'hidden',
            },
          }}
        />
      </div>
    );
  } catch (error) {
    console.error('Error rendering SignIn component:', error);
    return <div style={{ color: 'red', padding: '20px' }}>Error: {String(error)}</div>;
  }
};
