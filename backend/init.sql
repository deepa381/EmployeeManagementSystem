-- =============================================================
-- init.sql — Runs automatically when MySQL container starts
-- for the first time. Creates the employees table.
-- =============================================================

CREATE DATABASE IF NOT EXISTS employee_db;
USE employee_db;

CREATE TABLE IF NOT EXISTS employees (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    phone         VARCHAR(20),
    department    VARCHAR(100),
    designation   VARCHAR(100),
    salary        DECIMAL(12, 2),
    joining_date  DATE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert a few sample employees so the table is not empty on first run
INSERT INTO employees (full_name, email, phone, department, designation, salary, joining_date) VALUES
('Alice Johnson',  'alice@example.com',  '9876543210', 'Engineering',  'Software Engineer',    75000.00, '2023-01-15'),
('Bob Smith',      'bob@example.com',    '9123456780', 'Marketing',    'Marketing Manager',    65000.00, '2022-06-01'),
('Carol Williams', 'carol@example.com',  '9012345678', 'HR',           'HR Specialist',        55000.00, '2021-09-10'),
('David Lee',      'david@example.com',  '8765432190', 'Engineering',  'DevOps Engineer',      80000.00, '2023-03-22'),
('Eva Martinez',   'eva@example.com',    '8901234567', 'Finance',      'Financial Analyst',    70000.00, '2020-11-05');
