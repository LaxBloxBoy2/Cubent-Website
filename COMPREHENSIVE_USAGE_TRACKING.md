# Comprehensive Usage Tracking API

This document describes how to implement comprehensive usage tracking in the VS Code extension to send Cubent Units, tokens, costs, and request data to the Neon database.

## API Endpoint

**POST** `/api/extension/track-usage`

This endpoint tracks all usage metrics in a single call:
- Cubent Units consumed
- Tokens used (input/output breakdown)
- Cost accrued
- Request count
- Metadata (feature, language, etc.)

## Authentication

Use Bearer token authentication in the Authorization header:

```typescript
headers: {
  'Authorization': `Bearer ${userToken}`,
  'Content-Type': 'application/json'
}
```

## Request Schema

```typescript
interface ComprehensiveUsageRequest {
  // Required fields
  modelId: string;           // e.g., "gpt-4", "claude-3-sonnet"
  provider: string;          // e.g., "openai", "anthropic"
  cubentUnits: number;       // Cubent Units consumed (>= 0)
  tokensUsed: number;        // Total tokens used (>= 0)
  costAccrued: number;       // Cost in USD (>= 0)
  requestsMade?: number;     // Number of requests (default: 1)
  
  // Optional fields
  configName?: string;       // Configuration name
  inputTokens?: number;      // Input tokens (for breakdown)
  outputTokens?: number;     // Output tokens (for breakdown)
  timestamp?: number;        // Unix timestamp
  sessionId?: string;        // Extension session ID
  feature?: string;          // Feature used (e.g., "code-completion", "chat")
  language?: string;         // Programming language
  metadata?: Record<string, any>; // Additional metadata
}
```

## Example Usage

### Basic Code Completion Tracking

```typescript
async function trackCodeCompletion(
  modelId: string,
  provider: string,
  cubentUnits: number,
  inputTokens: number,
  outputTokens: number,
  cost: number
) {
  const response = await fetch(`${API_BASE_URL}/api/extension/track-usage`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      modelId,
      provider,
      cubentUnits,
      tokensUsed: inputTokens + outputTokens,
      inputTokens,
      outputTokens,
      costAccrued: cost,
      requestsMade: 1,
      feature: 'code-completion',
      language: getCurrentLanguage(),
      sessionId: getSessionId(),
      metadata: {
        completionType: 'inline',
        accepted: true
      }
    }),
  });

  const result = await response.json();
  if (result.success) {
    console.log('Usage tracked:', result.data);
  }
}
```

### Chat Feature Tracking

```typescript
async function trackChatUsage(
  modelId: string,
  provider: string,
  cubentUnits: number,
  tokensUsed: number,
  cost: number,
  messageCount: number = 1
) {
  await fetch(`${API_BASE_URL}/api/extension/track-usage`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      modelId,
      provider,
      cubentUnits,
      tokensUsed,
      costAccrued: cost,
      requestsMade: messageCount,
      feature: 'chat',
      sessionId: getSessionId(),
      metadata: {
        conversationId: getCurrentConversationId(),
        messageType: 'user-query'
      }
    }),
  });
}
```

### Refactoring Feature Tracking

```typescript
async function trackRefactoring(
  modelId: string,
  provider: string,
  cubentUnits: number,
  tokensUsed: number,
  cost: number,
  language: string
) {
  await fetch(`${API_BASE_URL}/api/extension/track-usage`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      modelId,
      provider,
      cubentUnits,
      tokensUsed,
      costAccrued: cost,
      requestsMade: 1,
      feature: 'refactor',
      language,
      sessionId: getSessionId(),
      metadata: {
        refactorType: 'function-optimization',
        linesChanged: 25
      }
    }),
  });
}
```

## Response Format

### Success Response

```typescript
{
  success: true,
  message: "Comprehensive usage tracked successfully",
  data: {
    cubentUnitsUsed: 1.5,
    tokensUsed: 150,
    inputTokens: 100,
    outputTokens: 50,
    costAccrued: 0.003,
    requestsMade: 1,
    totalCubentUnits: 25.5,
    modelId: "gpt-4",
    provider: "openai",
    feature: "code-completion"
  }
}
```

### Error Response

```typescript
{
  error: "Error message",
  details?: "Additional error details"
}
```

## Getting Usage Statistics

**GET** `/api/extension/track-usage?days=30`

Returns comprehensive usage statistics for the specified period.

```typescript
async function getUserUsageStats(days: number = 30) {
  const response = await fetch(
    `${API_BASE_URL}/api/extension/track-usage?days=${days}`,
    {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    }
  );

  const result = await response.json();
  return result.data;
}
```

## Integration Guidelines

### 1. Track All AI Interactions

Every time the extension makes an AI API call, track the usage:

```typescript
// After making AI API call
const usage = calculateUsage(response);
await trackUsage({
  modelId: config.model,
  provider: config.provider,
  cubentUnits: usage.cubentUnits,
  tokensUsed: usage.totalTokens,
  inputTokens: usage.inputTokens,
  outputTokens: usage.outputTokens,
  costAccrued: usage.cost,
  feature: getCurrentFeature(),
  language: getActiveLanguage()
});
```

### 2. Batch Tracking for Performance

For high-frequency operations, consider batching:

```typescript
class UsageTracker {
  private pendingUsage: UsageData[] = [];
  
  async trackUsage(data: UsageData) {
    this.pendingUsage.push(data);
    
    if (this.pendingUsage.length >= 10) {
      await this.flushUsage();
    }
  }
  
  private async flushUsage() {
    // Send batched usage data
    const batch = this.pendingUsage.splice(0);
    // Process batch...
  }
}
```

### 3. Error Handling

Always handle tracking errors gracefully:

```typescript
async function safeTrackUsage(data: UsageData) {
  try {
    await trackUsage(data);
  } catch (error) {
    console.error('Usage tracking failed:', error);
    // Store locally for retry
    storeForRetry(data);
  }
}
```

## Database Schema

The tracking data is stored in these tables:

- **UsageMetrics**: Daily aggregated usage per user
- **UsageAnalytics**: Detailed per-request usage records
- **User**: Total Cubent Units counter

All data is automatically aggregated and available in the dashboard analytics.

## Migration from Legacy Tracking

If you're migrating from the legacy `/api/extension/units/track` endpoint:

1. Replace the endpoint URL
2. Add `tokensUsed` and `costAccrued` fields
3. Add optional `feature` and `language` metadata
4. Update response handling to use the new format

The legacy endpoint will continue to work for backward compatibility.
