import { auth } from '@repo/auth/server';
import { database } from '@repo/database';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Export extension usage data
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const period = searchParams.get('period') || '30d';
    const includeMetadata = searchParams.get('includeMetadata') === 'true';

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

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get usage metrics
    const usageMetrics = await database.usageMetrics.findMany({
      where: {
        userId: dbUser.id,
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    // Get extension sessions if metadata is requested
    let extensionSessions = [];
    if (includeMetadata) {
      extensionSessions = await database.extensionSession.findMany({
        where: {
          userId: dbUser.id,
          createdAt: {
            gte: startDate,
          },
        },
        orderBy: { createdAt: 'asc' },
      });
    }

    // Prepare export data
    const exportData = {
      exportInfo: {
        userId,
        exportDate: now.toISOString(),
        period,
        dateRange: {
          start: startDate.toISOString(),
          end: now.toISOString(),
        },
        totalRecords: usageMetrics.length,
        format,
      },
      usageMetrics: usageMetrics.map(metric => ({
        date: metric.date.toISOString(),
        tokensUsed: metric.tokensUsed,
        requestsMade: metric.requestsMade,
        costAccrued: metric.costAccrued,
        createdAt: metric.createdAt.toISOString(),
      })),
      summary: {
        totalTokensUsed: usageMetrics.reduce((sum, m) => sum + m.tokensUsed, 0),
        totalRequestsMade: usageMetrics.reduce((sum, m) => sum + m.requestsMade, 0),
        totalCostAccrued: usageMetrics.reduce((sum, m) => sum + m.costAccrued, 0),
        averageDailyTokens: usageMetrics.length > 0 
          ? Math.round(usageMetrics.reduce((sum, m) => sum + m.tokensUsed, 0) / usageMetrics.length)
          : 0,
        averageDailyRequests: usageMetrics.length > 0
          ? Math.round(usageMetrics.reduce((sum, m) => sum + m.requestsMade, 0) / usageMetrics.length)
          : 0,
      },
      ...(includeMetadata && {
        extensionSessions: extensionSessions.map(session => ({
          sessionId: session.sessionId,
          extensionVersion: session.extensionVersion,
          vscodeVersion: session.vscodeVersion,
          platform: session.platform,
          isActive: session.isActive,
          tokensUsed: session.tokensUsed,
          requestsMade: session.requestsMade,
          createdAt: session.createdAt.toISOString(),
          lastActiveAt: session.lastActiveAt?.toISOString(),
          metadata: session.metadata,
        })),
      }),
    };

    // Handle different export formats
    if (format === 'csv') {
      const csv = convertToCSV(exportData.usageMetrics);
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="cubent-usage-${period}-${now.toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    if (format === 'xlsx') {
      // For now, return JSON with a note about Excel format
      return NextResponse.json({
        ...exportData,
        note: 'Excel format not yet implemented. Use CSV format for spreadsheet compatibility.',
      });
    }

    // Default to JSON
    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': `attachment; filename="cubent-usage-${period}-${now.toISOString().split('T')[0]}.json"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Convert usage data to CSV format
 */
function convertToCSV(usageMetrics: any[]): string {
  if (usageMetrics.length === 0) {
    return 'Date,Tokens Used,Requests Made,Cost Accrued,Created At\n';
  }

  const headers = 'Date,Tokens Used,Requests Made,Cost Accrued,Created At\n';
  
  const rows = usageMetrics.map(metric => 
    `${metric.date},${metric.tokensUsed},${metric.requestsMade},${metric.costAccrued},${metric.createdAt}`
  ).join('\n');

  return headers + rows;
}

/**
 * Get export statistics
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

    // Get total records available for export
    const totalUsageRecords = await database.usageMetrics.count({
      where: { userId: dbUser.id },
    });

    const totalSessionRecords = await database.extensionSession.count({
      where: { userId: dbUser.id },
    });

    // Get date range of available data
    const oldestRecord = await database.usageMetrics.findFirst({
      where: { userId: dbUser.id },
      orderBy: { date: 'asc' },
      select: { date: true },
    });

    const newestRecord = await database.usageMetrics.findFirst({
      where: { userId: dbUser.id },
      orderBy: { date: 'desc' },
      select: { date: true },
    });

    return NextResponse.json({
      availableData: {
        totalUsageRecords,
        totalSessionRecords,
        dateRange: {
          oldest: oldestRecord?.date || null,
          newest: newestRecord?.date || null,
        },
      },
      exportOptions: {
        formats: ['json', 'csv'],
        periods: ['7d', '30d', '90d', '1y', 'all'],
        includeMetadata: true,
      },
      estimatedSizes: {
        json: `${Math.round(totalUsageRecords * 0.2)}KB`,
        csv: `${Math.round(totalUsageRecords * 0.1)}KB`,
      },
    });

  } catch (error) {
    console.error('Export info error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
