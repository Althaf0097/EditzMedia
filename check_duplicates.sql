-- Check for duplicate categories
SELECT name, COUNT(*)
FROM categories
GROUP BY name
HAVING COUNT(*) > 1;

-- List all categories to see what's there
SELECT * FROM categories ORDER BY name;
