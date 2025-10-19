# "No Profiles Found" Troubleshooting Guide

## 🔍 Quick Diagnosis

### Step 1: Check Your Browser Console
1. Open your website
2. Press F12 (or right-click → Inspect)
3. Go to Console tab
4. Look for any error messages or the debug info

### Step 2: Verify Supabase Connection
Run this query in your Supabase SQL Editor:
```sql
-- Copy and paste the entire content from test-data-query.sql
```

### Step 3: Check Environment Variables
Make sure your `.env` file has:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

## 🚨 Common Issues & Solutions

### Issue 1: No Data in Database
**Symptoms:** Console shows "Fetched profiles: 0 profiles"

**Solution:**
```sql
-- Check if you have any profiles
SELECT COUNT(*) FROM profiles;

-- If 0, run the additional-features.sql script which includes sample data
-- Or manually insert some test data:
INSERT INTO profiles (full_name, email, location, linkedin_profile, short_bio, availability, looking_for, role, approved) 
VALUES ('Test User', 'test@example.com', 'Test City', 'https://linkedin.com/test', 'Test bio', 'Full-time', 'Test', 'founder', true);
```

### Issue 2: Profiles Not Approved
**Symptoms:** Console shows profiles but they don't appear

**Solution:**
```sql
-- Check approval status
SELECT full_name, approved FROM profiles;

-- Approve all profiles
UPDATE profiles SET approved = true WHERE approved = false;
```

### Issue 3: Wrong Role Values
**Symptoms:** Profiles exist but don't show for specific tabs

**Solution:**
```sql
-- Check role values
SELECT DISTINCT role FROM profiles;

-- Fix role values if needed
UPDATE profiles SET role = 'founder' WHERE role = 'founders';
UPDATE profiles SET role = 'cofounder' WHERE role = 'cofounders';
UPDATE profiles SET role = 'investor' WHERE role = 'investors';
```

### Issue 4: Supabase Connection Error
**Symptoms:** Console shows Supabase errors

**Solutions:**
1. **Check RLS Policies:**
```sql
-- Make sure you have the right policies
CREATE POLICY "Allow public read approved profiles" ON profiles FOR SELECT USING (approved = true);
```

2. **Check Environment Variables:**
- Restart your development server after changing .env
- Make sure variables start with `VITE_`
- No quotes around the values in .env

3. **Check Supabase URL/Key:**
- Go to Supabase Dashboard → Settings → API
- Copy the Project URL and anon/public key
- Make sure they're correct in your .env file

### Issue 5: Mock Data Not Showing
**Symptoms:** No real data and no mock data

**Check:**
1. Browser console for errors
2. Network tab for failed requests
3. Make sure the debug panel shows correct info

## 🔧 Quick Fixes

### Fix 1: Force Show Mock Data
Add this to your browser console:
```javascript
localStorage.setItem('forceShowMockData', 'true')
// Then refresh the page
```

### Fix 2: Reset Everything
```sql
-- In Supabase SQL Editor
DELETE FROM profiles; -- BE CAREFUL! This deletes all data
-- Then run additional-features.sql again
```

### Fix 3: Manual Test Profile
```sql
INSERT INTO profiles (
  full_name, email, location, linkedin_profile, short_bio, 
  availability, looking_for, role, approved, featured
) VALUES (
  'Test Founder', 'test@test.com', 'Test City', 'https://linkedin.com/test',
  'This is a test profile to verify the system is working.',
  'Full-time', 'Technical Co-founder', 'founder', true, true
);
```

## ✅ Verification Steps

After fixing:

1. **Check Console:** Should see "Fetched profiles: X profiles"
2. **Check Debug Panel:** Should show correct counts
3. **Test All Tabs:** Switch between Founders/Cofounders/Investors
4. **Test Search:** Try searching for names or skills
5. **Test Filters:** Try applying location or industry filters

## 🆘 Still Not Working?

1. **Share Console Output:** Copy any error messages from browser console
2. **Share SQL Results:** Run test-data-query.sql and share results
3. **Check Network Tab:** Look for failed API requests
4. **Verify .env File:** Make sure environment variables are set correctly

## 📞 Debug Information to Collect

When asking for help, include:
- Browser console output
- Results from test-data-query.sql
- Your .env file (without the actual keys)
- Any error messages from Supabase dashboard

---

**Most Common Fix:** Run `UPDATE profiles SET approved = true;` in Supabase SQL Editor!