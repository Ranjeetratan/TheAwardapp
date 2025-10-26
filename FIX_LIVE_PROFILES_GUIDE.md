# Fix Live Profiles Visibility - Step by Step Guide

## Issue
Only seeing 1 founder and 0 co-founders on the live website, but profiles exist in the admin panel.

## Root Cause
Profiles are likely not approved in the database, so they're not showing on the public website.

## Solution Steps

### Step 1: Access Your Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your CofounderBase project
4. Go to **SQL Editor** in the left sidebar

### Step 2: Run the Approval Script
1. Copy the contents of `APPROVE_ALL_LIVE_PROFILES.sql`
2. Paste it into the SQL Editor
3. Click **Run** button
4. You should see output showing:
   - Current profile status
   - All profiles being approved
   - Final count of approved profiles

### Step 3: Verify in Admin Panel
1. Go to your website: `yoursite.com/#admin`
2. Enter admin password: `W9@cZt7!mQ#4rTf%X2^vBp8&`
3. Check the stats at the top:
   - Should show "X approved, 0 pending"
   - Should see the auto-approval toggle (green = ON)

### Step 4: Clear Website Cache
1. Go to your main website
2. Hard refresh the page:
   - **Chrome/Firefox**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - **Safari**: Cmd+Option+R
3. Or open in incognito/private browsing mode

### Step 5: Verify Profiles Are Visible
1. Check the homepage - you should now see all profiles
2. Try filtering by "Founders" and "Co-founders"
3. All approved profiles should be visible

## If Profiles Still Don't Show

### Option A: Run Troubleshooting Script
1. In Supabase SQL Editor, run `TROUBLESHOOT_LIVE_PROFILES.sql`
2. This will show you exactly what's in your database
3. Look for any issues in the output

### Option B: Check Browser Console
1. Open your website
2. Press F12 to open developer tools
3. Go to Console tab
4. Look for any error messages
5. Try running: `window.location.reload(true)` to force refresh

### Option C: Manual Database Check
Run this quick query in Supabase SQL Editor:
```sql
SELECT 
  role,
  COUNT(*) as total,
  COUNT(CASE WHEN approved = true THEN 1 END) as approved
FROM profiles 
GROUP BY role;
```

## Expected Results After Fix

### Homepage Should Show:
- All founders in the founders section
- All co-founders in the co-founders section  
- All investors in the investors section
- Proper counts in the filter buttons

### Admin Panel Should Show:
- Total profiles count
- "X approved, 0 pending" status
- Auto-approval toggle in green "ON" state
- All profiles listed in their respective tabs

## Quick Verification Commands

### In Supabase SQL Editor:
```sql
-- Check total approved profiles
SELECT COUNT(*) as approved_profiles FROM profiles WHERE approved = true;

-- Check by role
SELECT role, COUNT(*) FROM profiles WHERE approved = true GROUP BY role;
```

### In Browser Console (on your website):
```javascript
// Clear cache and reload
localStorage.clear();
sessionStorage.clear();
window.location.reload(true);
```

## Contact for Support
If you're still having issues after following these steps:
- Check the browser console for errors
- Verify your Supabase connection is working
- Ensure RLS policies are properly configured
- Try the troubleshooting script for detailed diagnostics

## Files to Use:
1. **APPROVE_ALL_LIVE_PROFILES.sql** - Main fix script
2. **TROUBLESHOOT_LIVE_PROFILES.sql** - Diagnostic script
3. This guide for step-by-step instructions

The fix should be immediate once you run the approval script and refresh your browser!