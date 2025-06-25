#!/usr/bin/env node

/**
 * Extension Integration Test Suite
 * Tests all API endpoints and integration flows
 */

const https = require('https');
const { URL } = require('url');

const API_BASE_URL = process.env.API_BASE_URL || 'https://app.cubent.dev';
const TEST_TOKEN = process.env.TEST_TOKEN; // Set this to a valid auth token

// Test configuration
const config = {
  baseUrl: API_BASE_URL,
  token: TEST_TOKEN,
  timeout: 10000,
};

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: [],
};

// Utility functions
function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, config.baseUrl);
    
    const options = {
      method,
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Cubent-Extension-Test/1.0',
        ...headers,
      },
      timeout: config.timeout,
    };

    if (config.token) {
      options.headers['Authorization'] = `Bearer ${config.token}`;
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed,
            raw: body,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: null,
            raw: body,
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

function test(name, testFn) {
  return async () => {
    console.log(`🧪 Testing: ${name}`);
    try {
      await testFn();
      console.log(`✅ PASS: ${name}`);
      results.passed++;
      results.tests.push({ name, status: 'PASS' });
    } catch (error) {
      console.log(`❌ FAIL: ${name} - ${error.message}`);
      results.failed++;
      results.tests.push({ name, status: 'FAIL', error: error.message });
    }
  };
}

function expect(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`Expected ${expected}, got ${actual}. ${message}`);
  }
}

