# Garage Users Backend API

A complete REST API for managing users with role-based authentication, built with Express.js and MongoDB.

## Features

- JWT Authentication
- Role-based Access Control (Admin, Supervisor, Driver, Operator)
- User Management (CRUD operations)
- Profile Management with Image Upload
- Password Reset and Forgot Password
- Protected Routes
- MongoDB Database Integration
- Error Handling and Validation

## Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.sample`:
```bash
cp .env.sample .env
```

3. Configure your MongoDB connection in `.env`

4. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## Project Structure

```
backend/
├── src/
│   ├── controllers/      # Route handlers
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── config/          # Configuration files
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── uploads/             # User profile images
├── package.json
├── .env.sample
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users (Protected)
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `PUT /api/users/:id/status` - Update user status (Admin only)

### Profile (Protected)
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update current user profile
- `POST /api/profile/upload-image` - Upload profile image
- `PUT /api/profile/change-password` - Change password

### Dashboard (Protected)
- `GET /api/dashboard/stats` - Get dashboard statistics

## Roles

- **Admin** - Full access to all features
- **Supervisor** - Manage users and view reports
- **Driver** - View personal profile and dashboard
- **Operator** - View personal profile and dashboard

## Error Handling

The API returns proper HTTP status codes and error messages:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

## Security

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- Role-based authorization middleware
- CORS configuration
- File upload validation
