'use client';

import { Progress } from '@repo/design-system/components/ui/progress';
import { Badge } from '@repo/design-system/components/ui/badge';

interface ModelData {
  modelId: string;
  requests: number;
  cubentUnits: number;
  tokens: number;
  cost: number;
}

interface ModelBreakdownProps {
  data: ModelData[];
  detailed?: boolean;
}

export function ModelBreakdown({ data, detailed = false }: ModelBreakdownProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">No model usage data</p>
      </div>
    );
  }

  // Sort by usage (cubent units)
  const sortedData = [...data].sort((a, b) => b.cubentUnits - a.cubentUnits);
  const maxUsage = Math.max(...sortedData.map(item => item.cubentUnits));

  const getModelDisplayName = (modelId: string) => {
    const displayNames: Record<string, string> = {
      'gpt-4': 'GPT-4',
      'gpt-4-turbo': 'GPT-4 Turbo',
      'gpt-3.5-turbo': 'GPT-3.5 Turbo',
      'claude-3-opus': 'Claude 3 Opus',
      'claude-3-sonnet': 'Claude 3 Sonnet',
      'claude-3-haiku': 'Claude 3 Haiku',
      'gemini-pro': 'Gemini Pro',
      'gemini-1.5-pro': 'Gemini 1.5 Pro',
    };
    
    return displayNames[modelId] || modelId;
  };

  const getModelColor = (modelId: string) => {
    const colors: Record<string, string> = {
      'gpt-4': 'bg-blue-500',
      'gpt-4-turbo': 'bg-blue-600',
      'gpt-3.5-turbo': 'bg-blue-400',
      'claude-3-opus': 'bg-purple-500',
      'claude-3-sonnet': 'bg-purple-400',
      'claude-3-haiku': 'bg-purple-300',
      'gemini-pro': 'bg-green-500',
      'gemini-1.5-pro': 'bg-green-600',
    };
    
    return colors[modelId] || 'bg-gray-500';
  };

  if (detailed) {
    return (
      <div className="space-y-4">
        {sortedData.map((model) => (
          <div key={model.modelId} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getModelColor(model.modelId)}`} />
                <span className="font-medium">{getModelDisplayName(model.modelId)}</span>
              </div>
              <Badge variant="outline">
                {model.requests} requests
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Units</p>
                <p className="font-mono">{model.cubentUnits.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tokens</p>
                <p className="font-mono">{model.tokens.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Cost</p>
                <p className="font-mono">${model.cost.toFixed(3)}</p>
              </div>
            </div>
            
            <Progress 
              value={(model.cubentUnits / maxUsage) * 100} 
              className="h-2"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedData.slice(0, 5).map((model) => (
        <div key={model.modelId} className="flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full ${getModelColor(model.modelId)}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium truncate">
                {getModelDisplayName(model.modelId)}
              </p>
              <p className="text-sm text-muted-foreground">
                {model.cubentUnits.toFixed(1)}
              </p>
            </div>
            <Progress 
              value={(model.cubentUnits / maxUsage) * 100} 
              className="h-1 mt-1"
            />
          </div>
        </div>
      ))}
      
      {sortedData.length > 5 && (
        <p className="text-xs text-muted-foreground text-center pt-2">
          +{sortedData.length - 5} more models
        </p>
      )}
    </div>
  );
}
