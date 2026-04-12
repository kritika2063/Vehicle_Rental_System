CREATE DATABASE IF NOT EXISTS vehicle_rental;

USE vehicle_rental;

CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type ENUM('Motorcycle', 'Car', 'SUV', 'Van', 'Truck') NOT NULL,
    fuel_type VARCHAR(50) NOT NULL DEFAULT 'Petrol',
    seats INT NOT NULL DEFAULT 5,
    price_per_day DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    available TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- Google's permanent unique ID for this user (from JWT field: sub)
    -- This is how we identify the user on every login instead of a password
    google_id VARCHAR(255) NOT NULL UNIQUE,

    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL,       -- full name from Google (field: name)
    given_name VARCHAR(100),              -- first name (field: given_name)
    family_name VARCHAR(100),             -- last name (field: family_name)
    picture VARCHAR(500),                 -- profile photo URL (field: picture)

    -- Whether Google has verified this email (field: email_verified)
    email_verified TINYINT(1) DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
