# Garage Users - Full Stack Application

A complete full-stack user management system built with React.js frontend and Node.js + Express backend, featuring JWT authentication, role-based access control, and a responsive modern UI.

## Project Overview

This application provides a complete solution for managing garage employees with different roles and permissions. It includes user authentication, profile management, admin dashboard, and comprehensive user management capabilities.

## Project Overview

This application provides a complete solution for managing garage employees with different roles and permissions. It includes user authentication, profile management, admin dashboard, and comprehensive user management capabilities.

## Features

### Authentication
- ✓ JWT-based authentication
- ✓ User registration and login
- ✓ Forgot password and password reset
- ✓ Secure password hashing with bcryptjs
- ✓ Token-based session management

### User Management
- ✓ User registration with validation
- ✓ Profile management and updates
- ✓ Profile image upload
- ✓ Change password functionality
- ✓ Personal dashboard
- ✓ User information display

### Admin Features
- ✓ Admin dashboard with statistics
- ✓ User management (CRUD operations)
- ✓ User list with filtering and pagination
- ✓ User status management (active/inactive/suspended)
- ✓ Role assignment and modification
- ✓ User search and filtering

### Role-Based Access Control
- **Admin**: Full access to all features, user management
- **Supervisor**: Access to user lists and reports
- **Driver**: Personal dashboard and profile management
- **Operator**: Personal dashboard and profile management

### Technical Features
- ✓ REST API with Express.js
- ✓ MongoDB database integration
- ✓ Mongoose ODM
- ✓ File upload with Multer
- ✓ CORS enabled
- ✓ Environment-based configuration
- ✓ Error handling and validation
- ✓ React Router and navigation
- ✓ Axios API integration
- ✓ Toast notifications
- ✓ Loading states
- ✓ Responsive design
- ✓ Clean and scalable architecture

## Project Structure

```
garage-users/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   └── server.js        # Express server
│   ├── uploads/             # User profile images
│   ├── package.json
│   ├── .env.sample
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utilities (API, etc.)
│   │   ├── styles/          # CSS files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.sample
│   └── README.md
│
└── README.md (this file)
```

## Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas)
- Git

## Installation & Setup

### 1. Clone and Setup Backend

```bash
cd backend
npm install
cp .env.sample .env
```

Edit `.env` with your configuration:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/garage-users
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

Start the backend server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### 2. Setup Frontend

```bash
cd frontend
npm install
cp .env.sample .env
```

Edit `.env` with your API URL:
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Garage Users
```

Start the development server:
```bash
npm run dev
```

The app will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users (Protected - Admin/Supervisor)
- `GET /api/users` - Get all users with filtering and pagination
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create new user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `PUT /api/users/:id/status` - Update user status (Admin only)

### Profile (Protected)
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/upload-image` - Upload profile image
- `PUT /api/profile/change-password` - Change password

### Dashboard (Protected)
- `GET /api/dashboard/stats` - Get admin dashboard stats (Admin/Supervisor)
- `GET /api/dashboard/user-stats` - Get user dashboard stats

## Pages

### Public Pages
- Login (`/login`)
- Register (`/register`)
- Forgot Password (`/forgot-password`)

### Protected Pages
- User Dashboard (`/dashboard`)
- User Profile (`/profile`)
- Admin Dashboard (`/admin`) - Admin/Supervisor only
- User Management (`/admin/users`) - Admin/Supervisor only

## Default Test Credentials

After setup, you can create test users:

### Create Admin User
```bash
# Use the register endpoint or create manually
POST /api/auth/register
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@garage.com",
  "password": "admin123",
  "role": "admin"
}
```

### Create Other Roles
Create users with roles: `driver`, `operator`, `supervisor`

## Default Roles

- **admin**: admin@garage.com / admin123
- **supervisor**: supervisor@garage.com / supervisor123
- **driver**: driver@garage.com / driver123
- **operator**: operator@garage.com / operator123

(Note: Create these users through the registration or admin panel)

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/garage-users
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Garage Users
```

## Database Models

### User Model
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (admin, supervisor, driver, operator),
  status: String (active, inactive, suspended),
  profileImage: String (URL),
  department: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Features Implemented

### Authentication & Security
- [x] JWT token authentication
- [x] Password hashing with bcryptjs
- [x] Protected routes on backend
- [x] Protected routes on frontend
- [x] Token refresh and expiration
- [x] Session management

### User Management
- [x] User CRUD operations
- [x] User search and filtering
- [x] Pagination
- [x] Role management
- [x] Status management
- [x] User profile management

### Admin Features
- [x] Admin dashboard
- [x] Dashboard statistics
- [x] User list management
- [x] User creation
- [x] User editing
- [x] User deletion
- [x] Status updates

### Frontend Features
- [x] Responsive design
- [x] Modern clean UI
- [x] Toast notifications
- [x] Loading states
- [x] Form validation
- [x] Error handling
- [x] Protected routes
- [x] Navigation
- [x] Profile image upload

## Usage Examples

### Register a New User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "_id": "...",
    "firstName": "John",
    "email": "john@example.com",
    ...
  }
}
```

### Get All Users (Admin)
```bash
GET http://localhost:5000/api/users?role=driver&status=active&page=1&limit=10
Authorization: Bearer {token}
```

### Upload Profile Image
```bash
POST http://localhost:5000/api/profile/upload-image
Authorization: Bearer {token}
Content-Type: multipart/form-data

[file data]
```

## File Upload

- **Location**: `/uploads` folder in backend
- **Max Size**: 5MB
- **Allowed Types**: jpg, jpeg, png, gif
- **Accessible**: Via `/uploads/{filename}` URL

## Error Handling

All API responses follow a consistent format:

```javascript
// Success
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}

// Error
{
  "success": false,
  "message": "Error description",
  "errors": [...] // Optional, for validation errors
}
```

## Common HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- For Atlas, verify IP whitelist and credentials

### CORS Errors
- Check `FRONTEND_URL` in backend `.env`
- Ensure frontend URL matches exactly

### Token Expiration
- Tokens expire after 7 days (configurable with `JWT_EXPIRE`)
- User will be redirected to login on token expiration

### Image Upload Issues
- Check file size (max 5MB)
- Verify file type is allowed
- Ensure `/uploads` folder exists

## Development Tips

1. **Backend Logs**: Check console for detailed error messages
2. **Frontend Debugging**: Use browser DevTools console
3. **API Testing**: Use Postman or curl for API testing
4. **Database**: Use MongoDB Compass to view database

## Build for Production

### Backend
```bash
npm start
```

### Frontend
```bash
npm run build
npm run preview
```

## Performance Optimization

- Pagination implemented for user lists
- Token-based authentication reduces server overhead
- Image optimization for profile uploads
- CSS minification in production build

## Security Considerations

1. Change `JWT_SECRET` in production
2. Use HTTPS in production
3. Implement rate limiting (optional)
4. Use environment variables for sensitive data
5. Regular security audits
6. Keep dependencies updated

## Future Enhancements

- [ ] Email notifications for password reset
- [ ] Two-factor authentication (2FA)
- [ ] Audit logging
- [ ] User activity tracking
- [ ] Advanced reporting
- [ ] Data export (CSV/Excel)
- [ ] API documentation (Swagger)
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline

## License

This project is open source and available under the ISC License.

## Support

For issues and questions, please refer to the individual README files in `backend/` and `frontend/` directories.

## Authors

Created with ❤️ for efficient user management.

---

**Happy Coding!** 🚀
