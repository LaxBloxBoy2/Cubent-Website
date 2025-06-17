interface QuickStatsProps {
  usage: {
    tokensUsed: number;
    requestsMade: number;
    costAccrued: number;
  };
}

export function QuickStats({ usage }: QuickStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Tokens Used:</span>
        <span className="text-sm font-mono">{formatNumber(usage.tokensUsed)}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Requests Made:</span>
        <span className="text-sm font-mono">{formatNumber(usage.requestsMade)}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Cost Accrued:</span>
        <span className="text-sm font-mono">{formatCurrency(usage.costAccrued)}</span>
      </div>

      {usage.requestsMade > 0 && (
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Avg tokens/request:</span>
            <span className="text-xs font-mono">
              {Math.round(usage.tokensUsed / usage.requestsMade)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
