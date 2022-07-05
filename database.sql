CREATE DATABASE students;

CREATE TABLE students_data (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(8, 20) NOT NULL 
);