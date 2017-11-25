CREATE TABLE IF NOT EXISTS Person
(
    PersonId SERIAL PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    ContactNumber VARCHAR(50),
    ContactEmail VARCHAR(100),
    Age VARCHAR(50),
    Occupation VARCHAR(100),
    EventId VARCHAR(100)
);