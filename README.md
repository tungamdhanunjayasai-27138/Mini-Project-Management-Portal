# Mini Project Management Portal

A full-stack task management application built with **React**, **Node.js**, **Express**, and **MySQL**. The application allows users to create, manage, update, and organize tasks through a responsive interface backed by RESTful APIs.

---

## Features

### Core Features

- View all tasks
- Create new tasks
- Update task status
- Delete tasks
- Filter tasks by status
- Responsive user interface
- Form validation
- Loading indicators and empty state handling

### Advanced Features

- User Registration and Login
- JWT Authentication
- Protected Routes
- Search Tasks
- Pagination
- Sort by Created Date
- Dashboard Statistics
- User-specific Task Management

---

# Folder Structure

```text
project-root/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── config/
│
└── README.md
```

---

# Setup Instructions

## 1. Clone the Repository

```bash
git clone <repository-url>
```

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

## 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

# Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=project_management_portal

JWT_SECRET=your_jwt_secret
```

---

# Running the Application

## Start Backend

```bash
cd backend
npm start
```

or

```bash
npm run dev
```

## Start Frontend

```bash
cd frontend
npm run dev
```

---

# Assumptions

- MySQL Server is installed and running locally.
- The `project_management_portal` database has been created.
- Database credentials are configured correctly in the `.env` file.
- Users can only access and manage their own tasks after authentication.
- Frontend and backend run on separate local development servers.

---

# API Documentation

## Authentication

### Register

```
POST /api/auth/register
```

### Login

```
POST /api/auth/login
```

### Get User Profile

```
GET /api/auth/profile
```

Requires JWT authentication.

---

## Tasks

### Get All Tasks

```
GET /api/tasks
```

Supports optional query parameters:

- `search`
- `status`
- `page`
- `limit`
- `sort`

Example:

```
GET /api/tasks?search=project&page=1&limit=10&sort=newest&status=Pending
```

---

### Create Task

```
POST /api/tasks
```

Example Request:

```json
{
  "title": "Design Dashboard",
  "description": "Create a responsive dashboard interface with statistics and task management features.",
  "status": "Pending"
}
```

---

### Update Task

```
PUT /api/tasks/:id
```

Example Request:

```json
{
  "status": "Completed"
}
```

---

### Delete Task

```
DELETE /api/tasks/:id
```

---

### Dashboard Statistics

```
GET /api/tasks/stats
```

Returns the total number of tasks and counts by status.

---

# Validation

- Task title is required.
- Task description must contain at least 20 characters.
- Email must be valid.
- Password must meet minimum length requirements.
- Protected endpoints require a valid JWT token.

---

# Technology Stack

## Frontend

- React.js
- React Router
- Axios
- HTML5
- CSS3
- JavaScript (ES6+)

## Backend

- Node.js
- Express.js

## Database

- MySQL

## Authentication

- JSON Web Tokens (JWT)
- bcrypt

---

# Notes

This project implements all essential task management functionality and extends it with advanced features such as authentication, user-specific task management, search, pagination, sorting, and dashboard statistics. The application follows a modular architecture with a focus on maintainability, scalability, and clean code practices.
