# VS Code Extension Integration Guide

This document provides a comprehensive guide for integrating the Cubent VS Code extension with the web application.

## 🚀 Overview

The integration provides seamless authentication, usage tracking, settings synchronization, and user management between the VS Code extension and the web app.

## 📋 API Endpoints

### Authentication
- `GET /api/extension/sign-in` - Extension authentication flow
- `GET /api/extension/profile` - User profile and extension status
- `PATCH /api/extension/profile` - Update user profile

### Session Management
- `POST /api/extension/sessions` - Create/update extension session
- `GET /api/extension/sessions` - Get user sessions
- `PATCH /api/extension/sessions` - Update session
- `DELETE /api/extension/sessions` - Terminate sessions

### Usage Tracking
- `POST /api/extension/usage` - Track usage metrics
- `GET /api/extension/usage` - Get usage statistics
- `GET /api/extension/analytics` - Comprehensive analytics
- `GET /api/extension/export` - Export usage data

### Settings Sync
- `GET /api/extension/settings` - Get user settings
- `POST /api/extension/settings` - Update settings
- `POST /api/extension/sync` - Bidirectional sync
- `GET /api/extension/sync` - Sync status

### Subscription & Limits
- `GET /api/extension/subscription` - Subscription info
- `POST /api/extension/subscription` - Check usage limits
- `GET /api/extension/status` - Extension health status
- `POST /api/extension/status` - Heartbeat

### API Keys
- `POST /api/extension/api-keys` - Create API key
- `GET /api/extension/api-keys` - List API keys
- `PATCH /api/extension/api-keys` - Manage API keys

## 🔧 Extension Configuration

Update your extension's configuration to point to the web app:

```typescript
// In your extension's Config.ts
export const Config = {
  API_BASE_URL: process.env.ROO_CODE_API_URL || 'https://app.cubent.com',
  AUTH_ENDPOINTS: {
    SIGN_IN: '/api/extension/sign-in',
    PROFILE: '/api/extension/profile',
    STATUS: '/api/extension/status',
  },
  USAGE_ENDPOINTS: {
    TRACK: '/api/extension/usage',
    ANALYTICS: '/api/extension/analytics',
    EXPORT: '/api/extension/export',
  },
  SYNC_ENDPOINTS: {
    SETTINGS: '/api/extension/settings',
    SYNC: '/api/extension/sync',
  },
  SESSION_ENDPOINTS: {
    MANAGE: '/api/extension/sessions',
    HEARTBEAT: '/api/extension/status',
  },
};
```

## 🔐 Authentication Flow

### 1. Extension Sign-In
```typescript
// Extension initiates sign-in
const authUrl = `${API_BASE_URL}/api/extension/sign-in?state=${state}&auth_redirect=${redirectUrl}`;
vscode.env.openExternal(vscode.Uri.parse(authUrl));
```

### 2. Web App Handles Auth
- User signs in via Clerk
- Web app creates sign-in token
- Redirects back to extension with token

### 3. Extension Receives Token
```typescript
// Extension receives and validates token
const token = await validateSignInToken(receivedToken);
await storeAuthToken(token);
```

## 📊 Usage Tracking

### Track Extension Usage
```typescript
// Track usage in extension
await fetch(`${API_BASE_URL}/api/extension/usage`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    modelId: 'gpt-4',
    tokensUsed: 150,
    requestsMade: 1,
    costAccrued: 0.003,
    sessionId: currentSessionId,
    metadata: {
      feature: 'code-completion',
      language: 'typescript',
    },
  }),
});
```

### Get Usage Analytics
```typescript
// Get usage statistics
const response = await fetch(`${API_BASE_URL}/api/extension/analytics?period=30d`);
const analytics = await response.json();
```

## ⚙️ Settings Synchronization

### Sync Settings
```typescript
// Push settings to server
await fetch(`${API_BASE_URL}/api/extension/sync`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    action: 'push',
    settings: {
      extensionSettings: userSettings,
      preferences: userPreferences,
    },
  }),
});

// Pull settings from server
const response = await fetch(`${API_BASE_URL}/api/extension/sync`, {
  method: 'POST',
  body: JSON.stringify({ action: 'pull' }),
});
const { settings } = await response.json();
```

## 🔄 Session Management

### Create Session
```typescript
// Create extension session
await fetch(`${API_BASE_URL}/api/extension/sessions`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    sessionId: generateSessionId(),
    extensionVersion: '1.0.0',
    vscodeVersion: vscode.version,
    platform: process.platform,
    metadata: {
      workspace: workspaceName,
      language: activeLanguage,
    },
  }),
});
```

### Send Heartbeat
```typescript
// Send periodic heartbeat
setInterval(async () => {
  await fetch(`${API_BASE_URL}/api/extension/status`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
}, 60000); // Every minute
```

## 🧪 Testing the Integration

### 1. Test Authentication
- [ ] Extension can initiate sign-in flow
- [ ] Web app redirects to extension with token
- [ ] Extension can validate and store token
- [ ] Subsequent API calls use valid authentication

### 2. Test Usage Tracking
- [ ] Extension can track usage metrics
- [ ] Web app receives and stores usage data
- [ ] Analytics endpoint returns correct data
- [ ] Export functionality works

### 3. Test Settings Sync
- [ ] Extension can push settings to server
- [ ] Extension can pull settings from server
- [ ] Conflict resolution works correctly
- [ ] Bidirectional sync maintains consistency

### 4. Test Session Management
- [ ] Extension can create sessions
- [ ] Session updates work correctly
- [ ] Heartbeat maintains session status
- [ ] Session termination works

### 5. Test Web App Integration
- [ ] Profile page shows extension status
- [ ] Usage analytics display correctly
- [ ] Settings management works
- [ ] Real-time status updates function

## 🔍 Debugging

### Enable Debug Logging
```typescript
// In extension
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('API Request:', { url, method, body });
  console.log('API Response:', response);
}
```

### Check API Responses
```bash
# Test endpoints manually
curl -X GET "https://app.cubent.com/api/extension/status" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Monitor Network Traffic
- Use VS Code's Developer Tools
- Check Network tab for API calls
- Verify request/response payloads

## 🚨 Error Handling

### Common Issues
1. **Authentication Failures**
   - Check token validity
   - Verify API endpoint URLs
   - Ensure proper headers

2. **Usage Tracking Issues**
   - Validate request payload
   - Check subscription limits
   - Verify session exists

3. **Settings Sync Problems**
   - Check conflict resolution
   - Verify settings format
   - Ensure proper timestamps

## 📈 Performance Optimization

### Batch Requests
```typescript
// Batch multiple usage events
const usageEvents = collectUsageEvents();
await fetch(`${API_BASE_URL}/api/extension/usage/batch`, {
  method: 'POST',
  body: JSON.stringify({ events: usageEvents }),
});
```

### Cache Settings
```typescript
// Cache settings locally
const cachedSettings = await getFromCache('settings');
if (!cachedSettings || isStale(cachedSettings)) {
  const fresh = await fetchSettings();
  await saveToCache('settings', fresh);
}
```

## 🔒 Security Considerations

1. **Token Storage**: Store tokens securely in VS Code's secret storage
2. **API Keys**: Use environment variables for sensitive keys
3. **HTTPS**: Always use HTTPS for API communication
4. **Validation**: Validate all API responses
5. **Rate Limiting**: Respect API rate limits

## 📝 Next Steps

1. Update extension configuration
2. Implement authentication flow
3. Add usage tracking
4. Set up settings sync
5. Test complete integration
6. Deploy and monitor

For support, contact the development team or check the API documentation.
