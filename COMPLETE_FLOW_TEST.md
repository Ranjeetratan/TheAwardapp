# Complete Flow Test Guide

## Test the Complete CofounderBase Flow

### 1. Admin Panel Security Test
- **URL**: `http://localhost:5173/#admin`
- **New Password**: `W9@cZt7!mQ#4rTf%X2^vBp8&`
- **Security Features**:
  - Session expires after 2 hours
  - Password is complex and secure
  - No visible admin links in UI

### 2. Profile Submission Test

#### Test Founder Profile:
1. Go to homepage
2. Click "Submit Profile"
3. Fill out form as Founder:
   - **Name**: Test Founder
   - **Email**: testfounder@example.com
   - **Location**: San Francisco, CA
   - **LinkedIn**: https://linkedin.com/in/testfounder
   - **Bio**: Experienced entrepreneur building AI startup
   - **Availability**: Full-time
   - **Looking For**: Technical Co-founder
   - **Role**: Founder
   - **Startup Name**: AI Startup
   - **Stage**: Seed
   - **Industry**: AI/ML
4. Submit form
5. **Expected**: Profile auto-approved, email sent via Loop

#### Test Co-founder Profile:
1. Submit another profile as Co-founder:
   - **Name**: Test Cofounder
   - **Email**: testcofounder@example.com
   - **Role**: Co-founder
   - **Skills**: React, Node.js, Python
   - **Experience**: Expert
2. **Expected**: Profile auto-approved, email sent

#### Test Investor Profile:
1. Submit profile as Investor:
   - **Name**: Test Investor
   - **Email**: testinvestor@example.com
   - **Role**: Investor
   - **Investment Range**: $100K - $1M
   - **Stage**: Seed
   - **Focus**: AI/ML
2. **Expected**: Profile auto-approved, email sent

### 3. Email Verification
- Check if Loop emails are sent to submitted email addresses
- Email should contain profile URL
- Verify email template is correct

### 4. Profile Display Test
- **Homepage**: Should show all 3 new profiles immediately
- **Profile URLs**: Each profile should have shareable URL
- **Share Function**: Test share button on profiles

### 5. Admin Panel Test
- **Login**: Use new secure password
- **Stats**: Should show correct counts
- **Profile Management**: Should show all profiles as approved
- **Approve All Button**: Should NOT show if all profiles are approved

### 6. Analytics Test
- Open browser console
- Run: `window.testGoogleAnalytics()`
- Verify tracking is working

## Expected Results:

### ✅ Working Features:
- [x] Secure admin login with new password
- [x] Auto-approval of new profiles
- [x] Loop email notifications
- [x] Profile URLs and sharing
- [x] Google Analytics tracking
- [x] Admin session timeout

### 🔧 Fixes Applied:
- Updated admin password to: `W9@cZt7!mQ#4rTf%X2^vBp8&`
- Added 2-hour session timeout for security
- Profiles auto-approved on submission
- Loop emails sent on approval
- Enhanced Google Analytics tracking

## Troubleshooting:

### If Approve Button Not Showing:
- All profiles are already approved (this is correct behavior)
- Only shows for profiles with `approved: false`

### If Emails Not Sending:
- Check Loop API configuration in Vercel environment variables
- Verify Loop transaction ID and API key

### If Analytics Not Working:
- Run `window.testGoogleAnalytics()` in console
- Check Network tab for Google Analytics requests
- Wait 24-48 hours for data to appear in GA dashboard