# Quick Fix for Your Migration Error

## 🚨 Your Specific Error
```
ERROR: 23514: new row for relation "profiles" violates check constraint "profiles_experience_level_check"
```

## ✅ Step-by-Step Fix

### Step 1: Run This Query First
```sql
-- Check the problematic profile
SELECT id, full_name, experience_level, LENGTH(experience_level), ASCII(experience_level)
FROM profiles 
WHERE full_name = 'Richard Makwangwala';
```

### Step 2: Clean Up the Data
```sql
-- Remove all constraints first
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_experience_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_availability_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_startup_stage_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Clean the specific problematic row
UPDATE profiles 
SET experience_level = 'Beginner (0-2 years)' 
WHERE full_name = 'Richard Makwangwala' AND experience_level IS NOT NULL;

-- Clean all experience_level data
UPDATE profiles SET experience_level = TRIM(experience_level) WHERE experience_level IS NOT NULL;
UPDATE profiles SET experience_level = 'Beginner (0-2 years)' WHERE LOWER(TRIM(experience_level)) LIKE '%beginner%';
UPDATE profiles SET experience_level = 'Intermediate (3-5 years)' WHERE LOWER(TRIM(experience_level)) LIKE '%intermediate%';
UPDATE profiles SET experience_level = 'Expert (10+ years)' WHERE LOWER(TRIM(experience_level)) LIKE '%expert%';
```

### Step 3: Add Constraints Back
```sql
-- Add constraints with NULL handling
ALTER TABLE profiles ADD CONSTRAINT profiles_experience_level_check 
CHECK (experience_level IN ('Beginner (0-2 years)', 'Intermediate (3-5 years)', 'Senior (6-10 years)', 'Expert (10+ years)', 'Serial Entrepreneur') OR experience_level IS NULL);

ALTER TABLE profiles ADD CONSTRAINT profiles_availability_check 
CHECK (availability IN ('Full-time', 'Part-time', 'Open to Discuss', 'Consulting', 'Equity Only', 'Sweat Equity', 'Paid Role') OR availability IS NULL);

ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('founder', 'cofounder', 'investor'));
```

### Step 4: Add New Columns
```sql
-- Add the new columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS company_size TEXT,
ADD COLUMN IF NOT EXISTS funding_stage TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add constraints for new columns
ALTER TABLE profiles ADD CONSTRAINT profiles_company_size_check 
CHECK (company_size IN ('Solo Founder', '2-3 People', '4-10 People', '11-50 People', '50+ People') OR company_size IS NULL);

ALTER TABLE profiles ADD CONSTRAINT profiles_funding_stage_check 
CHECK (funding_stage IN ('Bootstrapped', 'Pre-Revenue', 'Revenue Generating', 'Profitable', 'Seeking Investment', 'Recently Funded') OR funding_stage IS NULL);
```

### Step 5: Add Indexes and Triggers
```sql
-- Add indexes
CREATE INDEX IF NOT EXISTS idx_profiles_availability ON profiles(availability);
CREATE INDEX IF NOT EXISTS idx_profiles_experience_level ON profiles(experience_level);
CREATE INDEX IF NOT EXISTS idx_profiles_company_size ON profiles(company_size);
CREATE INDEX IF NOT EXISTS idx_profiles_funding_stage ON profiles(funding_stage);

-- Add update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update existing records
UPDATE profiles SET updated_at = created_at WHERE updated_at IS NULL;
```

## ✅ Verification
```sql
-- Check that everything worked
SELECT 
  COUNT(*) as total_profiles,
  COUNT(*) FILTER (WHERE company_size IS NOT NULL) as with_company_size,
  COUNT(*) FILTER (WHERE funding_stage IS NOT NULL) as with_funding_stage,
  COUNT(*) FILTER (WHERE updated_at IS NOT NULL) as with_updated_at
FROM profiles;

-- Check the specific profile is fixed
SELECT full_name, experience_level, availability, role 
FROM profiles 
WHERE full_name = 'Richard Makwangwala';
```

## 🎉 Done!
Your database should now be fully migrated and ready to use with all the new features!

---

**Pro Tip**: Always run `pre-migration-check.sql` before future migrations to catch issues early!