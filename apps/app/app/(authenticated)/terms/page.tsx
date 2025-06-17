import { auth, currentUser } from '@repo/auth/server';
import { database } from '@repo/database';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { TermsAcceptance } from './components/terms-acceptance';

const title = 'Terms of Service';
const description = 'Terms of service for using the Cubent VS Code extension.';

export const metadata: Metadata = createMetadata({ title, description });

const TermsPage = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect('/sign-in');
  }

  // Find or create user in database
  let dbUser = await database.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    // Create new user
    dbUser = await database.user.create({
      data: {
        clerkId: userId,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || null,
        picture: user.imageUrl,
      },
    });
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By using the Cubent VS Code extension and connecting it to this website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Cubent is an AI-powered coding assistant that integrates with Visual Studio Code. Our service includes:
          </p>
          <ul>
            <li>AI-powered code generation and completion</li>
            <li>Code analysis and suggestions</li>
            <li>Integration with multiple AI models</li>
            <li>Usage analytics and reporting</li>
            <li>Settings synchronization between devices</li>
          </ul>

          <h2>3. User Accounts and Data</h2>
          <p>
            When you connect your extension to this website, we collect and store:
          </p>
          <ul>
            <li>Your account information (name, email, profile picture)</li>
            <li>Extension usage metrics (tokens used, requests made, costs)</li>
            <li>Your extension settings and preferences</li>
            <li>Session information for active connections</li>
          </ul>

          <h2>4. Privacy and Data Protection</h2>
          <p>
            We are committed to protecting your privacy. Your code and personal data are handled according to our Privacy Policy. We do not:
          </p>
          <ul>
            <li>Store or analyze your source code</li>
            <li>Share your personal information with third parties without consent</li>
            <li>Use your data for training AI models</li>
          </ul>

          <h2>5. Usage Limitations</h2>
          <p>
            Your use of the service is subject to certain limitations:
          </p>
          <ul>
            <li>Fair use policies for API requests and token usage</li>
            <li>Subscription tier limitations</li>
            <li>Rate limiting to prevent abuse</li>
          </ul>

          <h2>6. Subscription and Billing</h2>
          <p>
            Some features require a paid subscription. By subscribing, you agree to:
          </p>
          <ul>
            <li>Pay all applicable fees</li>
            <li>Automatic renewal unless cancelled</li>
            <li>Our refund and cancellation policies</li>
          </ul>

          <h2>7. Intellectual Property</h2>
          <p>
            The Cubent extension and website are protected by intellectual property laws. You retain ownership of your code and content, while we retain ownership of our software and services.
          </p>

          <h2>8. Prohibited Uses</h2>
          <p>
            You may not use our service to:
          </p>
          <ul>
            <li>Generate malicious or harmful code</li>
            <li>Violate any laws or regulations</li>
            <li>Infringe on others' intellectual property rights</li>
            <li>Attempt to reverse engineer or hack our systems</li>
          </ul>

          <h2>9. Service Availability</h2>
          <p>
            We strive to maintain high availability but cannot guarantee uninterrupted service. We may perform maintenance, updates, or experience outages that temporarily affect service availability.
          </p>

          <h2>10. Limitation of Liability</h2>
          <p>
            Our liability is limited to the maximum extent permitted by law. We are not responsible for any indirect, incidental, or consequential damages arising from your use of our service.
          </p>

          <h2>11. Changes to Terms</h2>
          <p>
            We may update these terms from time to time. We will notify you of significant changes and may require you to accept updated terms to continue using the service.
          </p>

          <h2>12. Termination</h2>
          <p>
            Either party may terminate this agreement at any time. Upon termination, your access to the service will be discontinued, and we may delete your data according to our retention policies.
          </p>

          <h2>13. Contact Information</h2>
          <p>
            If you have questions about these terms, please contact us at support@cubent.com.
          </p>

          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <TermsAcceptance 
          userId={dbUser.id}
          termsAccepted={dbUser.termsAccepted}
          termsAcceptedAt={dbUser.termsAcceptedAt}
        />
      </div>
    </div>
  );
};

export default TermsPage;
