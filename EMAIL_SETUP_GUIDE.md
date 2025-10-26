# Complete Email Setup Guide - Loop.so Integration

## Overview
This guide helps you set up and troubleshoot email notifications for when profiles go live on CofounderBase.

## Email Flow

### **When Emails Are Sent**:
1. **Auto-Approval ON**: Email sent immediately when profile is submitted
2. **Auto-Approval OFF**: Email sent when admin manually approves profile
3. **Manual Approval**: Email sent when admin clicks "Approve" in admin panel

### **Email Content**:
- Welcome message
- Profile is now live notification
- Link to their live profile
- Personalized with their name and role

## Setup Requirements

### **1. Loop.so Account**
- Sign up at [loops.so](https://loops.so)
- Create a transactional email template
- Get your API key and Transaction ID

### **2. Environment Variables**
Add these to your Vercel project:
```
VITE_LOOP_API_KEY=your_api_key_here
VITE_LOOP_TRANSACTION_ID=your_transaction_id_here
VITE_BASE_URL=https://your-domain.com
```

### **3. Email Template Variables**
Your Loop.so template should include these variables:
- `{{first_name}}` - User's first name
- `{{full_name}}` - User's full name
- `{{profile_url}}` - Link to their profile
- `{{role}}` - Their role (founder/cofounder/investor)

## Step-by-Step Setup

### **Step 1: Loop.so Configuration**
1. **Login to Loop.so**
2. **Go to Transactional Emails**
3. **Create New Template** with these variables:
   ```
   Hi {{first_name}},
   
   Great news! Your {{role}} profile is now live on CofounderBase.
   
   You can view your profile here: {{profile_url}}
   
   Welcome to the community!
   ```
4. **Publish the template**
5. **Copy the Transaction ID**

### **Step 2: Get API Key**
1. **Go to Loop.so Settings**
2. **Find API Keys section**
3. **Copy your API key**

### **Step 3: Add Environment Variables**
1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add these variables**:
   - `VITE_LOOP_API_KEY` = your Loop.so API key
   - `VITE_LOOP_TRANSACTION_ID` = your transaction template ID
   - `VITE_BASE_URL` = your website URL (e.g., https://cofounderbase.com)

### **Step 4: Redeploy**
1. **Trigger a new deployment** in Vercel
2. **Wait for deployment to complete**

### **Step 5: Test**
1. **Submit a test profile** on your website
2. **Check browser console** for email logs
3. **Check email inbox** (including spam folder)

## Troubleshooting

### **Issue: "Loop email configuration missing"**
**Cause**: Environment variables not set
**Fix**: Add VITE_LOOP_API_KEY and VITE_LOOP_TRANSACTION_ID to Vercel

### **Issue: "Welcome email failed to send"**
**Cause**: API error or invalid credentials
**Fix**: 
1. Verify API key is correct
2. Check transaction ID exists
3. Ensure template is published in Loop.so

### **Issue: Emails only sent for manual approval**
**Cause**: Auto-approval is OFF
**Fix**: Go to admin panel and turn auto-approval ON (green toggle)

### **Issue: No emails sent at all**
**Cause**: Multiple possible issues
**Fix**: Run the diagnostic script in browser console

## Testing Email Functionality

### **Browser Console Test**
1. **Open your website**
2. **Press F12** to open developer tools
3. **Go to Console tab**
4. **Copy and paste** the contents of `test-email-functionality.js`
5. **Press Enter** to run the test

### **Manual Test**
1. **Submit a test profile** with your own email
2. **Check browser console** for:
   - "Profile submitted successfully"
   - "Welcome email sent successfully" OR error messages
3. **Check your email inbox** (and spam folder)

### **Admin Panel Test**
1. **Go to admin panel** (#admin)
2. **Find a pending profile**
3. **Click Approve**
4. **Check for success message** mentioning email
5. **Check email inbox**

## Expected Console Messages

### **Success Flow**:
```
Profile submitted successfully: {data}
Welcome email sent successfully
```

### **Configuration Missing**:
```
Loop email configuration missing - emails will not be sent
Profile data that would have been emailed: {data}
```

### **API Error**:
```
Loop email error: {error details}
Welcome email failed to send
```

## Verification Checklist

- [ ] Loop.so account created
- [ ] Email template created and published
- [ ] API key obtained
- [ ] Transaction ID obtained
- [ ] Environment variables added to Vercel
- [ ] Application redeployed
- [ ] Auto-approval setting configured
- [ ] Test profile submitted
- [ ] Email received successfully

## Common Loop.so Template

Here's a sample email template for Loop.so:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to CofounderBase</title>
</head>
<body>
    <h1>Welcome to CofounderBase, {{first_name}}! 🎉</h1>
    
    <p>Great news! Your {{role}} profile is now live and visible to thousands of entrepreneurs in our community.</p>
    
    <p><strong>Your profile is live at:</strong><br>
    <a href="{{profile_url}}">{{profile_url}}</a></p>
    
    <p>What happens next:</p>
    <ul>
        <li>Your profile is now searchable in our directory</li>
        <li>Other founders and cofounders can discover and connect with you</li>
        <li>You'll start receiving connection requests from potential matches</li>
    </ul>
    
    <p>Ready to find your perfect cofounder? Start browsing other profiles and make connections!</p>
    
    <p>Best regards,<br>
    The CofounderBase Team</p>
</body>
</html>
```

## Support

If you're still having issues:
1. Run the diagnostic script first
2. Check Loop.so account status and limits
3. Verify environment variables are correctly set
4. Test with a simple email template first
5. Check browser console for specific error messages

The email system should work seamlessly once properly configured!