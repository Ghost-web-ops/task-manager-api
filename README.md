# Task Manager API

This is the backend RESTful API for a full-stack task management application, inspired by Trello. It is built with Node.js, Express, and PostgreSQL, featuring JWT-based authentication and Google OAuth.

---

## Features

- **User Authentication:** Secure user registration and login using email/password.
- **JWT Authentication:** Protected routes using JSON Web Tokens.
- **Google OAuth 2.0:** Sign up and log in with a Google account.
- **CRUD Operations for:**
  - Boards
  - Lists (Columns)
  - Cards (Tasks)
- **Drag & Drop Support:** Endpoint to update card positions between lists.

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** `jsonwebtoken` (JWT), `passport`, `passport-google-oauth20`, `bcryptjs`
- **Database Client:** `pg` (node-postgres)
- **Environment Variables:** `dotenv`

---

## Setup and Installation

Follow these steps to get the project running locally.

### 1. Prerequisites

- Node.js (v18 or later)
- PostgreSQL installed and running locally or on a service like Neon.

### 2. Clone the Repository

```bash
git clone [https://github.com/your-username/task-manager-api.git](https://github.com/your-username/task-manager-api.git)
cd task-manager-api
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Database

- Create a new PostgreSQL database.
- Run the `schema.sql` script provided in the repository to create all the necessary tables.

### 5. Configure Environment Variables

- Create a `.env` file in the root of the project.
- Copy the content of `.env.example` (if present) or use the structure below and fill in your details.

```env
# PostgreSQL Database Connection
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/YOUR_DATABASE_NAME"

# JSON Web Token Secret
JWT_SECRET="YOUR_SUPER_SECRET_RANDOM_KEY"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
```

### 6. Run the Development Server

```bash
npm run dev
```

The server will be running on `http://localhost:5000` (or the port specified in your `.env` file).

---

## API Endpoints

A brief overview of the available API routes:

- **Auth:**
  - `POST /api/register`
  - `POST /api/login`
  - `GET /api/auth/google`
  - `GET /api/auth/google/callback`
- **Users:**
  - `GET /api/me` (Protected)
- **Boards:**
  - `GET /api/boards` (Protected)
  - `POST /api/boards` (Protected)
- **Lists & Cards:**
  - `GET /api/boards/:boardId/lists` (Protected)
  - `POST /api/lists` (Protected)
  - `POST /api/cards` (Protected)
  - `PATCH /api/cards/:cardId` (Protected)
