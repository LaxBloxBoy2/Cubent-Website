import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomBytes } from 'crypto';

const createApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  expiresAt: z.string().datetime().optional(),
  permissions: z.array(z.string()).default(['read', 'write']),
});

/**
 * Create new API key for extension
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = createApiKeySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid API key data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { name, description, expiresAt, permissions } = validation.data;

    // Get user from database
    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user already has too many API keys
    const existingKeys = await database.apiKey.count({
      where: { userId: dbUser.id, isActive: true },
    });

    if (existingKeys >= 10) {
      return NextResponse.json(
        { error: 'Maximum number of API keys reached (10)' },
        { status: 400 }
      );
    }

    // Generate API key
    const keyValue = `cubent_${randomBytes(32).toString('hex')}`;
    const keyHash = await hashApiKey(keyValue);

    // Create API key record
    const apiKey = await database.apiKey.create({
      data: {
        userId: dbUser.id,
        name,
        description,
        keyHash,
        permissions,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: true,
        lastUsedAt: null,
        usageCount: 0,
      },
    });

    return NextResponse.json({
      success: true,
      apiKey: {
        id: apiKey.id,
        name: apiKey.name,
        description: apiKey.description,
        key: keyValue, // Only returned once during creation
        permissions: apiKey.permissions,
        expiresAt: apiKey.expiresAt,
        createdAt: apiKey.createdAt,
      },
      warning: 'This API key will only be shown once. Please save it securely.',
    });

  } catch (error) {
    console.error('API key creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get user's API keys
 */
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get all API keys for the user
    const apiKeys = await database.apiKey.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        permissions: true,
        isActive: true,
        expiresAt: true,
        lastUsedAt: true,
        usageCount: true,
        createdAt: true,
        // keyHash is excluded for security
      },
    });

    const activeKeys = apiKeys.filter(key => key.isActive);
    const expiredKeys = apiKeys.filter(key => 
      key.expiresAt && key.expiresAt < new Date()
    );

    return NextResponse.json({
      apiKeys: apiKeys.map(key => ({
        ...key,
        keyPreview: `cubent_****...****`, // Masked key
        isExpired: key.expiresAt ? key.expiresAt < new Date() : false,
      })),
      summary: {
        totalKeys: apiKeys.length,
        activeKeys: activeKeys.length,
        expiredKeys: expiredKeys.length,
        remainingSlots: Math.max(0, 10 - activeKeys.length),
      },
    });

  } catch (error) {
    console.error('API keys fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update or delete API key
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { keyId, action, name, description, isActive } = body;

    if (!keyId || !action) {
      return NextResponse.json(
        { error: 'Key ID and action required' },
        { status: 400 }
      );
    }

    // Get user from database
    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'update':
        const updateData: any = {};
        if (name) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (typeof isActive === 'boolean') updateData.isActive = isActive;

        const updatedKey = await database.apiKey.update({
          where: {
            id: keyId,
            userId: dbUser.id,
          },
          data: updateData,
          select: {
            id: true,
            name: true,
            description: true,
            permissions: true,
            isActive: true,
            expiresAt: true,
            lastUsedAt: true,
            usageCount: true,
            createdAt: true,
          },
        });

        return NextResponse.json({
          success: true,
          apiKey: updatedKey,
          message: 'API key updated successfully',
        });

      case 'delete':
        await database.apiKey.delete({
          where: {
            id: keyId,
            userId: dbUser.id,
          },
        });

        return NextResponse.json({
          success: true,
          message: 'API key deleted successfully',
        });

      case 'regenerate':
        // Deactivate old key and create new one
        await database.apiKey.update({
          where: {
            id: keyId,
            userId: dbUser.id,
          },
          data: { isActive: false },
        });

        // Get the old key details for regeneration
        const oldKey = await database.apiKey.findUnique({
          where: { id: keyId },
          select: { name: true, description: true, permissions: true, expiresAt: true },
        });

        if (!oldKey) {
          return NextResponse.json(
            { error: 'API key not found' },
            { status: 404 }
          );
        }

        // Generate new API key
        const newKeyValue = `cubent_${randomBytes(32).toString('hex')}`;
        const newKeyHash = await hashApiKey(newKeyValue);

        const newApiKey = await database.apiKey.create({
          data: {
            userId: dbUser.id,
            name: oldKey.name,
            description: oldKey.description,
            keyHash: newKeyHash,
            permissions: oldKey.permissions,
            expiresAt: oldKey.expiresAt,
            isActive: true,
            lastUsedAt: null,
            usageCount: 0,
          },
        });

        return NextResponse.json({
          success: true,
          apiKey: {
            id: newApiKey.id,
            name: newApiKey.name,
            description: newApiKey.description,
            key: newKeyValue, // Only returned once
            permissions: newApiKey.permissions,
            expiresAt: newApiKey.expiresAt,
            createdAt: newApiKey.createdAt,
          },
          warning: 'This new API key will only be shown once. Please save it securely.',
          message: 'API key regenerated successfully',
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: update, delete, or regenerate' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('API key management error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Hash API key for secure storage
 */
async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
