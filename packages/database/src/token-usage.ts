/**
 * Token Usage Service
 * Handles Cubent Units calculation and tracking based on model usage
 */

// Model pricing in Cubent Units based on the documentation
export const MODEL_PRICING: Record<string, number> = {
  // Anthropic Claude Models
  'claude-3.7-sonnet': 1.1,
  'claude-3.7-sonnet-thinking': 1.35,
  'claude-3.5-sonnet': 0.95,
  'claude-3.5-haiku': 0.55,
  'claude-3-haiku': 0.45,

  // OpenAI Models
  'gpt-4o': 1.1,
  'gpt-4.5-preview': 1.2,
  'gpt-4o-mini': 0.65,
  'o3-mini': 1.0,
  'o3-mini-high-reasoning': 1.1,
  'o3-mini-low-reasoning': 0.75,

  // DeepSeek Models
  'deepseek-chat': 0.35,
  'deepseek-reasoner': 0.7,

  // Google Gemini Models
  'gemini-2.5-flash': 0.3,
  'gemini-2.5-flash-thinking': 0.4,
  'gemini-2.5-pro': 0.85,
  'gemini-2.0-flash': 0.45,
  'gemini-2.0-pro': 0.70,
  'gemini-1.5-flash': 0.40,
  'gemini-1.5-pro': 0.65,

  // xAI Grok Models
  'grok-3': 1.1,
  'grok-3-mini': 0.30,
  'grok-2-vision': 0.70,

  // Default fallback for unknown models
  'default': 1.0,
};

