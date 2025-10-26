# Fix Constraint Violation Error - Complete Guide

## Error Message
```
ERROR: 23514: check constraint "profiles_experience_level_check" of relation "profiles" is violated by some row
```

## What This Means
You have existing data in your database that doesn't match the constraint you're trying to create. The constraint expects `experience_level` to be one of: 'Beginner', 'Intermediate', 'Expert', or NULL, but some rows have different values.

## Step-by-Step Fix

### Step 1: Diagnose the Problem
Run `diagnose-constraint-issue.sql` to see exactly what values are causing issues:
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the diagnostic script
3. Run it to see all current `experience_level` values
4. Look for values marked as "✗ INVALID"

### Step 2: Choose Your Fix Method

#### Option A: Quick Fix (Recommended)
Use `quick-constraint-fix.sql`:
- Fixes common case sensitivity issues (beginner → Beginner)
- Sets invalid values to NULL (making them optional)
- Creates the constraint

#### Option B: Comprehensive Fix
Use `fix-constraint-with-data-cleanup.sql`:
- Maps common variations to proper values
- Handles more edge cases
- Provides detailed feedback

### Step 3: Run the Fix
1. Copy your chosen fix script
2. Paste in Supabase SQL Editor
3. Click Run
4. Check for success message

## Common Causes & Solutions

### Case Sensitivity Issues
- **Problem**: 'beginner' instead of 'Beginner'
- **Solution**: Scripts automatically fix capitalization

### Alternative Wordings
- **Problem**: 'Junior', 'Senior', 'Mid-level'
- **Solution**: Scripts map these to standard values:
  - Junior/Entry → Beginner
  - Mid-level/Experienced → Intermediate  
  - Senior/Advanced → Expert

### Empty Strings or Spaces
- **Problem**: '', ' ', or whitespace-only values
- **Solution**: Scripts convert these to NULL

### Completely Invalid Values
- **Problem**: Random text or numbers
- **Solution**: Scripts set these to NULL (optional field)

## Verification Steps

After running the fix:

1. **Check the constraint exists**:
```sql
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass 
AND conname = 'profiles_experience_level_check';
```

2. **Verify all data is valid**:
```sql
SELECT experience_level, COUNT(*) 
FROM profiles 
WHERE role = 'cofounder' 
GROUP BY experience_level;
```

3. **Test profile submission**:
   - Go to your website
   - Try submitting a co-founder profile
   - Select each experience level option
   - Should work without errors

## Expected Results

After the fix:
- ✅ All existing data conforms to constraint
- ✅ New co-founder profiles can be submitted
- ✅ Experience levels: Beginner, Intermediate, Expert work
- ✅ Leaving experience level blank works (NULL)

## If Fix Doesn't Work

### Check for Other Constraints
Run this to see all constraints:
```sql
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass 
AND contype = 'c';
```

### Check for Triggers
Sometimes triggers can cause similar errors:
```sql
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'profiles';
```

### Manual Data Check
If automated fixes don't work, manually check problematic rows:
```sql
SELECT id, full_name, experience_level, created_at
FROM profiles 
WHERE role = 'cofounder' 
AND experience_level IS NOT NULL 
AND experience_level NOT IN ('Beginner', 'Intermediate', 'Expert');
```

## Files to Use

1. **diagnose-constraint-issue.sql** - See what's wrong
2. **quick-constraint-fix.sql** - Fast fix for common issues
3. **fix-constraint-with-data-cleanup.sql** - Comprehensive fix
4. This guide for instructions

## Prevention

To prevent this in the future:
- The ProfileForm already uses the correct values
- Auto-approval system ensures consistent data
- Constraint will prevent invalid submissions going forward

Run the diagnostic script first to understand your specific issue, then choose the appropriate fix!