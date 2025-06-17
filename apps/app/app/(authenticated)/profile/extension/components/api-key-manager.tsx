'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { Copy, Eye, EyeOff, RefreshCw } from 'lucide-react';

interface ApiKeyManagerProps {
  apiKey: string | null;
  userId: string;
}

export function ApiKeyManager({ apiKey, userId }: ApiKeyManagerProps) {
  const [showKey, setShowKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCopyKey = async () => {
    if (!apiKey) return;
    
    try {
      await navigator.clipboard.writeText(apiKey);
      toast.success('API key copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy API key');
    }
  };

  const handleGenerateKey = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/extension/generate-key', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('New API key generated successfully');
        window.location.reload();
      } else {
        toast.error('Failed to generate new API key');
      }
    } catch (error) {
      toast.error('Failed to generate new API key');
    } finally {
      setIsGenerating(false);
    }
  };

  const maskedKey = apiKey ? `${apiKey.slice(0, 12)}${'*'.repeat(apiKey.length - 16)}${apiKey.slice(-4)}` : '';

  return (
    <div className="space-y-4">
      {apiKey ? (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Your API Key</label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={showKey ? apiKey : maskedKey}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyKey}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleGenerateKey}
              disabled={isGenerating}
              className="flex-1"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : 'Regenerate Key'}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Keep your API key secure and don't share it with others</p>
            <p>• Regenerating will invalidate the current key</p>
            <p>• The extension will need to reconnect after regenerating</p>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            No API key generated yet. Connect your extension to generate one automatically.
          </p>
          
          <Button
            onClick={handleGenerateKey}
            disabled={isGenerating}
            className="w-full"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Generate API Key'}
          </Button>
        </div>
      )}
    </div>
  );
}
