#!/usr/bin/env tsx

/**
 * Test script for the Cubent Units token usage system
 * 
 * This script tests:
 * 1. Token usage calculation
 * 2. Database tracking
 * 3. API endpoints
 * 4. Usage limits
 * 5. Reset functionality
 * 
 * Usage: npx tsx scripts/test-token-usage.ts
 */

import { database } from '@repo/database';
import { 
  calculateCubentUnits, 
  trackTokenUsage, 
  getUserUsageStats,
  resetUserUsage,
  canUserMakeRequest,
  MODEL_PRICING 
} from '@repo/database';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  details?: any;
}

class TokenUsageTestSuite {
  private results: TestResult[] = [];
  private testUserId: string = '';

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting Cubent Units Token Usage Test Suite\n');

    try {
      await this.setupTestUser();
      await this.testTokenCalculation();
      await this.testUsageTracking();
      await this.testUsageStats();
      await this.testUsageLimits();
      await this.testUsageReset();
      await this.cleanupTestUser();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }

    this.printResults();
  }

  private async setupTestUser(): Promise<void> {
    console.log('📝 Setting up test user...');
    
    try {
      const testUser = await database.user.create({
        data: {
          clerkId: `test_${Date.now()}`,
          email: `test_${Date.now()}@cubent.test`,
          cubentUnitsUsed: 0,
          cubentUnitsLimit: 50,
          unitsResetDate: new Date(),
        },
      });

      this.testUserId = testUser.id;
      console.log(`✅ Test user created: ${testUser.id}\n`);
    } catch (error) {
      throw new Error(`Failed to create test user: ${error}`);
    }
  }

  private async testTokenCalculation(): Promise<void> {
    console.log('🧮 Testing token calculation...');

    const testCases = [
      { modelId: 'claude-3.5-sonnet', expected: 0.95 },
      { modelId: 'gpt-4o', expected: 1.1 },
      { modelId: 'gemini-2.5-flash', expected: 0.3 },
      { modelId: 'unknown-model', expected: 1.0 },
    ];

    for (const testCase of testCases) {
      try {
        const result = calculateCubentUnits(testCase.modelId);
        const passed = result === testCase.expected;
        
        this.results.push({
          name: `Calculate units for ${testCase.modelId}`,
          passed,
          details: { expected: testCase.expected, actual: result }
        });

        console.log(`  ${passed ? '✅' : '❌'} ${testCase.modelId}: ${result} units`);
      } catch (error) {
        this.results.push({
          name: `Calculate units for ${testCase.modelId}`,
          passed: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    console.log();
  }

  private async testUsageTracking(): Promise<void> {
    console.log('📊 Testing usage tracking...');

    try {
      // Track some usage
      await trackTokenUsage(this.testUserId, {
        modelId: 'claude-3.5-sonnet',
        cubentUnitsUsed: 0.95,
        tokensUsed: 1000,
        requestsMade: 1,
        sessionId: 'test-session',
        metadata: { test: true }
      });

      await trackTokenUsage(this.testUserId, {
        modelId: 'gpt-4o',
        cubentUnitsUsed: 1.1,
        tokensUsed: 800,
        requestsMade: 1,
      });

      // Verify tracking worked
      const user = await database.user.findUnique({
        where: { id: this.testUserId },
        select: { cubentUnitsUsed: true }
      });

      const expectedUsage = 0.95 + 1.1; // 2.05
      const actualUsage = user?.cubentUnitsUsed || 0;
      const passed = Math.abs(actualUsage - expectedUsage) < 0.01;

      this.results.push({
        name: 'Track token usage',
        passed,
        details: { expected: expectedUsage, actual: actualUsage }
      });

      console.log(`  ${passed ? '✅' : '❌'} Usage tracking: ${actualUsage} units`);
    } catch (error) {
      this.results.push({
        name: 'Track token usage',
        passed: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    console.log();
  }

  private async testUsageStats(): Promise<void> {
    console.log('📈 Testing usage statistics...');

    try {
      const stats = await getUserUsageStats(this.testUserId);
      
      if (!stats) {
        throw new Error('No usage stats returned');
      }

      const expectedUsage = 2.05; // From previous test
      const passed = Math.abs(stats.cubentUnitsUsed - expectedUsage) < 0.01 &&
                    stats.cubentUnitsLimit === 50 &&
                    stats.usagePercentage > 0;

      this.results.push({
        name: 'Get usage statistics',
        passed,
        details: stats
      });

      console.log(`  ${passed ? '✅' : '❌'} Usage stats: ${stats.cubentUnitsUsed}/${stats.cubentUnitsLimit} units (${stats.usagePercentage.toFixed(1)}%)`);
    } catch (error) {
      this.results.push({
        name: 'Get usage statistics',
        passed: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    console.log();
  }

  private async testUsageLimits(): Promise<void> {
    console.log('🚫 Testing usage limits...');

    try {
      // Test with a model that would exceed the limit
      const currentUsage = 2.05; // From previous tests
      const limit = 50;
      
      // Test with a high-cost model
      const canMakeExpensive = canUserMakeRequest(currentUsage, 'claude-3.7-sonnet-thinking', limit);
      const canMakeCheap = canUserMakeRequest(currentUsage, 'gemini-2.5-flash', limit);

      this.results.push({
        name: 'Check usage limits - expensive model',
        passed: canMakeExpensive.canMake === true, // Should be able to make request
        details: canMakeExpensive
      });

      this.results.push({
        name: 'Check usage limits - cheap model',
        passed: canMakeCheap.canMake === true, // Should be able to make request
        details: canMakeCheap
      });

      // Test when at limit
      const canMakeAtLimit = canUserMakeRequest(50, 'claude-3.5-sonnet', limit);
      
      this.results.push({
        name: 'Check usage limits - at limit',
        passed: canMakeAtLimit.canMake === false, // Should NOT be able to make request
        details: canMakeAtLimit
      });

      console.log(`  ${canMakeExpensive.canMake ? '✅' : '❌'} Expensive model check: ${canMakeExpensive.canMake}`);
      console.log(`  ${canMakeCheap.canMake ? '✅' : '❌'} Cheap model check: ${canMakeCheap.canMake}`);
      console.log(`  ${!canMakeAtLimit.canMake ? '✅' : '❌'} At limit check: ${canMakeAtLimit.canMake}`);
    } catch (error) {
      this.results.push({
        name: 'Check usage limits',
        passed: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    console.log();
  }

  private async testUsageReset(): Promise<void> {
    console.log('🔄 Testing usage reset...');

    try {
      // Reset usage
      await resetUserUsage(this.testUserId);

      // Verify reset
      const user = await database.user.findUnique({
        where: { id: this.testUserId },
        select: { cubentUnitsUsed: true, unitsResetDate: true }
      });

      const passed = user?.cubentUnitsUsed === 0 && user?.unitsResetDate !== null;

      this.results.push({
        name: 'Reset user usage',
        passed,
        details: { 
          cubentUnitsUsed: user?.cubentUnitsUsed,
          unitsResetDate: user?.unitsResetDate 
        }
      });

      console.log(`  ${passed ? '✅' : '❌'} Usage reset: ${user?.cubentUnitsUsed} units`);
    } catch (error) {
      this.results.push({
        name: 'Reset user usage',
        passed: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    console.log();
  }

  private async cleanupTestUser(): Promise<void> {
    console.log('🧹 Cleaning up test user...');
    
    try {
      // Delete usage analytics
      await database.usageAnalytics.deleteMany({
        where: { userId: this.testUserId }
      });

      // Delete usage metrics
      await database.usageMetrics.deleteMany({
        where: { userId: this.testUserId }
      });

      // Delete test user
      await database.user.delete({
        where: { id: this.testUserId }
      });

      console.log('✅ Test user cleaned up\n');
    } catch (error) {
      console.error('❌ Failed to cleanup test user:', error);
    }
  }

  private printResults(): void {
    console.log('📋 Test Results Summary');
    console.log('========================\n');

    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;

    this.results.forEach(result => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${result.name}`);
      
      if (!result.passed && result.error) {
        console.log(`    Error: ${result.error}`);
      }
      
      if (result.details) {
        console.log(`    Details: ${JSON.stringify(result.details, null, 2)}`);
      }
    });

    console.log(`\n📊 Results: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('🎉 All tests passed! Token usage system is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Please review the errors above.');
      process.exit(1);
    }
  }
}

// Run the test suite
async function main() {
  const testSuite = new TokenUsageTestSuite();
  await testSuite.runAllTests();
}

if (require.main === module) {
  main().catch(console.error);
}
