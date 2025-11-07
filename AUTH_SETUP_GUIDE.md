# Authentication Setup Guide for CofounderBase

## Overview
Users must now sign up/sign in before creating a profile. This ensures better security and allows users to manage their own profiles.

## Supabase Configuration Steps

### Step 1: Enable Email Authentication
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Make sure **Email** provider is **enabled**
4. Configure email settings:
   - **Enable email confirmations**: Recommended (users verify email)
   - **Disable email confirmations**: For faster testing (not recommended for production)

### Step 2: Configure Email Templates (Optional)
1. Go to **Authentication** → **Email Templates**
2. Customize the confirmation email template
3. Customize the password reset email template

### Step 3: Run the SQL Setup Script
1. Go to **SQL Editor** in Supabase Dashboard
2. Create a new query
3. Copy and paste the contents of `supabase-auth-setup.sql`
4. Click **Run** to execute

This will:
- Add `user_id` column to profiles table
- Set up Row Level Security (RLS) policies
- Create necessary indexes
- Configure proper permissions

### Step 4: Verify Setup
Run this query in SQL Editor to verify:
```sql
-- Check if user_id column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'user_id';

-- Check RLS policies
SELECT policyname, cmd, qual
FROM pg_policies 
WHERE tablename = 'profiles';
```

## How It Works

### User Flow:
1. **User visits website** → Browses profiles (no auth required)
2. **User clicks "Submit Profile"** → Redirected to Sign Up/Sign In
3. **User creates account** → Email verification (if enabled)
4. **User signs in** → Can now create profile
5. **Profile is linked to user** → User can edit their own profile later

### Authentication Features:
- ✅ **Email/Password Sign Up**
- ✅ **Email/Password Sign In**
- ✅ **Password Reset**
- ✅ **Email Verification** (configurable)
- ✅ **Session Management**
- ✅ **Automatic Profile Linking**

### Security Features:
- ✅ **Row Level Security (RLS)** - Users can only edit their own profiles
- ✅ **Secure Password Storage** - Handled by Supabase
- ✅ **Session Tokens** - Automatic token refresh
- ✅ **Protected Routes** - Profile form requires authentication

## Environment Variables

No new environment variables needed! Uses existing:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

## Testing the Authentication

### Local Testing:
1. Start dev server: `npm run dev`
2. Go to `http://localhost:5173/`
3. Click "Submit Profile"
4. You'll see the Sign Up/Sign In screen
5. Create a test account
6. Verify email (if enabled)
7. Sign in and create profile

### Test Accounts:
Create test accounts with:
- Email: `test@example.com`
- Password: `test123456`

## RLS Policies Explained

### 1. View Approved Profiles (Public)
```sql
-- Anyone can view approved profiles
CREATE POLICY "Anyone can view approved profiles"
ON profiles FOR SELECT
USING (approved = true);
```

### 2. View Own Profile (Authenticated)
```sql
-- Users can view their own profile even if not approved
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);
```

### 3. Insert Own Profile (Authenticated)
```sql
-- Users can only create profiles for themselves
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### 4. Update Own Profile (Authenticated)
```sql
-- Users can only update their own profiles
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);
```

## Admin Panel Access

Admin panel is **separate** from user authentication:
- **URL**: `yoursite.com/#admin`
- **Password**: Stored in environment variables
- **Purpose**: Approve/manage all profiles

## Troubleshooting

### Issue: "Email confirmations not working"
**Solution**: 
1. Check Supabase Dashboard → Authentication → Email Templates
2. Verify SMTP settings are configured
3. Or disable email confirmations for testing

### Issue: "Users can't create profiles"
**Solution**:
1. Check if `user_id` column exists in profiles table
2. Verify RLS policies are set up correctly
3. Check browser console for errors

### Issue: "RLS policy errors"
**Solution**:
Run this to temporarily disable RLS for testing:
```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

Then re-enable after fixing:
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

## Future Enhancements

With authentication in place, you can now add:
- ✅ User dashboard to manage their profile
- ✅ Edit profile functionality
- ✅ Profile ownership verification
- ✅ Direct messaging between users
- ✅ Saved/favorited profiles
- ✅ Email notifications for matches

## Migration for Existing Profiles

If you have existing profiles without `user_id`:
```sql
-- Option 1: Keep them as legacy profiles (visible but not editable)
-- No action needed

-- Option 2: Delete unlinked profiles
DELETE FROM profiles WHERE user_id IS NULL;

-- Option 3: Create dummy users for existing profiles (not recommended)
-- Contact support for migration script
```