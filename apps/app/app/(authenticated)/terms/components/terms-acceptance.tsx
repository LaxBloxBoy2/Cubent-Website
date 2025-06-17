'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Badge } from '@repo/design-system/components/ui/badge';
import { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle, Clock } from 'lucide-react';

interface TermsAcceptanceProps {
  userId: string;
  termsAccepted: boolean;
  termsAcceptedAt: Date | null;
}

export function TermsAcceptance({ 
  userId, 
  termsAccepted, 
  termsAcceptedAt 
}: TermsAcceptanceProps) {
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAcceptTerms = async () => {
    setIsAccepting(true);
    try {
      const response = await fetch('/api/terms/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        toast.success('Terms accepted successfully!');
        
        // Trigger extension connection after terms acceptance
        setTimeout(() => {
          const vscodeUrl = `vscode://cubent.cubent/connect?website=${encodeURIComponent(window.location.origin)}&termsAccepted=true`;
          window.open(vscodeUrl, '_blank');
          toast.success('Opening VS Code extension...');
        }, 1000);
        
        // Redirect to profile after a delay
        setTimeout(() => {
          window.location.href = '/profile';
        }, 3000);
      } else {
        toast.error('Failed to accept terms');
      }
    } catch (error) {
      toast.error('Failed to accept terms');
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <Card className={termsAccepted ? 'border-green-200 bg-green-50 dark:bg-green-950' : 'border-orange-200 bg-orange-50 dark:bg-orange-950'}>
      <CardHeader>
        <div className="flex items-center gap-2">
          {termsAccepted ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <Clock className="h-5 w-5 text-orange-600" />
          )}
          <CardTitle>
            {termsAccepted ? 'Terms Accepted' : 'Accept Terms to Continue'}
          </CardTitle>
        </div>
        <CardDescription>
          {termsAccepted 
            ? 'You have accepted the terms of service and can use the extension.'
            : 'You must accept these terms to connect your VS Code extension.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Status:</span>
          <Badge variant={termsAccepted ? 'default' : 'secondary'}>
            {termsAccepted ? 'Accepted' : 'Pending'}
          </Badge>
        </div>

        {termsAcceptedAt && (
          <div className="flex items-center justify-between">
            <span className="font-medium">Accepted on:</span>
            <span className="text-sm">
              {new Date(termsAcceptedAt).toLocaleDateString()}
            </span>
          </div>
        )}

        {!termsAccepted && (
          <div className="pt-4">
            <Button 
              onClick={handleAcceptTerms}
              disabled={isAccepting}
              className="w-full"
              size="lg"
            >
              {isAccepting ? 'Accepting Terms...' : 'Accept Terms and Connect Extension'}
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              By clicking this button, you agree to the terms of service above and authorize the connection between your VS Code extension and this website.
            </p>
          </div>
        )}

        {termsAccepted && (
          <div className="pt-4">
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = '/profile'}
            >
              Go to Profile
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
