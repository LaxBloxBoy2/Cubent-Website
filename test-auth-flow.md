# Authentication Flow Test Guide

## 🔍 Testing the Fixed Authentication Flow

### **Device OAuth Flow (Primary - "Connect to Cubent Cloud")**

1. **Extension Action**: Click "Connect to Cubent Cloud" button
2. **Expected URL**: `https://app-cubent.vercel.app/sign-in?device_id=abc123&state=xyz789`
3. **Web App Behavior**: 
   - Detects `device_id` and `state` parameters
   - Redirects to `/login?device_id=abc123&state=xyz789`
4. **If Not Authenticated**: 
   - Redirects to `/sign-in?redirect_url=/login?device_id=abc123&state=xyz789`
   - After login, redirects to `/auth-success?redirect_url=/login?device_id=abc123&state=xyz789`
   - Finally redirects to `/login?device_id=abc123&state=xyz789`
5. **Login Page**: Shows terms acceptance and generates token
6. **Success**: Redirects to `vscode://cubent.cubent/auth/callback?token=...&state=...`

### **Legacy Flow ("Sign In (Legacy)")**

1. **Extension Action**: Click "Sign In (Legacy)" button  
2. **Expected URL**: `https://app-cubent.vercel.app/api/extension/sign-in?state=xyz&auth_redirect=vscode://...`
3. **Web App Behavior**:
   - If authenticated: Creates ticket and redirects to extension
   - If not authenticated: Redirects to sign-in with proper redirect_url
4. **After Login**: Redirects back to `/api/extension/sign-in` and completes flow

## 🧪 Test Cases

### **Test 1: Device OAuth - New User**
- [ ] Click "Connect to Cubent Cloud"
- [ ] Browser opens to sign-in page
- [ ] Sign up/in with Clerk
- [ ] Redirected to login page with device parameters
- [ ] Accept terms
- [ ] Redirected back to VS Code with success

### **Test 2: Device OAuth - Existing Authenticated User**
- [ ] Already signed in to web app
- [ ] Click "Connect to Cubent Cloud"  
- [ ] Browser opens directly to login page (skips sign-in)
- [ ] Accept terms (if needed)
- [ ] Redirected back to VS Code with success

### **Test 3: Legacy Flow - New User**
- [ ] Click "Sign In (Legacy)"
- [ ] Browser opens to sign-in page
- [ ] Sign up/in with Clerk
- [ ] Redirected back to extension with token

### **Test 4: Legacy Flow - Existing Authenticated User**
- [ ] Already signed in to web app
- [ ] Click "Sign In (Legacy)"
- [ ] Immediately redirected back to extension with token

## 🔧 Debugging

### **Check Browser Network Tab**
1. Open browser dev tools
2. Go to Network tab
3. Click authentication button
4. Follow the redirect chain
5. Verify parameters are preserved

### **Check Extension Logs**
1. Open VS Code Developer Tools
2. Look for `[DeviceOAuth]` or `[auth]` logs
3. Check for authentication success/failure messages

### **Check Web App Logs**
1. Check server logs for authentication endpoints
2. Look for token generation and validation
3. Verify database user creation/updates

## 🚨 Common Issues

### **Issue 1: Parameters Lost in Redirect**
- **Symptom**: "Invalid Request" error on login page
- **Cause**: `device_id` or `state` parameters not preserved
- **Fix**: Check URL encoding and redirect logic

### **Issue 2: Infinite Redirect Loop**
- **Symptom**: Browser keeps redirecting between pages
- **Cause**: Clerk configuration or middleware issues
- **Fix**: Check `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` setting

### **Issue 3: Extension Not Receiving Token**
- **Symptom**: Extension shows "Authentication failed"
- **Cause**: VS Code URI scheme not working or token not generated
- **Fix**: Check token generation and VS Code callback handling

## ✅ Success Indicators

- [ ] Extension shows user as authenticated
- [ ] User info appears in extension UI
- [ ] Web app shows active extension session
- [ ] No error messages in console
- [ ] Polling stops after successful authentication
