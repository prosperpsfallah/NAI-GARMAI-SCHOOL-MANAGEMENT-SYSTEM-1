-- NAI GARMAI SCHOOL MANAGEMENT SYSTEM

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL
);

CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    class_name VARCHAR(100) NOT NULL
);

CREATE TABLE instructors (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    employee_id VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE subjects (
    id INTEGER PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL
);

CREATE TABLE grades (
    id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    instructor_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    submitted_at TIMESTAMP,
    approved_at TIMESTAMP
);

CREATE TABLE attendance (
    id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    instructor_id INTEGER NOT NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL
);