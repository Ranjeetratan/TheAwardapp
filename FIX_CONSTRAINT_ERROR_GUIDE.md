# Fix Co-founder Constraint Error - Step by Step Guide

## Issue
Getting a constraint error when submitting co-founder profiles, specifically related to `experience_level` field.

## Root Cause
The database has a check constraint on `experience_level` that doesn't match the values used in the ProfileForm, or the constraint query is using outdated PostgreSQL syntax.

## Quick Fix (Recommended)

### Step 1: Run the Simple Fix Script
1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `fix-experience-constraint-simple.sql`
4. Click **Run**

This will:
- Remove any existing problematic constraints
- Create a new constraint that matches the ProfileForm exactly
- Allow values: 'Beginner', 'Intermediate', 'Expert'

### Step 2: Test the Fix
1. Go to your website
2. Try submitting a co-founder profile
3. Select any experience level (Beginner, Intermediate, or Expert)
4. The submission should now work without errors

## Detailed Diagnosis (If Simple Fix Doesn't Work)

### Step 1: Run Comprehensive Check
Use `check-all-constraints.sql` to see all constraints and data:
1. Copy and paste the script in Supabase SQL Editor
2. Run it to see all current constraints and data values
3. Look for any mismatches between database constraints and form values

### Step 2: Run Updated Fix Script
If you need more detailed diagnostics, use `fix-cofounder-constraint-updated.sql`:
1. This script provides detailed output about what's happening
2. Shows current constraints and data
3. Fixes the constraint and verifies the fix

## What the Fix Does

### Removes Old Constraints
```sql
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_experience_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS experience_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS chk_experience_level;
```

### Creates New Correct Constraint
```sql
ALTER TABLE profiles 
ADD CONSTRAINT profiles_experience_level_check 
CHECK (experience_level IS NULL OR experience_level IN ('Beginner', 'Intermediate', 'Expert'));
```

## Expected Values

### ProfileForm Options (must match database constraint):
- **Beginner** - For those new to the field
- **Intermediate** - For those with some experience
- **Expert** - For seasoned professionals

### Database Constraint:
- Allows NULL values (for optional field)
- Allows exactly: 'Beginner', 'Intermediate', 'Expert'
- Rejects any other values

## Verification

After running the fix, you should be able to:
1. ✅ Submit co-founder profiles with any experience level
2. ✅ Leave experience level blank (NULL is allowed)
3. ✅ See the profile appear in the directory
4. ✅ No constraint errors in the browser console

## Common Issues

### Issue: "Column consrc does not exist"
- **Cause**: Using old PostgreSQL syntax
- **Solution**: Use the updated scripts that use `pg_get_constraintdef(oid)` instead

### Issue: Still getting constraint errors
- **Cause**: Other constraints might be failing
- **Solution**: Run `check-all-constraints.sql` to see all constraints

### Issue: Form values don't match database
- **Cause**: ProfileForm and database constraint have different allowed values
- **Solution**: The fix scripts ensure they match exactly

## Files to Use

1. **fix-experience-constraint-simple.sql** - Quick fix (recommended)
2. **fix-cofounder-constraint-updated.sql** - Detailed fix with diagnostics
3. **check-all-constraints.sql** - Comprehensive constraint analysis
4. This guide for step-by-step instructions

## Support

If you're still having issues:
1. Check the browser console for specific error messages
2. Run the diagnostic scripts to see what constraints exist
3. Verify that the ProfileForm values match the database constraint
4. Ensure your Supabase connection is working properly

The fix should resolve the co-founder profile submission issue immediately!