import { SignIn as ClerkSignIn } from '@clerk/nextjs';

type SignInProps = {
  afterSignInUrl?: string;
  afterSignUpUrl?: string;
};

export const SignIn = ({ afterSignInUrl, afterSignUpUrl }: SignInProps) => (
  <ClerkSignIn
    afterSignInUrl={afterSignInUrl}
    afterSignUpUrl={afterSignUpUrl}
    appearance={{
      elements: {
        header: 'hidden',
      },
    }}
  />
);