function expectStatus(response, expectedStatus) {
  if (response.status !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus}, got ${response.status}. Response: ${response.raw}`);
  }
}

// Test suites
const authTests = [
  test('Extension sign-in endpoint exists', async () => {
    const response = await makeRequest('GET', '/api/extension/sign-in?state=test&auth_redirect=vscode://cubent.cubent/auth');
    // Should redirect or return auth flow
    expect(response.status >= 200 && response.status < 400, true, 'Should return success or redirect');
  }),

  test('Extension profile endpoint', async () => {
    if (!config.token) {
      throw new Error('TEST_TOKEN required for authenticated tests');
    }
    const response = await makeRequest('GET', '/api/extension/profile');
    expectStatus(response, 200);
    expect(typeof response.data.user, 'object', 'Should return user object');
  }),
];

const usageTests = [
  test('Track usage endpoint', async () => {
    if (!config.token) {
      throw new Error('TEST_TOKEN required for authenticated tests');
    }
    const response = await makeRequest('POST', '/api/extension/usage', {
      modelId: 'test-model',
      tokensUsed: 100,
      requestsMade: 1,
      costAccrued: 0.001,
      sessionId: 'test-session',
      metadata: { test: true },
    });
    expectStatus(response, 200);
    expect(response.data.success, true, 'Should return success');
  }),

  test('Get usage statistics', async () => {
    if (!config.token) {
      throw new Error('TEST_TOKEN required for authenticated tests');
    }
    const response = await makeRequest('GET', '/api/extension/usage?period=7d');
    expectStatus(response, 200);
    expect(typeof response.data.total, 'object', 'Should return usage totals');
  }),

  test('Get usage analytics', async () => {
    if (!config.token) {
      throw new Error('TEST_TOKEN required for authenticated tests');
    }
    const response = await makeRequest('GET', '/api/extension/analytics?period=30d');
    expectStatus(response, 200);
    expect(typeof response.data.totals, 'object', 'Should return analytics data');
  }),
];

const sessionTests = [
  test('Create extension session', async () => {
    if (!config.token) {
      throw new Error('TEST_TOKEN required for authenticated tests');
    }
    const response = await makeRequest('POST', '/api/extension/sessions', {
      sessionId: `test-session-${Date.now()}`,
      extensionVersion: '1.0.0',
      vscodeVersion: '1.80.0',
      platform: 'win32',
      metadata: { test: true },
    });
    expectStatus(response, 200);
    expect(response.data.success, true, 'Should create session successfully');
  }),

  test('Get extension sessions', async () => {
    if (!config.token) {
      throw new Error('TEST_TOKEN required for authenticated tests');
    }
    const response = await makeRequest('GET', '/api/extension/sessions');
    expectStatus(response, 200);
    expect(Array.isArray(response.data.sessions), true, 'Should return sessions array');
  }),
];

const settingsTests = [
  test('Get extension settings', async () => {
    if (!config.token) {
      throw new Error('TEST_TOKEN required for authenticated tests');
    }
    const response = await makeRequest('GET', '/api/extension/settings');
    expectStatus(response, 200);
    expect(typeof response.data.settings, 'object', 'Should return settings object');
  }),

  test('Update extension settings', async () => {
    if (!config.token) {
      throw new Error('TEST_TOKEN required for authenticated tests');
    }
    const response = await makeRequest('POST', '/api/extension/settings', {
      settings: {
        theme: 'dark',
        autoComplete: true,
        testSetting: 'test-value',
      },
    });
    expectStatus(response, 200);
    expect(response.data.success, true, 'Should update settings successfully');
  }),

  test('Settings sync - pull', async () => {
    if (!config.token) {
      throw new Error('TEST_TOKEN required for authenticated tests');
    }
    const response = await makeRequest('POST', '/api/extension/sync', {
      action: 'pull',
    });
    expectStatus(response, 200);
    expect(response.data.action, 'pull', 'Should return pull action');
  }),
];

const statusTests = [
  test('Extension status endpoint', async () => {
    if (!config.token) {
      throw new Error('TEST_TOKEN required for authenticated tests');
    }
    const response = await makeRequest('GET', '/api/extension/status');
    expectStatus(response, 200);
    expect(typeof response.data.status, 'object', 'Should return status object');
  }),

  test('Extension heartbeat', async () => {
    if (!config.token) {
      throw new Error('TEST_TOKEN required for authenticated tests');
    }
    const response = await makeRequest('POST', '/api/extension/status');
    expectStatus(response, 200);
    expect(response.data.success, true, 'Should accept heartbeat');
  }),
];

const subscriptionTests = [
  test('Get subscription info', async () => {
    if (!config.token) {
      throw new Error('TEST_TOKEN required for authenticated tests');
    }
    const response = await makeRequest('GET', '/api/extension/subscription');
    expectStatus(response, 200);
    expect(typeof response.data.subscription, 'object', 'Should return subscription info');
  }),

  test('Check usage limits', async () => {
    if (!config.token) {
      throw new Error('TEST_TOKEN required for authenticated tests');
    }
    const response = await makeRequest('POST', '/api/extension/subscription', {
      tokensRequested: 100,
      estimatedCost: 0.001,
    });
    expectStatus(response, 200);
    expect(typeof response.data.allowed, 'boolean', 'Should return allowed status');
  }),
];

// Main test runner
async function runTests() {
  console.log('🚀 Starting Extension Integration Tests');
  console.log(`📍 API Base URL: ${config.baseUrl}`);
  console.log(`🔑 Auth Token: ${config.token ? 'Provided' : 'Missing (some tests will be skipped)'}`);
  console.log('');

  const allTests = [
    ...authTests,
    ...usageTests,
    ...sessionTests,
    ...settingsTests,
    ...statusTests,
    ...subscriptionTests,
  ];

  for (const testFn of allTests) {
    await testFn();
  }

  console.log('');
  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);

  if (results.failed > 0) {
    console.log('');
    console.log('❌ Failed Tests:');
    results.tests
      .filter(t => t.status === 'FAIL')
      .forEach(t => console.log(`   - ${t.name}: ${t.error}`));
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

// Handle command line arguments
if (process.argv.includes('--help')) {
  console.log(`
Extension Integration Test Suite

Usage:
  node test-extension-integration.js [options]

Environment Variables:
  API_BASE_URL    Base URL for the API (default: https://app.cubent.com)
  TEST_TOKEN      Authentication token for testing authenticated endpoints

Options:
  --help          Show this help message

Examples:
  # Test against production
  API_BASE_URL=https://app.cubent.dev TEST_TOKEN=your_token node test-extension-integration.js
  
  # Test against local development
  API_BASE_URL=http://localhost:3000 TEST_TOKEN=your_token node test-extension-integration.js
`);
  process.exit(0);
}

// Run tests
runTests().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
});
