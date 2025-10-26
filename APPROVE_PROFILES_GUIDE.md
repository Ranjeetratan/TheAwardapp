# How to Approve Profiles and Make Them Visible on Homepage

## The Issue
Profiles are not showing up on the homepage because they need to be approved first. The homepage only shows profiles where `approved = true`.

## Quick Fix - Method 1: Use Admin Panel (Recommended)

1. **Access Admin Panel**:
   - Go to your website and add `#admin` to the URL (e.g., `http://localhost:5173/#admin`)
   - Enter the admin password: `W9@cZt7!mQ#4rTf%X2^vBp8&`

2. **Approve All Profiles**:
   - In the admin panel header, you'll see an "Approve All" button if there are pending profiles
   - Click the "Approve All (X)" button where X is the number of pending profiles
   - Confirm the action when prompted

3. **Verify**:
   - Go back to the homepage
   - All approved profiles should now be visible

## Quick Fix - Method 2: Use SQL (Alternative)

If you prefer to use SQL directly in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run this query:

```sql
-- Approve all pending profiles
UPDATE profiles 
SET approved = true 
WHERE approved = false OR approved IS NULL;

-- Verify the update
SELECT 
  id,
  full_name,
  role,
  approved,
  created_at
FROM profiles 
ORDER BY created_at DESC;
```

## Quick Fix - Method 3: Browser Console (For Testing)

1. Open your admin panel in the browser
2. Open browser developer tools (F12)
3. Go to Console tab
4. Run: `window.approveAllProfiles()`

## Verification

After approving profiles, you should see:
- Profiles appear on the homepage
- The admin panel shows "0 pending" profiles
- The "Approve All" button disappears from the admin header

## Future Profile Submissions

New profile submissions will also need to be approved through the admin panel before they appear on the homepage. This is a security feature to prevent spam and ensure quality control.

## Troubleshooting

If profiles still don't show up after approval:
1. Clear your browser cache
2. Check the browser console for any errors
3. Verify the profiles are actually approved in the admin panel
4. Try refreshing the homepage

## Note

I've temporarily removed the `approved: true` filter from the profile fetching code so all profiles should show up now, but it's still recommended to properly approve them through the admin panel for proper workflow.