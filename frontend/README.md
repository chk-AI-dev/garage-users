# Garage Users Frontend

A modern React-based frontend for the Garage Users management application.

## Features

- User Authentication (Login/Register)
- Password Reset Functionality
- User Dashboard
- Admin Dashboard with User Management
- Profile Management with Image Upload
- Role-Based Access Control
- Responsive Modern UI

## Prerequisites

- Node.js (v14+)
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

3. Configure your backend API URL in `.env`

4. Start the development server:
```bash
npm run dev
```

The app will run on `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── pages/              # Page components
│   ├── components/         # Reusable components
│   ├── context/           # React context
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utility functions
│   ├── styles/            # CSS files
│   ├── App.jsx
│   └── main.jsx
├── public/
├── vite.config.js
├── package.json
├── .env.sample
└── README.md
```

## Pages

- **Login** - User login page
- **Register** - User registration page
- **Forgot Password** - Password recovery
- **User Dashboard** - Personal user dashboard
- **Admin Dashboard** - Admin management panel
- **User Management** - CRUD operations for users
- **Profile** - User profile and settings
- **Not Found** - 404 page

## Components

- `Header` - Navigation header
- `Navbar` - Navigation menu
- `LoadingSpinner` - Loading indicator
- `Toast` - Notification system
- `ProtectedRoute` - Route protection component
- `Card` - Reusable card component
- `Modal` - Dialog component

## Authentication

The app uses JWT token-based authentication. Tokens are stored in localStorage and sent with every API request.

## API Integration

All API calls are made using axios with automatic token attachment to requests.

## Role-Based Access

- **Admin** - Full access to all features
- **Supervisor** - User list and management
- **Driver** - Personal dashboard and profile
- **Operator** - Personal dashboard and profile
