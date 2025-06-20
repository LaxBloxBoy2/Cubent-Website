/**
 * Cubent Units Calculator
 * Based on the pricing model from https://cubentdev.mintlify.app/models-and-pricing
 */

export interface ModelPricing {
  name: string
  cubentUnits: number
  provider: 'anthropic' | 'openai' | 'deepseek' | 'google' | 'xai'
  supportsImages: boolean
  isThinking?: boolean
}

export const MODEL_PRICING: Record<string, ModelPricing> = {
  // Anthropic Claude Models
  'claude-3-7-sonnet': {
    name: 'Claude 3.7 Sonnet',
    cubentUnits: 1.1,
    provider: 'anthropic',
    supportsImages: true,
  },
  'claude-3-7-sonnet-thinking': {
    name: 'Claude 3.7 Sonnet (Thinking)',
    cubentUnits: 1.35,
    provider: 'anthropic',
    supportsImages: true,
    isThinking: true,
  },
  'claude-3-5-sonnet': {
    name: 'Claude 3.5 Sonnet',
    cubentUnits: 0.95,
    provider: 'anthropic',
    supportsImages: true,
  },
  'claude-3-5-haiku': {
    name: 'Claude 3.5 Haiku',
    cubentUnits: 0.55,
    provider: 'anthropic',
    supportsImages: false,
  },
  'claude-3-haiku': {
    name: 'Claude 3 Haiku',
    cubentUnits: 0.45,
    provider: 'anthropic',
    supportsImages: false,
  },

  // OpenAI Models
  'gpt-4o': {
    name: 'GPT-4o',
    cubentUnits: 1.1,
    provider: 'openai',
    supportsImages: true,
  },
  'gpt-4-5-preview': {
    name: 'GPT-4.5 Preview',
    cubentUnits: 1.2,
    provider: 'openai',
    supportsImages: true,
  },
  'gpt-4o-mini': {
    name: 'GPT-4o Mini',
    cubentUnits: 0.65,
    provider: 'openai',
    supportsImages: false,
  },
  'o3-mini': {
    name: 'O3 Mini',
    cubentUnits: 1.0,
    provider: 'openai',
    supportsImages: false,
  },
  'o3-mini-high': {
    name: 'O3 Mini (High Reasoning)',
    cubentUnits: 1.1,
    provider: 'openai',
    supportsImages: true,
  },
  'o3-mini-low': {
    name: 'O3 Mini (Low Reasoning)',
    cubentUnits: 0.75,
    provider: 'openai',
    supportsImages: false,
  },

  // DeepSeek Models
  'deepseek-chat': {
    name: 'DeepSeek Chat',
    cubentUnits: 0.35,
    provider: 'deepseek',
    supportsImages: false,
  },
  'deepseek-reasoner': {
    name: 'DeepSeek Reasoner',
    cubentUnits: 0.7,
    provider: 'deepseek',
    supportsImages: false,
  },

  // Google Gemini Models
  'gemini-2-5-flash': {
    name: 'Gemini 2.5 Flash',
    cubentUnits: 0.3,
    provider: 'google',
    supportsImages: true,
  },
  'gemini-2-5-flash-thinking': {
    name: 'Gemini 2.5 Flash (Thinking)',
    cubentUnits: 0.4,
    provider: 'google',
    supportsImages: true,
    isThinking: true,
  },
  'gemini-2-5-pro': {
    name: 'Gemini 2.5 Pro',
    cubentUnits: 0.85,
    provider: 'google',
    supportsImages: true,
  },
  'gemini-2-0-flash': {
    name: 'Gemini 2.0 Flash',
    cubentUnits: 0.45,
    provider: 'google',
    supportsImages: true,
  },
  'gemini-2-0-pro': {
    name: 'Gemini 2.0 Pro',
    cubentUnits: 0.70,
    provider: 'google',
    supportsImages: true,
  },
  'gemini-1-5-flash': {
    name: 'Gemini 1.5 Flash',
    cubentUnits: 0.40,
    provider: 'google',
    supportsImages: true,
  },
  'gemini-1-5-pro': {
    name: 'Gemini 1.5 Pro',
    cubentUnits: 0.65,
    provider: 'google',
    supportsImages: true,
  },

  // xAI Grok Models
  'grok-3': {
    name: 'Grok 3',
    cubentUnits: 1.1,
    provider: 'xai',
    supportsImages: false,
  },
  'grok-3-mini': {
    name: 'Grok 3 Mini',
    cubentUnits: 0.30,
    provider: 'xai',
    supportsImages: false,
  },
  'grok-2-vision': {
    name: 'Grok 2 Vision',
    cubentUnits: 0.70,
    provider: 'xai',
    supportsImages: true,
  },
}

/**
 * Calculate Cubent Units for a given model and token usage
 */
export function calculateCubentUnits(
  modelId: string,
  tokensUsed: number,
  hasImages: boolean = false
): number {
  const model = MODEL_PRICING[modelId]
  
  if (!model) {
    // Default fallback for unknown models
    console.warn(`Unknown model: ${modelId}, using default pricing`)
    return tokensUsed * 0.001 // 1 unit per 1000 tokens as fallback
  }

  // Base calculation: Cubent Units per request
  let units = model.cubentUnits

  // Additional cost for image processing (if model supports it)
  if (hasImages && model.supportsImages) {
    units += 0.1 // Additional 0.1 units for image processing
  }

  return units
}

/**
 * Get model information by ID
 */
export function getModelInfo(modelId: string): ModelPricing | null {
  return MODEL_PRICING[modelId] || null
}

/**
 * Get all available models
 */
export function getAllModels(): ModelPricing[] {
  return Object.values(MODEL_PRICING)
}

/**
 * Get models by provider
 */
export function getModelsByProvider(provider: string): ModelPricing[] {
  return Object.values(MODEL_PRICING).filter(model => model.provider === provider)
}

/**
 * Check if user has enough Cubent Units for a request
 */
export function canMakeRequest(
  currentUnits: number,
  unitsLimit: number,
  modelId: string,
  hasImages: boolean = false
): boolean {
  const requiredUnits = calculateCubentUnits(modelId, 1, hasImages)
  return (currentUnits + requiredUnits) <= unitsLimit
}

/**
 * Calculate usage percentage
 */
export function getUsagePercentage(currentUnits: number, unitsLimit: number): number {
  if (unitsLimit === 0) return 0
  return Math.min((currentUnits / unitsLimit) * 100, 100)
}
