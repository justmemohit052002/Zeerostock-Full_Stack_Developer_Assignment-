# 🎓 Student Management System

A Full Stack Student Management System built using **React.js, Node.js, Express.js, and PostgreSQL**.

The application allows users to manage student records, perform CRUD operations, maintain subject-wise marks, search students, and view detailed academic information through a responsive and user-friendly interface.

---

## 🚀 Features

### Student Management

* Create a new student
* View all students
* View student details
* Update student information
* Delete student

### Marks Management

* Add marks for a student
* Update marks
* Delete marks
* View subject-wise marks

### Additional Features

* Pagination
* Search by student name or email
* Form validation
* Global error handling
* Responsive UI
* Toast notifications
* Loading states
* PostgreSQL database integration

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript (ES6+)
* CSS

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL

### Tools

* VS Code
* Postman
* Git & GitHub

---

## 📁 Project Structure

```text
student-management-system
│
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── routes
│   │   ├── services
│   │   ├── middleware
│   │   ├── db
│   │   └── app.js
│   │
│   ├── schema.sql
│   ├── .env.example
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   └── App.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# ⚙️ Database Setup

### Create Database

```sql
CREATE DATABASE student_management;
```

### Run Schema

```bash
psql -U postgres -d student_management -f schema.sql
```

---

## 📄 Database Schema

### Students Table

```sql
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INTEGER NOT NULL
);
```

### Marks Table

```sql
CREATE TABLE marks (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    subject VARCHAR(100) NOT NULL,
    marks INTEGER NOT NULL,
    CONSTRAINT fk_student
        FOREIGN KEY(student_id)
        REFERENCES students(id)
        ON DELETE CASCADE
);
```

---

## 🔧 Backend Setup

### Install Dependencies

```bash
cd backend
npm install
```

### Create Environment File

Create a `.env` file inside the backend folder:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=student_management
```

### Start Backend Server

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

## 🎨 Frontend Setup

### Install Dependencies

```bash
cd frontend
npm install
```

### Start Frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 📌 API Documentation

## Student APIs

### Create Student

```http
POST /students
```

Request Body:

```json
{
  "full_name": "Mohit Chouhan",
  "email": "mohit@gmail.com",
  "age": 23
}
```

---

### Get All Students

```http
GET /students
```

---

### Get Student By Id

```http
GET /students/:id
```

---

### Update Student

```http
PUT /students/:id
```

Request Body:

```json
{
  "full_name": "Mohit Singh Chouhan",
  "email": "mohit@gmail.com",
  "age": 24
}
```

---

### Delete Student

```http
DELETE /students/:id
```

---

## Marks APIs

### Add Marks

```http
POST /students/:id/marks
```

Request Body:

```json
{
  "subject": "Math",
  "marks": 95
}
```

---

### Update Marks

```http
PUT /students/marks/:markId
```

Request Body:

```json
{
  "subject": "Math",
  "marks": 99
}
```

---

### Delete Marks

```http
DELETE /students/marks/:markId
```

---

## Search API

Search students by name or email.

```http
GET /students?search=mohit
```

Example:

```http
GET /students?search=gmail
```

---

## Pagination API

```http
GET /students?page=1&limit=5
```

Sample Response:

```json
{
  "pagination": {
    "totalRecords": 25,
    "currentPage": 1,
    "totalPages": 5,
    "limit": 5
  }
}
```

---

# ✅ Validation Rules

## Student Validation

* Full name is required
* Email is required
* Email must be valid
* Age must be greater than 0

## Marks Validation

* Subject is required
* Marks are required
* Marks must be between 0 and 100

---

# 🧪 API Testing

All APIs were tested using Postman.

### Tested Scenarios

✅ Create Student

✅ Get All Students

✅ Get Student By Id

✅ Update Student

✅ Delete Student

✅ Search Student

✅ Pagination

✅ Add Marks

✅ Update Marks

✅ Delete Marks

✅ Invalid Email Validation

✅ Invalid Marks Validation

✅ Student Not Found

✅ Invalid Student Id

---

# 🔒 Error Handling

Global error handling middleware is implemented.

Example Response:

```json
{
  "success": false,
  "message": "Student not found"
}
```

---

# 📸 Screenshots

Add screenshots of:

* Student Dashboard
* Add Student Form
* Student Details
* Add Marks
* Pagination
* Search Functionality
* Postman API Testing

---

# 📈 Future Enhancements

* JWT Authentication
* Role Based Access Control
* Export Student Records
* Dashboard Analytics
* Unit Testing
* Docker Deployment
* Cloud Hosting

---

# 👨‍💻 Author

**Mohit Singh Chouhan**

Java Full Stack Developer

**Tech Stack:** Java | Spring Boot | React.js | Node.js | PostgreSQL | REST APIs
