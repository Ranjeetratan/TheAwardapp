# Email Troubleshooting Guide - Profile Live Notifications

## Issue
Emails are not being sent when profiles go live (either through auto-approval or manual approval).

## How Email System Works

### **Auto-Approval Flow** (ProfileForm)
1. User submits profile
2. If auto-approval is ON → profile is approved immediately
3. Email is sent automatically via `sendProfileLiveEmail()`

### **Manual Approval Flow** (AdminPanel)
1. Admin approves profile in admin panel
2. Profile status changes to approved
3. Email is sent via `sendProfileLiveEmail()`

## Common Issues & Solutions

### 1. **Missing Environment Variables**
**Symptoms**: Console shows "Loop email configuration missing"

**Check**: Verify these environment variables exist:
- `VITE_LOOP_API_KEY`
- `VITE_LOOP_TRANSACTION_ID`
- `VITE_BASE_URL` (optional, defaults to cofounderbase.com)

**Fix**: Add missing variables to your Vercel environment settings

### 2. **Loop.so Configuration Issues**
**Symptoms**: API errors, 401/403 responses

**Check**:
- Loop.so API key is valid and active
- Transaction ID exists in your Loop account
- Email template is published in Loop

### 3. **Auto-Approval Setting**
**Symptoms**: Emails only sent for manually approved profiles

**Check**: Auto-approval setting in admin panel
- Green = ON (emails sent immediately)
- Red = OFF (emails only sent after manual approval)

### 4. **Profile Data Issues**
**Symptoms**: Email function called but fails

**Check**:
- Profile has valid email address
- Profile ID is generated correctly
- Full name is not empty

## Diagnostic Steps

### Step 1: Check Environment Variables
Open browser console on your website and run:
```javascript
console.log('VITE_LOOP_API_KEY:', import.meta.env.VITE_LOOP_API_KEY ? 'SET' : 'MISSING')
console.log('VITE_LOOP_TRANSACTION_ID:', import.meta.env.VITE_LOOP_TRANSACTION_ID ? 'SET' : 'MISSING')
console.log('VITE_BASE_URL:', import.meta.env.VITE_BASE_URL || 'Using default')
```

### Step 2: Test Profile Submission
1. Submit a test profile
2. Check browser console for:
   - "Profile submitted successfully"
   - "Welcome email sent successfully" OR "Welcome email failed to send"
   - Any error messages

### Step 3: Test Manual Approval
1. Go to admin panel
2. Approve a pending profile
3. Check for success/error messages
4. Look for email-related console logs

### Step 4: Check Auto-Approval Setting
1. In admin panel, look for auto-approval toggle
2. Green = ON, Red = OFF
3. Test with both settings

## Environment Variables Setup

### **Vercel Environment Variables**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:

```
VITE_LOOP_API_KEY=your_loop_api_key_here
VITE_LOOP_TRANSACTION_ID=your_transaction_id_here
VITE_BASE_URL=https://your-domain.com
```

### **Loop.so Setup**
1. Login to Loop.so
2. Go to Transactional Emails
3. Create/verify your email template
4. Get the Transaction ID
5. Get your API key from Settings

## Testing Email Functionality

### **Test Script for Browser Console**
```javascript
// Test email sending directly
const testEmailSending = async () => {
  const { sendProfileLiveEmail, getFirstName, generateProfileUrl } = await import('./src/lib/loop-email.ts')
  
  const testData = {
    first_name: 'Test',
    profile_url: 'https://yoursite.com/profile/test',
    full_name: 'Test User',
    email: 'your-test-email@example.com',
    role: 'founder'
  }
  
  const result = await sendProfileLiveEmail(testData)
  console.log('Email test result:', result)
}

testEmailSending()
```

## Expected Console Messages

### **Successful Email Flow**:
```
Profile submitted successfully: {profile data}
Welcome email sent successfully
```

### **Failed Email Flow**:
```
Profile submitted successfully: {profile data}
Welcome email failed to send
Error sending profile live email: {error details}
```

### **Missing Configuration**:
```
Loop email configuration missing - emails will not be sent
Profile data that would have been emailed: {profile data}
```

## Quick Fixes

### **Fix 1: Add Missing Environment Variables**
1. Check Vercel environment variables
2. Add VITE_LOOP_API_KEY and VITE_LOOP_TRANSACTION_ID
3. Redeploy your application

### **Fix 2: Verify Loop.so Setup**
1. Login to Loop.so
2. Check API key is active
3. Verify transaction email template exists and is published
4. Test API key with a simple curl request

### **Fix 3: Enable Auto-Approval**
1. Go to admin panel
2. Click auto-approval toggle to turn it ON (green)
3. Test profile submission

### **Fix 4: Check Profile Data**
1. Ensure profiles have valid email addresses
2. Check that profile IDs are being generated
3. Verify full names are not empty

## Verification Steps

After implementing fixes:

1. **Submit a test profile** and check console
2. **Manually approve a profile** in admin panel
3. **Check email inbox** for welcome emails
4. **Verify console logs** show success messages

## Support

If emails still aren't working:
1. Check browser console for specific error messages
2. Verify Loop.so account status and limits
3. Test with a simple email first
4. Check spam/junk folders for test emails

The email system should work automatically once environment variables are properly configured!