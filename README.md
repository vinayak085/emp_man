# Employee Management System — MERN Stack

A complete, production-grade, functional, and responsive **Employee Management System** built with the **MERN** stack (MongoDB Atlas, Express.js, React.js with Vite, and Node.js).

The system allows users to seamlessly create, view, update, delete, search, and paginate employee records with server-side filtering, sorting, and robust validation.

---

## Table of Contents

- [🚀 Quick Start (Run Now)](#-quick-start-run-now)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Prerequisites](#prerequisites)
- [MongoDB Atlas Integration & Status](#mongodb-atlas-integration--status)
- [Environment Variables Configuration](#environment-variables-configuration)
- [Installation and Setup](#installation-and-setup)
- [How to Start the Project (Detailed Guide)](#how-to-start-the-project-detailed-guide)
- [Database Seeding](#database-seeding)
- [Running Automated Tests](#running-automated-tests)
- [REST API Documentation](#rest-api-documentation)
- [Search and Pagination Details](#search-and-pagination-details)
- [Security and Error Handling](#security-and-error-handling)
- [Troubleshooting & FAQs](#troubleshooting--faqs)

---

## 🚀 Quick Start (Run Now)

If dependencies are already installed and your `.env` is configured, you can launch both services in two commands:

### Method 1: Running from the Project Root

Open two terminal windows in the `employee_management` root directory:

**Terminal 1 (Backend API):**
```bash
npm run dev:backend
```
*Backend runs at [http://localhost:5000](http://localhost:5000)*

**Terminal 2 (Frontend UI):**
```bash
npm run dev:frontend
```
*Frontend opens at [http://localhost:5173](http://localhost:5173)*

---

### Method 2: Running from Subdirectories

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

> **Direct Access**: Once started, open **[http://localhost:5173](http://localhost:5173)** in your browser to view the application.

---

## Features

### 1. Complete Employee CRUD Operations
- **Create**: Add new employees with name, email, and job designation. Validates input formats and rejects duplicate emails proactively.
- **Read & List**: View paginated employee records in a modern responsive table with avatars, email links, and timestamp formatting.
- **Read Details**: View rich employee profile dialog with full details and copyable MongoDB ObjectId.
- **Update**: Edit any existing employee with pre-filled forms and collision-safe email uniqueness checks.
- **Delete**: Remove employee records with a confirmation safety modal to prevent accidental deletion.

### 2. Search & Server-Side Filtering
- Search across **Employee Name**, **Email Address**, and **Designation / Role**.
- Case-insensitive search regex matching executed directly on the server before pagination.
- **300ms Debounce** on input to prevent redundant API queries.
- Instant automatic reset to Page 1 on query changes.
- Informative empty-state screens for no search results with a single-click "Clear Search" button.

### 3. Server-Side Pagination & Sorting
- Dynamic page navigation (First, Previous, Next, Last, and numbered buttons).
- Configurable page size (5, 10, 20, 50 records per page).
- Live count of showing records (`Showing X to Y of Z employees`).
- Sort by Creation Date, Name, Designation, or Email (Ascending & Descending).

### 4. Modern, Responsive Frontend
- Built with **React 18**, **Vite**, and **Tailwind CSS**.
- Sleek iconography via **Lucide React**.
- Real-time MongoDB connection indicator pill.
- Responsive layout with desktop table view and mobile/tablet card view.
- Non-blocking floating Toast notification system for success, error, and info updates.
- Loading skeletons and prevention of duplicate form submissions (`disabled` buttons + loading spinners).

---

## Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Language**: JavaScript (ES6+ Modules)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios with configured request timeouts and error normalizing
- **Hooks**: React standard hooks (`useState`, `useEffect`, `useCallback`, `useRef`, `useMemo`) + custom `useDebounce`

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB Atlas via Mongoose ODM
- **Environment Management**: `dotenv`
- **Security & Utilities**: CORS, Morgan HTTP logger, centralized error middleware
- **Testing**: Jest, Supertest, MongoDB Memory Server

---

## Project Architecture

```
employee_management/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas connection & in-memory fallback
│   ├── controllers/
│   │   └── employeeController.js # CRUD, pagination, search, and stats handlers
│   ├── middleware/
│   │   └── errorMiddleware.js    # 404 handler & centralized error handler
│   ├── models/
│   │   └── Employee.js           # Mongoose model with validations & indexes
│   ├── routes/
│   │   └── employeeRoutes.js     # RESTful Express route definitions
│   ├── tests/
│   │   └── employee.test.js      # 15 automated integration tests
│   ├── .env                      # Environment variables (git-ignored)
│   ├── .env.example              # Environment variables template
│   ├── .gitignore                # Git ignore rules for backend
│   ├── package.json              # Backend dependencies and scripts
│   ├── seed.js                   # 15-record sample database seeder
│   └── server.js                 # Express server configuration & entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DeleteConfirmModal.jsx
│   │   │   ├── EmployeeModal.jsx
│   │   │   ├── EmployeeTable.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── StatsCards.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── ViewEmployeeModal.jsx
│   │   ├── hooks/
│   │   │   └── useDebounce.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
├── package.json
└── README.md
```

---

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- A **MongoDB Atlas** account (free tier cluster works great) or a local MongoDB instance.

---

## MongoDB Atlas Integration & Status

The application is connected directly to MongoDB Atlas:

- **Cluster Host**: `cluster0.bfiqm7s.mongodb.net` (Shard: `ac-kaesh9c-shard-00-00.bfiqm7s.mongodb.net`)
- **Database Name**: `employee_management`
- **Collection**: `employees`
- **Live Connection Status**: `connected` (Health status: `ok` verified at `/api/health`)
- **Seeded Records**: 15 sample records currently active in the Atlas cloud database.

### MongoDB Atlas Setup & Configuration

1. **Database Access (User Credentials)**:
   - Configured in MongoDB Atlas under **Security** > **Database Access**.
   - The user must possess the `readWrite` role on `employee_management` (or `readWriteAnyDatabase`).
2. **Network Access (IP Access List)**:
   - Under **Security** > **Network Access**, ensure your current IP address (or `0.0.0.0/0` for development) is active.
3. **Canonical Connection String**:
   - Format:
     ```
     mongodb+srv://<username>:<password>@cluster0.bfiqm7s.mongodb.net/employee_management?retryWrites=true&w=majority
     ```

---

## Environment Variables Configuration

The backend environment is configured in `backend/.env` (based on `backend/.env.example`):

```env
# Server Port
PORT=5000

# Frontend URL for CORS
CLIENT_URL=http://localhost:5173

# MongoDB Atlas Credentials & Connection String
MONGODB_USERNAME=your_db_username
MONGODB_PASSWORD=your_db_password
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.bfiqm7s.mongodb.net/employee_management?retryWrites=true&w=majority

# Fallback in-memory database (set to false when using active Atlas connection)
USE_IN_MEMORY_DB=false
```

> **Security Guarantee:**
> - `backend/.env` is included in `.gitignore` and is strictly excluded from Git commits.
> - The database connection logic automatically masks credentials in console logs (`mongodb+srv://***:***@...`).
> - The application relies exclusively on `process.env.MONGODB_URI` without leaking secrets to the frontend.

---

## Installation and Setup

### 1. Clone or Open the Repository
```bash
cd employee_management
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## How to Start the Project (Detailed Guide)

Follow these steps to run the complete MERN application locally:

### Step 1: Start the Backend Server

1. Open your terminal or PowerShell and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Start the development server (runs with `nodemon` for auto-restart on file edits):
   ```bash
   npm run dev
   ```
   *(On Windows PowerShell, if script execution is restricted, run `npm.cmd run dev`)*

3. **Expected Terminal Output**:
   ```text
   [DB] Attempting connection to MongoDB: mongodb+srv://***:***@cluster0.bfiqm7s.mongodb.net/employee_management?retryWrites=true&w=majority
   [DB] MongoDB Atlas Connected successfully: ac-kaesh9c-shard-00-00.bfiqm7s.mongodb.net
   [Server] Server running in development mode on port 5000
   [Server] Health check: http://localhost:5000/api/health
   [Server] Employees API: http://localhost:5000/api/employees
   ```

4. **Verify Backend Status**:
   - Open [http://localhost:5000/api/health](http://localhost:5000/api/health) in your browser. You should see:
     ```json
     {"status": "ok", "database": "connected"}
     ```

---

### Step 2: Start the Frontend UI

1. Open a **second** terminal window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(Or `npm.cmd run dev` on Windows PowerShell)*

3. **Expected Terminal Output**:
   ```text
     VITE v6.4.4  ready in 1500 ms

     ➜  Local:   http://localhost:5173/
     ➜  Network: use --host to expose
   ```

---

### Step 3: Open and Use the Dashboard

1. Open your web browser and navigate to:
   👉 **[http://localhost:5173](http://localhost:5173)**
2. In the top navigation bar, verify the **"Atlas Connected"** green badge.
3. You can now create, view, search, paginate, edit, and delete employee records with live MongoDB Atlas cloud persistence.

---

### Alternative: Single Root Commands

You can also run both commands from the project root folder:

```bash
# Terminal 1:
npm run dev:backend

# Terminal 2:
npm run dev:frontend
```

## Database Seeding

To quickly test pagination, search, and sorting with 15 realistic employee profiles:

```bash
cd backend
npm run seed
```

This will clear existing records and insert 15 sample records across engineering, design, and management.

---

## Running Automated Tests

The backend includes a comprehensive integration test suite using **Jest**, **Supertest**, and **MongoDB Memory Server**.

```bash
cd backend
npm test
```

### Test Coverage Summary:
- `POST /api/employees`: Valid creation, missing fields rejection, invalid email rejection, duplicate email collision rejection.
- `GET /api/employees`: Server pagination, case-insensitive search by name, search by designation, empty search queries.
- `GET /api/employees/:id`: Valid ID retrieval, 400 invalid ObjectId format, 404 non-existent record.
- `PUT /api/employees/:id`: Record update, duplicate email collision rejection against existing records.
- `DELETE /api/employees/:id`: Successful deletion, 404 for already deleted or non-existent records.

---

## REST API Documentation

Base URL: `/api/employees`

### 1. Create Employee
- **Method**: `POST`
- **Endpoint**: `/api/employees`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "Sarah Connor",
    "email": "sarah.connor@example.com",
    "designation": "Senior DevOps Engineer"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Employee created successfully",
    "data": {
      "_id": "67123a4b9c1d2e3f4a5b6c7d",
      "name": "Sarah Connor",
      "email": "sarah.connor@example.com",
      "designation": "Senior DevOps Engineer",
      "createdAt": "2026-10-14T05:00:00.000Z",
      "updatedAt": "2026-10-14T05:00:00.000Z"
    }
  }
  ```

### 2. Get All Employees (Paginated & Searchable)
- **Method**: `GET`
- **Endpoint**: `/api/employees?page=1&limit=10&search=dev&sortBy=createdAt&order=desc`
- **Query Parameters**:
  | Param | Type | Default | Description |
  |---|---|---|---|
  | `page` | Integer | `1` | Page number |
  | `limit` | Integer | `10` | Records per page (max 100) |
  | `search` | String | `""` | Case-insensitive filter over name, email, designation |
  | `sortBy` | String | `createdAt` | Field to sort by (`name`, `email`, `designation`, `createdAt`) |
  | `order` | String | `desc` | Sort order (`asc` or `desc`) |
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "67123a4b9c1d2e3f4a5b6c7d",
        "name": "Sarah Connor",
        "email": "sarah.connor@example.com",
        "designation": "Senior DevOps Engineer",
        "createdAt": "2026-10-14T05:00:00.000Z",
        "updatedAt": "2026-10-14T05:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalRecords": 1,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
  ```

### 3. Get Single Employee by ID
- **Method**: `GET`
- **Endpoint**: `/api/employees/:id`
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "67123a4b9c1d2e3f4a5b6c7d",
      "name": "Sarah Connor",
      "email": "sarah.connor@example.com",
      "designation": "Senior DevOps Engineer",
      "createdAt": "2026-10-14T05:00:00.000Z",
      "updatedAt": "2026-10-14T05:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `{"success": false, "message": "Invalid employee ID format: 'xyz'"}`
  - `404 Not Found`: `{"success": false, "message": "Employee not found"}`

### 4. Update Employee
- **Method**: `PUT`
- **Endpoint**: `/api/employees/:id`
- **Request Body**:
  ```json
  {
    "name": "Sarah Connor-Reese",
    "email": "sarah.reese@example.com",
    "designation": "Director of DevOps"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Employee updated successfully",
    "data": { ... }
  }
  ```

### 5. Delete Employee
- **Method**: `DELETE`
- **Endpoint**: `/api/employees/:id`
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Employee deleted successfully",
    "data": { "id": "67123a4b9c1d2e3f4a5b6c7d" }
  }
  ```

### 6. Get Dashboard Stats
- **Method**: `GET`
- **Endpoint**: `/api/employees/stats`
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "totalEmployees": 15,
      "uniqueDesignationsCount": 14,
      "recentEmployeesCount": 15
    }
  }
  ```

---

## Security and Error Handling

1. **Credential Safety**:
   - Connection string logging sanitizes passwords automatically (`mongodb+srv://***:***@...`).
   - Credentials and environment secrets are never returned in API payloads or sent to frontend.
2. **Input Sanitization**:
   - All string inputs are trimmed.
   - Emails are converted to lowercase.
   - Emails are checked with strict regex formats before querying or storing.
3. **Mongoose Duplicate Key (11000) Handling**:
   - The central error handler intercepts duplicate index errors and returns HTTP `409 Conflict` with clear explanation.
4. **CORS Whitelisting**:
   - Configured to accept incoming requests from `http://localhost:5173` (defined via `CLIENT_URL`).
5. **Double Submit Prevention**:
   - Form buttons show loading spinners and are disabled while HTTP requests are pending.

---

## Troubleshooting & FAQs

### Problem: `MongoServerError: bad auth : authentication failed`
- **Solution**: Ensure your MongoDB Atlas user password is correct and contains URL-encoded special characters if needed. Verify username in `backend/.env`.

### Problem: `MongooseServerSelectionError: connect ECONNREFUSED`
- **Solution**: Check that your current IP address is whitelisted in MongoDB Atlas under **Network Access** (`0.0.0.0/0` allows connections from anywhere).

### Problem: Frontend says "Cannot reach backend server"
- **Solution**: Verify the backend is running (`cd backend && npm run dev`) and listening on port 5000. Check `http://localhost:5000/api/health`.

### Problem: PowerShell script execution disabled (`npm.ps1 cannot be loaded`)
- **Solution**: Run with `npm.cmd` directly or set PowerShell execution policy via:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
