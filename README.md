# Multi-Level Category Management API

A robust REST API built with Node.js, Express, TypeScript, Mongoose, and Redis to manage a multi-level hierarchical category system. This application allows creating infinitely nested subcategories and guarantees efficient read operations by utilizing in-memory caching.

## Features

- **Nested Categories:** Create categories with multi-level parent-child relationships.
- **Tree-Structure API:** Retrieve all active categories directly assembled into a recursive tree format.
- **Ancestry Retrieval:** Fetch a specific category and get its full parent-hierarchy up to the root element.
- **Cascading Deactivation:** Safely deactivate a category, automatically suspending all of its nested descendant categories.
- **Redis Caching:** Accelerates `GET` requests and automatically invalidates caching via Redis when mutations occur.
- **Data Validation:** Bulletproof input validation via `zod`.

## Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (via `mongoose`)
- **Cache**: Redis
- **Validation**: Zod

---

## Prerequisites

Before starting, make sure you have installed the following on your system:
- **Node.js** (v18 or higher)
- **MongoDB** (Running locally or via Atlas)
- **Redis Server** (Running locally on port 6379)

---

## Installation & Setup Guide

### 1. Clone & Install Dependencies
First, install all the necessary node modules:
```bash
npm install
```

### 2. Configure Environment Variables
Copy the example environment file and create your `.env` file:
```bash
cp .env.example .env
```
Open the `.env` file and replace `DATABASE_URL` with your actual MongoDB connection string if different from the default.

### 3. Start Redis Server
Ensure your Redis instance is running in the background:
```bash
sudo systemctl start redis-server
# Or using Docker:
# docker run -p 6379:6379 -d redis
```

### 4. Run the Development Server
You can boot the API with automatic restart on file changes using nodemon:
```bash
npm run dev
```
The server will now listen on `http://localhost:3000`.

### 5. Seed the Database (Optional)
If you want to instantly generate a 7-level nested category tree structure (Electronics > Computers > Laptops, etc) for testing:
```bash
npm run seed
```

### 6. Build for Production
To compile the TypeScript project into JavaScript for production deployment:
```bash
npm run build
```
You can then start the built project using `npm start`.

---

## API Endpoints Overview

We have provided a convenient `http-requests/categories.http` file containing all the endpoints. You can use the VS Code **REST Client** extension to execute these directly.

| Method | Endpoint                             | Description                                                                 |
|--------|--------------------------------------|-----------------------------------------------------------------------------|
| POST   | `/api/categories`                    | Create a new category (pass `parentId` for subcategories)                   |
| GET    | `/api/categories`                    | Retrieve all active categories in a fully nested Tree format (Cached)       |
| GET    | `/api/categories/:id`                | Get a single category and its entire parent hierarchy (Cached)              |
| PUT    | `/api/categories/:id`                | Update a category name or its parent connection                             |
| PATCH  | `/api/categories/:id/deactivate`     | Deactivate a category. Automatically cascades to all descendants.           |
