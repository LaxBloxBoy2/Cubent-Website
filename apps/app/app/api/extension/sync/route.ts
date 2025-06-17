import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const syncRequestSchema = z.object({
  action: z.enum(['push', 'pull', 'merge']),
  settings: z.record(z.any()).optional(),
  lastSyncTimestamp: z.string().datetime().optional(),
  conflictResolution: z.enum(['client', 'server', 'merge']).default('merge'),
});

/**
 * Synchronize settings between extension and web app
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
    const validation = syncRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid sync request', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { action, settings, lastSyncTimestamp, conflictResolution } = validation.data;

    // Get user from database
    const dbUser = await database.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        extensionSettings: true,
        preferences: true,
        lastSettingsSync: true,
        updatedAt: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const now = new Date();
    let result: any = {};

    switch (action) {
      case 'pull':
        // Client wants to get latest settings from server
        result = {
          action: 'pull',
          settings: {
            extensionSettings: dbUser.extensionSettings || {},
            preferences: dbUser.preferences || {},
          },
          timestamp: dbUser.lastSettingsSync || dbUser.updatedAt,
          serverTimestamp: now,
        };
        break;

      case 'push':
        // Client wants to push settings to server
        if (!settings) {
          return NextResponse.json(
            { error: 'Settings required for push action' },
            { status: 400 }
          );
        }

        await database.user.update({
          where: { id: dbUser.id },
          data: {
            extensionSettings: settings.extensionSettings || dbUser.extensionSettings,
            preferences: settings.preferences || dbUser.preferences,
            lastSettingsSync: now,
          },
        });

        result = {
          action: 'push',
          success: true,
          timestamp: now,
          message: 'Settings pushed to server successfully',
        };
        break;

      case 'merge':
        // Intelligent merge of client and server settings
        if (!settings) {
          return NextResponse.json(
            { error: 'Settings required for merge action' },
            { status: 400 }
          );
        }

        const serverLastSync = dbUser.lastSettingsSync || dbUser.updatedAt;
        const clientLastSync = lastSyncTimestamp ? new Date(lastSyncTimestamp) : new Date(0);
        
        let mergedSettings: any = {};
        let hasConflicts = false;

        // Check if server has newer changes
        const serverIsNewer = serverLastSync > clientLastSync;
        
        if (serverIsNewer && conflictResolution === 'client') {
          // Client wins - use client settings
          mergedSettings = settings;
        } else if (serverIsNewer && conflictResolution === 'server') {
          // Server wins - use server settings
          mergedSettings = {
            extensionSettings: dbUser.extensionSettings || {},
            preferences: dbUser.preferences || {},
          };
        } else {
          // Merge settings intelligently
          mergedSettings = mergeSettings(
            {
              extensionSettings: dbUser.extensionSettings || {},
              preferences: dbUser.preferences || {},
            },
            settings,
            serverIsNewer
          );
          
          hasConflicts = serverIsNewer;
        }

        // Update database with merged settings
        await database.user.update({
          where: { id: dbUser.id },
          data: {
            extensionSettings: mergedSettings.extensionSettings,
            preferences: mergedSettings.preferences,
            lastSettingsSync: now,
          },
        });

        result = {
          action: 'merge',
          settings: mergedSettings,
          hasConflicts,
          conflictResolution,
          timestamp: now,
          message: hasConflicts 
            ? `Settings merged with conflicts resolved using ${conflictResolution} strategy`
            : 'Settings merged successfully',
        };
        break;
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Settings sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get sync status and metadata
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
      select: {
        lastSettingsSync: true,
        updatedAt: true,
        extensionSettings: true,
        preferences: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const now = new Date();
    const lastSync = dbUser.lastSettingsSync || dbUser.updatedAt;
    const timeSinceSync = now.getTime() - lastSync.getTime();

    // Calculate settings hash for change detection
    const settingsHash = calculateSettingsHash({
      extensionSettings: dbUser.extensionSettings || {},
      preferences: dbUser.preferences || {},
    });

    return NextResponse.json({
      syncStatus: {
        lastSync: lastSync.toISOString(),
        timeSinceSync: Math.round(timeSinceSync / 1000), // seconds
        isStale: timeSinceSync > 5 * 60 * 1000, // 5 minutes
      },
      settings: {
        extensionSettings: dbUser.extensionSettings || {},
        preferences: dbUser.preferences || {},
        hash: settingsHash,
      },
      serverTimestamp: now.toISOString(),
      syncOptions: {
        supportedActions: ['push', 'pull', 'merge'],
        conflictResolutions: ['client', 'server', 'merge'],
        autoSyncInterval: 300, // 5 minutes
      },
    });

  } catch (error) {
    console.error('Sync status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Merge settings intelligently
 */
function mergeSettings(serverSettings: any, clientSettings: any, serverIsNewer: boolean) {
  const merged = {
    extensionSettings: { ...serverSettings.extensionSettings },
    preferences: { ...serverSettings.preferences },
  };

  // Merge extension settings
  if (clientSettings.extensionSettings) {
    Object.keys(clientSettings.extensionSettings).forEach(key => {
      const clientValue = clientSettings.extensionSettings[key];
      const serverValue = merged.extensionSettings[key];

      // If server doesn't have this setting, use client value
      if (serverValue === undefined) {
        merged.extensionSettings[key] = clientValue;
      }
      // If values are different and server is not newer, prefer client
      else if (clientValue !== serverValue && !serverIsNewer) {
        merged.extensionSettings[key] = clientValue;
      }
      // For arrays, merge them
      else if (Array.isArray(clientValue) && Array.isArray(serverValue)) {
        merged.extensionSettings[key] = [...new Set([...serverValue, ...clientValue])];
      }
      // For objects, merge recursively
      else if (typeof clientValue === 'object' && typeof serverValue === 'object' && 
               clientValue !== null && serverValue !== null) {
        merged.extensionSettings[key] = { ...serverValue, ...clientValue };
      }
    });
  }

  // Merge preferences similarly
  if (clientSettings.preferences) {
    Object.keys(clientSettings.preferences).forEach(key => {
      const clientValue = clientSettings.preferences[key];
      const serverValue = merged.preferences[key];

      if (serverValue === undefined) {
        merged.preferences[key] = clientValue;
      } else if (clientValue !== serverValue && !serverIsNewer) {
        merged.preferences[key] = clientValue;
      } else if (Array.isArray(clientValue) && Array.isArray(serverValue)) {
        merged.preferences[key] = [...new Set([...serverValue, ...clientValue])];
      } else if (typeof clientValue === 'object' && typeof serverValue === 'object' && 
                 clientValue !== null && serverValue !== null) {
        merged.preferences[key] = { ...serverValue, ...clientValue };
      }
    });
  }

  return merged;
}

/**
 * Calculate a simple hash of settings for change detection
 */
function calculateSettingsHash(settings: any): string {
  const settingsString = JSON.stringify(settings, Object.keys(settings).sort());
  let hash = 0;
  for (let i = 0; i < settingsString.length; i++) {
    const char = settingsString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}
