-- Diagnose exactly what's causing the constraint violation

-- 1. Show ALL experience_level values (including problematic ones)
SELECT 'ALL experience_level values in database:' as info;
SELECT 
    experience_level,
    COUNT(*) as count,
    LENGTH(experience_level) as char_length,
    ASCII(LEFT(experience_level, 1)) as first_char_ascii,
    CASE 
        WHEN experience_level = 'Beginner' THEN '✓ VALID'
        WHEN experience_level = 'Intermediate' THEN '✓ VALID'
        WHEN experience_level = 'Expert' THEN '✓ VALID'
        WHEN experience_level IS NULL THEN '✓ NULL (OK)'
        ELSE '✗ INVALID'
    END as status
FROM profiles 
WHERE role = 'cofounder'
GROUP BY experience_level
ORDER BY experience_level;

-- 2. Show exact problematic rows with all details
SELECT 'Problematic rows with full details:' as info;
SELECT 
    id,
    full_name,
    experience_level,
    LENGTH(experience_level) as length,
    ENCODE(experience_level::bytea, 'hex') as hex_value,
    created_at
FROM profiles 
WHERE role = 'cofounder' 
AND experience_level IS NOT NULL 
AND experience_level NOT IN ('Beginner', 'Intermediate', 'Expert')
ORDER BY created_at DESC;

-- 3. Check for hidden characters or encoding issues
SELECT 'Checking for hidden characters:' as info;
SELECT 
    experience_level,
    REPLACE(REPLACE(REPLACE(experience_level, ' ', '[SPACE]'), CHR(9), '[TAB]'), CHR(10), '[NEWLINE]') as with_visible_whitespace
FROM profiles 
WHERE role = 'cofounder' 
AND experience_level IS NOT NULL 
AND experience_level NOT IN ('Beginner', 'Intermediate', 'Expert')
GROUP BY experience_level;

-- 4. Show what the constraint expects vs what exists
SELECT 'Expected vs Actual values:' as comparison;
SELECT 'Expected' as type, unnest(ARRAY['Beginner', 'Intermediate', 'Expert']) as value
UNION ALL
SELECT 'Actual' as type, experience_level as value
FROM profiles 
WHERE role = 'cofounder' AND experience_level IS NOT NULL
GROUP BY experience_level
ORDER BY type, value;

-- 5. Count total cofounders and their experience distribution
SELECT 'Cofounder experience distribution:' as info;
SELECT 
    COUNT(*) as total_cofounders,
    COUNT(CASE WHEN experience_level IS NULL THEN 1 END) as null_experience,
    COUNT(CASE WHEN experience_level = 'Beginner' THEN 1 END) as beginners,
    COUNT(CASE WHEN experience_level = 'Intermediate' THEN 1 END) as intermediate,
    COUNT(CASE WHEN experience_level = 'Expert' THEN 1 END) as experts,
    COUNT(CASE WHEN experience_level NOT IN ('Beginner', 'Intermediate', 'Expert') AND experience_level IS NOT NULL THEN 1 END) as invalid_values
FROM profiles 
WHERE role = 'cofounder';

SELECT 'Diagnosis complete. Use the results above to understand what needs to be fixed.' as result;