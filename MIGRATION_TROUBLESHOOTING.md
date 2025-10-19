# Migration Troubleshooting Guide

## 🚨 Common Migration Errors & Solutions

### Error: Check constraint violation for experience_level

**Error Message:**
```
ERROR: 23514: new row for relation "profiles" violates check constraint "profiles_experience_level_check"
```

**Root Cause:**
This happens when existing data has values that don't exactly match the new constraint, often due to:
- Extra spaces or hidden characters
- Case sensitivity issues
- Existing constraints conflicting with new ones

**Solution:**
1. **Run the pre-migration check first:**
```sql
-- Use the pre-migration-check.sql file to see problematic data
```

2. **Manual fix for specific issues:**
```sql
-- Remove all existing constraints first
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_experience_level_check;

-- Clean up the data
UPDATE profiles SET experience_level = TRIM(experience_level) WHERE experience_level IS NOT NULL;
UPDATE profiles SET experience_level = 'Beginner (0-2 years)' WHERE LOWER(TRIM(experience_level)) = 'beginner';
UPDATE profiles SET experience_level = 'Intermediate (3-5 years)' WHERE LOWER(TRIM(experience_level)) = 'intermediate';
UPDATE profiles SET experience_level = 'Expert (10+ years)' WHERE LOWER(TRIM(experience_level)) = 'expert';

-- Add the constraint back
ALTER TABLE profiles ADD CONSTRAINT profiles_experience_level_check 
CHECK (experience_level IN ('Beginner (0-2 years)', 'Intermediate (3-5 years)', 'Senior (6-10 years)', 'Expert (10+ years)', 'Serial Entrepreneur') OR experience_level IS NULL);
```

### Error: Check constraint violation for availability

**Solution:**
```sql
-- Check current availability values
SELECT DISTINCT availability FROM profiles WHERE availability IS NOT NULL;

-- Update any non-standard values
UPDATE profiles SET availability = 'Full-time' WHERE availability NOT IN ('Full-time', 'Part-time', 'Open to Discuss', 'Consulting', 'Equity Only', 'Sweat Equity', 'Paid Role');
```

### Error: Check constraint violation for startup_stage

**Solution:**
```sql
-- Check current startup_stage values
SELECT DISTINCT startup_stage FROM profiles WHERE startup_stage IS NOT NULL;

-- Update old values
UPDATE profiles SET startup_stage = 'Pre-Seed' WHERE startup_stage = 'Early';
UPDATE profiles SET startup_stage = 'Scaling' WHERE startup_stage = 'Growth';
UPDATE profiles SET startup_stage = 'Series A' WHERE startup_stage = 'Series-A';
```

## 🔧 Safe Migration Steps

### Step 1: Backup Your Data
```sql
-- Create a backup table
CREATE TABLE profiles_backup AS SELECT * FROM profiles;
```

### Step 2: Check Current Data
```sql
-- Use the pre-migration check script
-- Copy and run the entire content from pre-migration-check.sql
-- This will show you exactly what data needs to be fixed
```

**Or manually check:**
```sql
-- See what data you have that might conflict
SELECT 
  COUNT(*) as total_profiles,
  COUNT(DISTINCT role) as unique_roles,
  COUNT(DISTINCT availability) as unique_availability,
  COUNT(DISTINCT experience_level) as unique_experience_levels,
  COUNT(DISTINCT startup_stage) as unique_startup_stages
FROM profiles;

-- See specific values that might cause issues
SELECT DISTINCT experience_level FROM profiles WHERE experience_level IS NOT NULL;
SELECT DISTINCT availability FROM profiles WHERE availability IS NOT NULL;
SELECT DISTINCT startup_stage FROM profiles WHERE startup_stage IS NOT NULL;
```

### Step 3: Clean Data First
```sql
-- Run the data cleaning queries above based on what you find
```

### Step 4: Run Migration
```sql
-- Now run the migration script from supabase-migration.sql
```

## 🆘 Emergency Rollback

If something goes wrong:

```sql
-- Drop the new constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_availability_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_experience_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_startup_stage_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Restore from backup if needed
-- (Only if you created the backup table)
DELETE FROM profiles;
INSERT INTO profiles SELECT * FROM profiles_backup;
```

## 📞 Need Help?

1. **Check Supabase Logs**: Go to your Supabase dashboard → Logs
2. **Test on Small Dataset**: Try migration on a copy with just a few rows
3. **Manual Data Cleanup**: Update problematic rows individually
4. **Contact Support**: Use the support button in the app

## ✅ Verification After Migration

```sql
-- Verify the migration worked
SELECT 
  COUNT(*) as total_profiles,
  COUNT(*) FILTER (WHERE company_size IS NOT NULL) as profiles_with_company_size,
  COUNT(*) FILTER (WHERE funding_stage IS NOT NULL) as profiles_with_funding_stage,
  COUNT(*) FILTER (WHERE updated_at IS NOT NULL) as profiles_with_updated_at
FROM profiles;

-- Check constraints are working
INSERT INTO profiles (full_name, email, location, linkedin_profile, short_bio, availability, looking_for, role, experience_level) 
VALUES ('Test', 'test@test.com', 'Test', 'https://linkedin.com/test', 'Test bio', 'Invalid Value', 'Test', 'cofounder', 'Invalid Level');
-- This should fail with constraint violation

-- Clean up test
DELETE FROM profiles WHERE email = 'test@test.com';
```

---

**Remember**: Always backup your data before running migrations! 🛡️