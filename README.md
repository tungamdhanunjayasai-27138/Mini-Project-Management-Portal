# Setup

## Backend
```bash
cd backend
npm install
```

## Frontend
```bash
cd frontend
npm install
```

# MySQL schema

```sql
CREATE DATABASE IF NOT EXISTS project_management_portal;
USE project_management_portal;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Pending','In Progress','Completed') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT,
    CONSTRAINT fk_user
      FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
);
```

If `tasks` already exists:

```sql
ALTER TABLE tasks
ADD COLUMN user_id INT,
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;
```

# Authentication setup

All task routes are protected and require:

```http
Authorization: Bearer <token>
```

JWT is returned by:

- `POST /api/auth/register`
- `POST /api/auth/login`

# Environment variables

Create `backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=project_management_portal
JWT_SECRET=your_jwt_secret
```

# npm install

```bash
cd backend && npm install
cd frontend && npm install
```

# npm run dev / npm start

## Backend
```bash
cd backend
npm start
```

## Frontend
```bash
cd frontend
npm run dev
```

# API endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `GET /api/tasks`
- `GET /api/tasks/stats`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

# Example API requests

## Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Asha",
  "email": "asha@example.com",
  "password": "secret123"
}
```

## Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "asha@example.com",
  "password": "secret123"
}
```

## Create task

```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Prepare sprint board",
  "description": "Create the sprint board and assign all work items for the next cycle.",
  "status": "Pending"
}
```

## Search, pagination, and sort

```http
GET /api/tasks?search=sprint&page=1&limit=10&sort=newest&status=Pending
Authorization: Bearer <token>
```

# Login flow

1. Register or login from the frontend.
2. Save the returned JWT in `localStorage`.
3. Send the token in the `Authorization` header for protected requests.
4. Redirect unauthenticated users to `/login`.

# Folder structure

```text
project-root/
|
|-- frontend/
|   |-- src/
|   |-- components/
|   |-- pages/
|   `-- services/
|
|-- backend/
|   |-- routes/
|   |-- controllers/
|   |-- models/
|   `-- config/
|
`-- README.md
```
