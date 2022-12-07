-- You will have to research PostgreSQL pattern matching in addition to array functions and operators.
-- You may also find it helpful to do some research on “subqueries.”

-- FS1. Find the name and rating of the top rated apps in each category, among apps that have been installed at least 50,000 times.
SELECT DISTINCT ON (a1.category) a1.app_name, a1.rating FROM analytics a1
WHERE min_installs > 50000
AND rating = (
    SELECT MAX(rating) FROM analytics a2
    WHERE a1.category = a2.category
);


-- FS2. Find all the apps that have a name similar to “facebook”.
SELECT app_name FROM analytics
WHERE app_name ILIKE '%facebook%';


-- FS3. Find all the apps that have more than 1 genre.
SELECT app_name FROM analytics
WHERE ARRAY_LENGTH(genres, 1) > 1;

-- OR
SELECT app_name FROM analytics
WHERE CARDINALITY(genres) > 1;


-- FS4. Find all the apps that have education as one of their genres.
SELECT app_name FROM analytics
WHERE genres @> ARRAY['Education'];
