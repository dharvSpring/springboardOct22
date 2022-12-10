-- from the terminal run:
-- psql < air_traffic.sql

DROP DATABASE IF EXISTS air_traffic;

CREATE DATABASE air_traffic;

\c air_traffic

-- Create tables
CREATE TABLE passenger
(
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL
  -- DOB, etc
);

CREATE TABLE airline
(
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
  -- flight code, etc
);

CREATE TABLE country
(
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE city
(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  country INTEGER REFERENCES country(id)
);

CREATE TABLE flight
(
  id SERIAL PRIMARY KEY,
  departure TIMESTAMP NOT NULL,
  arrival TIMESTAMP NOT NULL,
  airline INTEGER REFERENCES airline(id),
  from_city INTEGER REFERENCES city(id),
  to_city INTEGER REFERENCES city(id)
);

CREATE TABLE ticket
(
  id SERIAL PRIMARY KEY,
  passenger INTEGER REFERENCES passenger(id),
  flight INTEGER REFERENCES flight(id),
  seat TEXT NOT NULL
);

-- Insert data
INSERT INTO passenger
  (first_name, last_name)
VALUES
  ('Jennifer', 'Finch'), -- 1
  ('Thadeus', 'Gathercoal'), -- 2
  ('Sonja', 'Pauley'), -- 3
  ('Waneta', 'Skeleton'), -- 4
  ('Berkie', 'Wycliff'), -- 5
  ('Alvin', 'Leathes'), -- 6
  ('Cory', 'Squibbes'); -- 7

INSERT INTO airline
  (name)
VALUES
  ('United'), -- 1
  ('British Airways'), -- 2
  ('Delta'), -- 3
  ('TUI Fly Belgium'), -- 4
  ('Air China'), -- 5
  ('American Airlines'), -- 6
  ('Avianca Brasil'); -- 7

INSERT INTO country
  (name)
VALUES
  ('United States'), -- 1
  ('Japan'), -- 2
  ('United Kingdom'), -- 3
  ('Mexico'), -- 4
  ('France'), -- 5
  ('Morocco'), -- 6
  ('UAE'), -- 7
  ('China'), -- 8
  ('Brazil'), -- 9
  ('Chile'); -- 10

INSERT INTO city
  (name, country)
VALUES
  ('Washington DC', 1), -- 1
  ('Seatle', 1), -- 2
  ('Tokyo', 2), -- 3
  ('London', 3), -- 4
  ('Los Angeles', 1), -- 5
  ('Las Vegas', 1), -- 6
  ('Mexico City', 4), -- 7
  ('Paris', 5), -- 8
  ('Casablanca', 6), -- 9
  ('Dubai', 7), -- 10
  ('Beijing', 8), -- 11
  ('New York', 1), -- 12
  ('Charlotte', 1), -- 13
  ('Cedar Rapids', 1), -- 14
  ('Chicago', 1), -- 15
  ('New Orleans', 1), -- 16
  ('Sao Paolo', 9), -- 17
  ('Santiago', 10); -- 18

INSERT INTO flight
  (departure, arrival, airline, from_city, to_city)
VALUES
  ('2018-04-08 09:00:00', '2018-04-08 12:00:00', 1, 1, 2),
  ('2018-12-19 12:45:00', '2018-12-19 16:15:00', 2, 3, 4),
  ('2018-01-02 07:00:00', '2018-01-02 08:03:00', 3, 5, 6),
  ('2018-04-15 16:50:00', '2018-04-15 21:00:00', 3, 2, 7),
  ('2018-08-01 18:30:00', '2018-08-01 21:50:00', 4, 8, 9),
  ('2018-10-31 01:15:00', '2018-10-31 12:55:00', 5, 10, 11),
  ('2019-02-06 06:00:00', '2019-02-06 07:47:00', 1, 12, 13),
  ('2018-12-22 14:42:00', '2018-12-22 15:56:00', 6, 14, 15),
  ('2019-02-06 16:28:00', '2019-02-06 19:18:00', 6, 13, 16),
  ('2019-01-20 19:30:00', '2019-01-20 22:45:00', 7, 17, 18);

INSERT INTO ticket
  (passenger, seat, flight)
VALUES
  (1, '33B', 1),
  (2, '8A', 2),
  (3, '12F', 3),
  (1, '20A', 4),
  (4, '23D', 5),
  (2, '18C', 6),
  (5, '9E', 7),
  (6, '1A', 8),
  (5, '32B', 9),
  (7, '10D', 10);

-- INSERT INTO tickets
--   (first_name, last_name, seat, departure, arrival, airline, from_city, from_country, to_city, to_country)
-- VALUES
--   ('Jennifer', 'Finch', '33B', '2018-04-08 09:00:00', '2018-04-08 12:00:00', 'United', 'Washington DC', 'United States', 'Seattle', 'United States'),
--   ('Thadeus', 'Gathercoal', '8A', '2018-12-19 12:45:00', '2018-12-19 16:15:00', 'British Airways', 'Tokyo', 'Japan', 'London', 'United Kingdom'),
--   ('Sonja', 'Pauley', '12F', '2018-01-02 07:00:00', '2018-01-02 08:03:00', 'Delta', 'Los Angeles', 'United States', 'Las Vegas', 'United States'),
--   ('Jennifer', 'Finch', '20A', '2018-04-15 16:50:00', '2018-04-15 21:00:00', 'Delta', 'Seattle', 'United States', 'Mexico City', 'Mexico'),
--   ('Waneta', 'Skeleton', '23D', '2018-08-01 18:30:00', '2018-08-01 21:50:00', 'TUI Fly Belgium', 'Paris', 'France', 'Casablanca', 'Morocco'),
--   ('Thadeus', 'Gathercoal', '18C', '2018-10-31 01:15:00', '2018-10-31 12:55:00', 'Air China', 'Dubai', 'UAE', 'Beijing', 'China'),
--   ('Berkie', 'Wycliff', '9E', '2019-02-06 06:00:00', '2019-02-06 07:47:00', 'United', 'New York', 'United States', 'Charlotte', 'United States'),
--   ('Alvin', 'Leathes', '1A', '2018-12-22 14:42:00', '2018-12-22 15:56:00', 'American Airlines', 'Cedar Rapids', 'United States', 'Chicago', 'United States'),
--   ('Berkie', 'Wycliff', '32B', '2019-02-06 16:28:00', '2019-02-06 19:18:00', 'American Airlines', 'Charlotte', 'United States', 'New Orleans', 'United States'),
--   ('Cory', 'Squibbes', '10D', '2019-01-20 19:30:00', '2019-01-20 22:45:00', 'Avianca Brasil', 'Sao Paolo', 'Brazil', 'Santiago', 'Chile');