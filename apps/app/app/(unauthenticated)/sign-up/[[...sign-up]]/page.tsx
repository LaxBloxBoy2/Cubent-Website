import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { SignUp } from '@repo/auth/components/sign-up';

const title = 'Create an account';
const description = 'Enter your details to get started.';

export const metadata: Metadata = createMetadata({ title, description });

const SignUpPage = () => (
  <>
    <div className="flex flex-col space-y-3 text-center">
      <div className="space-y-2">
        <h1 className="font-semibold text-2xl tracking-tight bg-gradient-to-r from-foreground via-orange-400 to-foreground bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
      {/* Orange accent line */}
      <div className="mx-auto w-16 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-60" />
    </div>
    <SignUp />
  </>
);

export default SignUpPage;
