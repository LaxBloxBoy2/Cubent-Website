# Cubent VS Code Extension Integration Guide

This document explains the complete user profile system that integrates with your Cubent VS Code extension.

## 🎯 Overview

The website now provides a comprehensive user profile system that seamlessly integrates with your VS Code extension, enabling:

- **User Authentication & Profile Management**
- **Extension Connection & Session Management**
- **Settings Synchronization**
- **Usage Analytics & Reporting**
- **Terms Acceptance Flow**

## 📊 Database Schema

### User Model
```prisma
model User {
  id          String   @id @default(cuid())
  clerkId     String   @unique
  email       String   @unique
  name        String?
  picture     String?
  
  // Extension connection
  extensionApiKey String?
  lastExtensionSync DateTime?
  termsAccepted Boolean @default(false)
  termsAcceptedAt DateTime?
  
  // Subscription (sync with extension)
  subscriptionTier    String @default("FREE_TRIAL")
  subscriptionStatus  String @default("TRIAL")
  
  // Settings sync
  extensionSettings   Json?
  preferences         Json?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Extension Session Management
```prisma
model ExtensionSession {
  id        String   @id @default(cuid())
  userId    String
  sessionId String   @unique
  isActive  Boolean  @default(true)
  lastSeen  DateTime @default(now())
  createdAt DateTime @default(now())
}
```

### Usage Analytics
```prisma
model UsageMetrics {
  id     String @id @default(cuid())
  userId String
  tokensUsed    Int @default(0)
  requestsMade  Int @default(0)
  costAccrued   Float @default(0)
  date DateTime @default(now())
}
```

## 🔌 API Endpoints

### Extension Authentication
- **POST** `/api/extension/auth` - Validate extension connection
- **GET** `/api/extension/auth` - Check connection status

### Settings Synchronization
- **GET** `/api/extension/settings` - Retrieve user settings
- **POST** `/api/extension/settings` - Update settings from extension

### Usage Tracking
- **POST** `/api/extension/usage` - Submit usage metrics
- **GET** `/api/extension/usage` - Retrieve usage analytics

### Connection Management
- **POST** `/api/extension/connect` - Establish extension connection
- **DELETE** `/api/extension/connect` - Disconnect extension

### Terms Acceptance
- **POST** `/api/terms/accept` - Accept terms of service

## 🖥️ User Interface Pages

### Main Profile (`/profile`)
- User account information
- Extension connection status
- Quick usage statistics
- Navigation to detailed sections

### Extension Management (`/profile/extension`)
- Connection status and controls
- API key management
- Active session monitoring
- Connection instructions

### Usage Analytics (`/profile/usage`)
- Detailed usage charts and graphs
- Historical data tables
- Export functionality
- Cost tracking

### Settings (`/profile/settings`)
- Extension behavior configuration
- AI model preferences
- Sync preferences
- Account management

### Terms Acceptance (`/terms`)
- Complete terms of service
- Acceptance flow with automatic extension connection

## 🔄 Integration Flow

### 1. User Registration/Login
```
User signs up/logs in → Clerk authentication → User record created in database
```

### 2. Terms Acceptance
```
User visits /terms → Accepts terms → Terms marked as accepted → VS Code opens automatically
```

### 3. Extension Connection
```
Extension detects website login → Calls /api/extension/auth → Establishes session → Syncs settings
```

### 4. Ongoing Synchronization
```
Extension ↔ Website bidirectional sync of:
- User settings and preferences
- Usage metrics and analytics
- Session status and health
```

## 🛠️ Extension Implementation Requirements

### Authentication Flow
Your VS Code extension should:

1. **Check for website authentication** on startup
2. **Call `/api/extension/auth`** with session ID and version
3. **Handle terms acceptance redirect** if required
4. **Store API key** for subsequent requests

### Settings Sync
```typescript
// Get settings from website
const response = await fetch('/api/extension/settings');
const { extensionSettings, preferences } = await response.json();

// Update settings on website
await fetch('/api/extension/settings', {
  method: 'POST',
  body: JSON.stringify({ extensionSettings, preferences })
});
```

### Usage Reporting
```typescript
// Report usage metrics
await fetch('/api/extension/usage', {
  method: 'POST',
  body: JSON.stringify({
    tokensUsed: 1500,
    requestsMade: 10,
    costAccrued: 0.05
  })
});
```

### Auto-Connection
Handle the `vscode://cubent.cubent/connect` URL scheme to automatically connect when triggered from the website.

## 🔐 Security Features

- **API Key Authentication** for extension requests
- **Session Management** with automatic cleanup
- **CORS Protection** for API endpoints
- **Input Validation** with Zod schemas
- **Rate Limiting** (can be added)

## 📈 Analytics & Monitoring

The system tracks:
- **Token usage** per day/month
- **Request frequency** and patterns
- **Cost accumulation** over time
- **Session activity** and health
- **Feature usage** statistics

## 🚀 Deployment Notes

1. **Environment Variables**: Ensure all Clerk variables are set in Vercel
2. **Database Migration**: Run `npx prisma migrate deploy` in production
3. **API Keys**: Generate secure API keys for extension communication
4. **CORS Configuration**: Configure allowed origins for extension requests

## 🔧 Development Setup

1. **Database**: Migration already applied locally
2. **Environment**: Copy variables from `vercel-env-setup.md`
3. **Testing**: Use `/profile` to test the interface
4. **Extension**: Implement the API calls in your VS Code extension

## 📝 Next Steps

1. **Implement extension-side API calls** using the provided endpoints
2. **Test the complete flow** from terms acceptance to usage tracking
3. **Add error handling** and retry logic in the extension
4. **Implement real-time sync** for immediate settings updates
5. **Add subscription management** integration

The system is now ready for your VS Code extension to integrate with! 🎉