export interface TokenUsageData {
  modelId: string;
  cubentUnitsUsed: number;
  tokensUsed?: number;
  requestsMade: number;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface UserUsageStats {
  cubentUnitsUsed: number;
  cubentUnitsLimit: number;
  cubentUnitsRemaining: number;
  usagePercentage: number;
  canMakeRequest: boolean;
  unitsResetDate?: Date;
}

/**
 * Calculate Cubent Units for a given model
 */
export function calculateCubentUnits(modelId: string): number {
  // Normalize model ID to match our pricing table
  const normalizedModelId = normalizeModelId(modelId);
  return MODEL_PRICING[normalizedModelId] || MODEL_PRICING.default;
}

/**
 * Normalize model ID to match pricing table keys
 */
function normalizeModelId(modelId: string): string {
  const normalized = modelId.toLowerCase()
    .replace(/[_\s]/g, '-')
    .replace(/claude-3\.7-sonnet-\(thinking\)/, 'claude-3.7-sonnet-thinking')
    .replace(/claude-3\.5-sonnet/, 'claude-3.5-sonnet')
    .replace(/claude-3\.5-haiku/, 'claude-3.5-haiku')
    .replace(/claude-3-haiku/, 'claude-3-haiku')
    .replace(/gpt-4o-mini/, 'gpt-4o-mini')
    .replace(/gpt-4\.5-preview/, 'gpt-4.5-preview')
    .replace(/o3-mini-\(high-reasoning\)/, 'o3-mini-high-reasoning')
    .replace(/o3-mini-\(low-reasoning\)/, 'o3-mini-low-reasoning')
    .replace(/gemini-2\.5-flash-\(thinking\)/, 'gemini-2.5-flash-thinking')
    .replace(/gemini-2\.5-flash/, 'gemini-2.5-flash')
    .replace(/gemini-2\.5-pro/, 'gemini-2.5-pro')
    .replace(/gemini-2\.0-flash/, 'gemini-2.0-flash')
    .replace(/gemini-2\.0-pro/, 'gemini-2.0-pro')
    .replace(/gemini-1\.5-flash/, 'gemini-1.5-flash')
    .replace(/gemini-1\.5-pro/, 'gemini-1.5-pro')
    .replace(/grok-3-mini/, 'grok-3-mini')
    .replace(/grok-2-vision/, 'grok-2-vision');

  return normalized;
}

/**
 * Calculate user usage statistics
 */
export function calculateUserUsageStats(
  cubentUnitsUsed: number,
  cubentUnitsLimit: number = 50,
  unitsResetDate?: Date
): UserUsageStats {
  const cubentUnitsRemaining = Math.max(0, cubentUnitsLimit - cubentUnitsUsed);
  const usagePercentage = Math.min(100, (cubentUnitsUsed / cubentUnitsLimit) * 100);
  const canMakeRequest = cubentUnitsRemaining > 0;

  return {
    cubentUnitsUsed,
    cubentUnitsLimit,
    cubentUnitsRemaining,
    usagePercentage,
    canMakeRequest,
    unitsResetDate,
  };
}

/**
 * Check if user can make a request with the given model
 */
export function canUserMakeRequest(
  currentUsage: number,
  modelId: string,
  limit: number = 50
): { canMake: boolean; unitsRequired: number; unitsRemaining: number } {
  const unitsRequired = calculateCubentUnits(modelId);
  const unitsRemaining = Math.max(0, limit - currentUsage);
  const canMake = unitsRemaining >= unitsRequired;

  return {
    canMake,
    unitsRequired,
    unitsRemaining,
  };
}

/**
 * Get usage warning level based on percentage used
 */
export function getUsageWarningLevel(usagePercentage: number): 'none' | 'warning' | 'critical' | 'exceeded' {
  if (usagePercentage >= 100) return 'exceeded';
  if (usagePercentage >= 90) return 'critical';
  if (usagePercentage >= 75) return 'warning';
  return 'none';
}

/**
 * Calculate next reset date (monthly)
 */
export function calculateNextResetDate(lastResetDate?: Date): Date {
  const now = new Date();
  const nextReset = new Date(now);
  
  if (lastResetDate) {
    // Set to next month from last reset
    nextReset.setTime(lastResetDate.getTime());
    nextReset.setMonth(nextReset.getMonth() + 1);
  } else {
    // Set to next month from now
    nextReset.setMonth(nextReset.getMonth() + 1);
    nextReset.setDate(1); // First day of next month
    nextReset.setHours(0, 0, 0, 0);
  }
  
  return nextReset;
}

/**
 * Check if usage should be reset (monthly)
 */
export function shouldResetUsage(lastResetDate?: Date): boolean {
  if (!lastResetDate) return true;
  
  const now = new Date();
  const nextResetDate = calculateNextResetDate(lastResetDate);
  
  return now >= nextResetDate;
}

/**
 * Format Cubent Units for display
 */
export function formatCubentUnits(units: number): string {
  return units.toFixed(2);
}

/**
 * Get model display name
 */
export function getModelDisplayName(modelId: string): string {
  const displayNames: Record<string, string> = {
    'claude-3.7-sonnet': 'Claude 3.7 Sonnet',
    'claude-3.7-sonnet-thinking': 'Claude 3.7 Sonnet (Thinking)',
    'claude-3.5-sonnet': 'Claude 3.5 Sonnet',
    'claude-3.5-haiku': 'Claude 3.5 Haiku',
    'claude-3-haiku': 'Claude 3 Haiku',
    'gpt-4o': 'GPT-4o',
    'gpt-4.5-preview': 'GPT-4.5 Preview',
    'gpt-4o-mini': 'GPT-4o Mini',
    'o3-mini': 'O3 Mini',
    'o3-mini-high-reasoning': 'O3 Mini (High Reasoning)',
    'o3-mini-low-reasoning': 'O3 Mini (Low Reasoning)',
    'deepseek-chat': 'DeepSeek Chat',
    'deepseek-reasoner': 'DeepSeek Reasoner',
    'gemini-2.5-flash': 'Gemini 2.5 Flash',
    'gemini-2.5-flash-thinking': 'Gemini 2.5 Flash (Thinking)',
    'gemini-2.5-pro': 'Gemini 2.5 Pro',
    'gemini-2.0-flash': 'Gemini 2.0 Flash',
    'gemini-2.0-pro': 'Gemini 2.0 Pro',
    'gemini-1.5-flash': 'Gemini 1.5 Flash',
    'gemini-1.5-pro': 'Gemini 1.5 Pro',
    'grok-3': 'Grok 3',
    'grok-3-mini': 'Grok 3 Mini',
    'grok-2-vision': 'Grok 2 Vision',
  };

  return displayNames[normalizeModelId(modelId)] || modelId;
}

// Database service functions
import { database } from '../index';

/**
 * Track token usage for a user
 */
export async function trackTokenUsage(
  userId: string,
  usageData: TokenUsageData
): Promise<void> {
  const { modelId, cubentUnitsUsed, tokensUsed, requestsMade, sessionId, metadata } = usageData;

  // Update user's total usage
  await database.user.update({
    where: { id: userId },
    data: {
      cubentUnitsUsed: {
        increment: cubentUnitsUsed,
      },
      lastActiveAt: new Date(),
    },
  });

  // Create usage metrics record
  await database.usageMetrics.create({
    data: {
      userId,
      tokensUsed: tokensUsed || 0,
      cubentUnitsUsed,
      requestsMade,
      date: new Date(),
    },
  });

  // Create detailed usage analytics
  await database.usageAnalytics.create({
    data: {
      userId,
      modelId,
      tokensUsed: tokensUsed || 0,
      cubentUnitsUsed,
      requestsMade,
      sessionId,
      metadata,
    },
  });
}

/**
 * Get user's current usage stats
 */
export async function getUserUsageStats(userId: string): Promise<UserUsageStats | null> {
  const user = await database.user.findUnique({
    where: { id: userId },
    select: {
      cubentUnitsUsed: true,
      cubentUnitsLimit: true,
      unitsResetDate: true,
    },
  });

  if (!user) return null;

  return calculateUserUsageStats(
    user.cubentUnitsUsed,
    user.cubentUnitsLimit,
    user.unitsResetDate || undefined
  );
}

/**
 * Reset user's monthly usage
 */
export async function resetUserUsage(userId: string): Promise<void> {
  await database.user.update({
    where: { id: userId },
    data: {
      cubentUnitsUsed: 0,
      unitsResetDate: new Date(),
    },
  });
}

/**
 * Get user's usage history
 */
export async function getUserUsageHistory(
  userId: string,
  days: number = 30
): Promise<any[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await database.usageMetrics.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
      },
    },
    orderBy: {
      date: 'desc',
    },
  });
}

/**
 * Get user's model usage breakdown
 */
export async function getUserModelUsage(
  userId: string,
  days: number = 30
) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await database.usageAnalytics.groupBy({
    by: ['modelId'] as const,
    where: {
      userId,
      createdAt: {
        gte: startDate,
      },
    },
    _sum: {
      cubentUnitsUsed: true,
      tokensUsed: true,
      requestsMade: true,
    },
    orderBy: {
      _sum: {
        cubentUnitsUsed: 'desc' as const,
      },
    },
  });
}
