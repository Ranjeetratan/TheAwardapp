-- Check email-related data in database
-- Run this to see profile data that should trigger emails

-- 1. Check auto-approval setting
SELECT 'Auto-approval setting:' as info;
SELECT 
    setting_key,
    setting_value,
    CASE 
        WHEN setting_value = true THEN 'ON - Emails sent immediately on profile submission'
        ELSE 'OFF - Emails only sent after manual approval'
    END as email_behavior
FROM admin_settings 
WHERE setting_key = 'auto_approve_profiles';

-- 2. Check recent profile submissions that should have triggered emails
SELECT 'Recent approved profiles (should have received emails):' as info;
SELECT 
    id,
    full_name,
    email,
    role,
    approved,
    created_at,
    CASE 
        WHEN approved = true THEN 'Should have received welcome email'
        ELSE 'No email sent (not approved)'
    END as email_status
FROM profiles 
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 10;

-- 3. Check for profiles with missing email addresses
SELECT 'Profiles with missing email addresses:' as info;
SELECT 
    id,
    full_name,
    email,
    role,
    approved
FROM profiles 
WHERE email IS NULL OR email = ''
ORDER BY created_at DESC
LIMIT 5;

-- 4. Count profiles by approval status
SELECT 'Profile approval status breakdown:' as info;
SELECT 
    approved,
    COUNT(*) as count,
    CASE 
        WHEN approved = true THEN 'These profiles should have received emails'
        ELSE 'These profiles have not received emails yet'
    END as email_expectation
FROM profiles 
GROUP BY approved;

-- 5. Check recent manual approvals (admin panel activity)
SELECT 'Recent profile updates (potential manual approvals):' as info;
SELECT 
    id,
    full_name,
    email,
    approved,
    created_at,
    -- Note: We don't have updated_at field, so this is approximate
    CASE 
        WHEN approved = true AND created_at < NOW() - INTERVAL '1 hour' 
        THEN 'Likely manually approved - should have received email'
        ELSE 'Auto-approved or recently created'
    END as approval_type
FROM profiles 
WHERE approved = true
ORDER BY created_at DESC
LIMIT 10;

SELECT 'Email configuration check completed!' as result;
SELECT 'Next steps: Check browser console for email sending logs when submitting/approving profiles' as recommendation;