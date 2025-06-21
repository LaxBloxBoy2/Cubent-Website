# Cubent Units Token Usage System - Testing Guide

This guide provides comprehensive testing instructions for the Cubent Units token usage system.

## Overview

The token usage system tracks Cubent Units consumed by users when they send messages to AI models. Each model has a different cost per message based on the pricing table.

## Automated Testing

### Run the Test Suite

```bash
cd Cubentweb/cubent
npx tsx scripts/test-token-usage.ts
```

This will test:
- ✅ Token calculation for different models
- ✅ Usage tracking in database
- ✅ Usage statistics retrieval
- ✅ Usage limit enforcement
- ✅ Usage reset functionality

## Manual Testing

### 1. Extension Testing

#### Test Token Usage Tracking
1. Open VS Code with the Cubent extension
2. Ensure you're logged in to your account
3. Send a message to an AI model
4. Check the extension's account view for updated usage
5. Verify the usage is displayed correctly

#### Test Usage Limits
1. Use the admin reset endpoint to set your usage near the limit
2. Try to send a message that would exceed the limit
3. Verify you get a limit exceeded error
4. Verify the upgrade prompt appears

#### Test Settings Display
1. Open the extension settings/account view
2. Verify Cubent Units usage is displayed
3. Check that the progress bar shows correct percentage
4. Verify remaining units are calculated correctly

### 2. Webapp Testing

#### Test Usage Dashboard
1. Go to `/profile/usage` in the webapp
2. Verify Cubent Units are displayed in the summary
3. Check the usage status card shows correct information
4. Verify model breakdown shows Cubent Units per model

#### Test API Endpoints

**Track Usage:**
```bash
curl -X POST http://localhost:3000/api/extension/units/track \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "modelId": "claude-3.5-sonnet",
    "tokensUsed": 1000,
    "requestsMade": 1
  }'
```

**Get Usage Stats:**
```bash
curl -X GET http://localhost:3000/api/extension/units/usage \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Check if can make request:**
```bash
curl -X GET "http://localhost:3000/api/extension/units/track?modelId=claude-3.5-sonnet" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Database Testing

#### Verify Database Schema
```sql
-- Check user table has Cubent Units fields
SELECT cubentUnitsUsed, cubentUnitsLimit, unitsResetDate 
FROM User 
WHERE clerkId = 'your_clerk_id';

-- Check usage metrics tracking
SELECT * FROM UsageMetrics 
WHERE userId = 'your_user_id' 
ORDER BY date DESC 
LIMIT 10;

-- Check usage analytics
SELECT * FROM UsageAnalytics 
WHERE userId = 'your_user_id' 
ORDER BY createdAt DESC 
LIMIT 10;
```

### 4. Reset Functionality Testing

#### Test Manual Reset (Admin)
```bash
curl -X POST http://localhost:3000/api/admin/reset-usage \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resetType": "specific",
    "userIds": ["user_id_to_reset"]
  }'
```

#### Test Cron Reset
```bash
curl -X POST http://localhost:3000/api/cron/reset-usage \
  -H "Authorization: Bearer CRON_SECRET"
```

## Test Scenarios

### Scenario 1: New User Journey
1. Create a new user account
2. Verify they start with 0/50 Cubent Units
3. Send a message using Claude 3.5 Sonnet (0.95 units)
4. Verify usage updates to 0.95/50 units
5. Check webapp shows correct usage

### Scenario 2: Approaching Limit
1. Set user usage to 48 units (via admin endpoint)
2. Try to send message with expensive model (1.35 units)
3. Verify request is blocked
4. Try with cheap model (0.3 units)
5. Verify request succeeds

### Scenario 3: Monthly Reset
1. Set user's unitsResetDate to 2 months ago
2. Run the reset cron job
3. Verify usage resets to 0
4. Verify unitsResetDate updates

### Scenario 4: Model Pricing
Test each model type:
- Claude models: 3.7 Sonnet (1.1), 3.5 Sonnet (0.95), 3.5 Haiku (0.55)
- OpenAI models: GPT-4o (1.1), GPT-4o Mini (0.65)
- Gemini models: 2.5 Flash (0.3), 2.5 Pro (0.85)
- Unknown models: Should default to 1.0 units

## Expected Results

### Extension
- ✅ Usage tracking works automatically
- ✅ Account view shows current usage
- ✅ Limit enforcement prevents over-usage
- ✅ Error messages are user-friendly

### Webapp
- ✅ Usage dashboard shows detailed analytics
- ✅ Model breakdown displays correctly
- ✅ Charts and progress bars work
- ✅ Historical data is accurate

### Database
- ✅ All usage is recorded accurately
- ✅ Analytics data is detailed
- ✅ Reset functionality works
- ✅ Data integrity is maintained

## Troubleshooting

### Common Issues

1. **Usage not tracking**
   - Check if user is authenticated
   - Verify TokenUsageService is initialized
   - Check API endpoint responses

2. **Incorrect calculations**
   - Verify model ID normalization
   - Check MODEL_PRICING table
   - Ensure proper rounding

3. **Limits not enforced**
   - Check canMakeRequest logic
   - Verify usage calculation
   - Ensure error handling works

4. **Reset not working**
   - Check shouldResetUsage logic
   - Verify date calculations
   - Ensure database updates

### Debug Commands

```bash
# Check user's current usage
npx prisma studio

# View logs
tail -f logs/app.log

# Test specific model pricing
node -e "console.log(require('./packages/database/src/token-usage').calculateCubentUnits('claude-3.5-sonnet'))"
```

## Performance Testing

### Load Testing
1. Create multiple test users
2. Simulate concurrent usage tracking
3. Verify database performance
4. Check API response times

### Stress Testing
1. Test with high usage volumes
2. Verify reset performance with many users
3. Check webapp performance with large datasets

## Security Testing

1. Test API endpoints without authentication
2. Verify admin endpoints require proper permissions
3. Test cron endpoints with invalid secrets
4. Check for SQL injection vulnerabilities

## Monitoring

Set up monitoring for:
- Usage tracking errors
- API endpoint performance
- Database query performance
- Reset job success/failure
- User limit violations

## Conclusion

This testing guide ensures the Cubent Units token usage system works correctly across all components. Run these tests regularly, especially after any changes to the usage tracking logic.
