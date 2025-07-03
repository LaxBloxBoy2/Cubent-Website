'use client';

import { Badge } from '@repo/design-system/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/design-system/components/ui/table';
import { formatDistanceToNow } from 'date-fns';

interface RequestData {
  id: string;
  modelId: string;
  requestsMade: number;
  cubentUnitsUsed: number;
  tokensUsed: number;
  costAccrued: number;
  createdAt: Date;
  metadata?: any;
}

interface RequestsTableProps {
  data: RequestData[];
}

export function RequestsTable({ data }: RequestsTableProps) {
  const getStatusBadge = (requests: number) => {
    if (requests === 0) {
      return <Badge variant="destructive">Failed</Badge>;
    }
    return <Badge variant="default">Success</Badge>;
  };

  const getMethodBadge = (modelId: string) => {
    // Extract method from model ID or metadata
    const method = modelId.includes('gpt') ? 'POST' : 'GET';
    const color = method === 'POST' ? 'bg-blue-500' : 'bg-green-500';
    
    return (
      <Badge variant="outline" className={`${color} text-white border-0`}>
        {method}
      </Badge>
    );
  };

  const getEndpoint = (modelId: string) => {
    // Map model IDs to API endpoints
    const endpointMap: Record<string, string> = {
      'gpt-4': '/api/chat/completions',
      'gpt-3.5-turbo': '/api/chat/completions',
      'claude-3': '/api/anthropic/messages',
      'gemini-pro': '/api/google/generate',
    };
    
    return endpointMap[modelId] || '/api/extension/usage';
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-lg font-medium">No requests to show</p>
        <p className="text-sm text-muted-foreground">
          It may take up to 30 hours for data to refresh
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Units</TableHead>
            <TableHead>Tokens</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.slice(0, 10).map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {getMethodBadge(request.modelId)}
                  <span className="font-mono text-sm">
                    {getEndpoint(request.modelId)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(request.requestsMade)}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{request.modelId}</span>
                  <span className="text-xs text-muted-foreground">
                    {request.requestsMade} request{request.requestsMade !== 1 ? 's' : ''}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-mono">
                  {request.cubentUnitsUsed.toFixed(2)}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-mono">
                  {request.tokensUsed.toLocaleString()}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
