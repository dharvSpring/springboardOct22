-- CREATE TABLE owners (
--     id SERIAL PRIMARY KEY, 
--     first_name TEXT, 
--     last_name TEXT);

-- CREATE TABLE vehicles (
--     id SERIAL PRIMARY KEY, 
--     make TEXT, 
--     model TEXT, 
--     year INTEGER, 
--     price REAL, 
--     owner_id INTEGER REFERENCES owners (id));

\c joins_exercise

-- Join the two tables so that every column and record appears, regardless of if there is not an owner_id.
SELECT * FROM owners
FULL OUTER JOIN vehicles ON owners.id = vehicles.owner_id;


-- Count the number of cars for each owner.
-- Display the owners first_name, last_name and count of vehicles.
-- The first_name should be ordered in ascending order.
SELECT o.first_name, o.last_name, COUNT(*) FROM owners o
JOIN vehicles ON o.id = vehicles.owner_id
GROUP BY o.id
ORDER BY o.first_name;

-- This one counts that owner Maya Malarkin has 0 vehicles
SELECT o.first_name, o.last_name, COUNT(vehicles.id) FROM owners o
LEFT OUTER JOIN vehicles ON o.id = vehicles.owner_id
GROUP BY o.id
ORDER BY o.first_name;


-- Count the number of cars for each owner and display the average price for each of the cars as integers. 
-- Display the owners first_name, last_name, average price and count of vehicles. 
-- The first_name should be ordered in descending order. 
-- Only display results with more than one vehicle and an average price greater than 10000.
SELECT o.first_name, o.last_name, ROUND(AVG(v.price)) AS avg_price, COUNT(v.id)
FROM owners o
JOIN vehicles v ON o.id = v.owner_id
GROUP BY (o.first_name, o.last_name)
HAVING COUNT(v.id) > 1 AND ROUND(AVG(v.price)) > 10000
ORDER BY o.first_name DESC;