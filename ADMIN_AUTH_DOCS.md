# Admin Authentication System

This document describes the new MongoDB-based admin authentication system that replaces the previous hardcoded credential system.

## Overview

The admin authentication system has been completely re-engineered to use MongoDB for secure storage of admin credentials with the following features:

- **Secure password hashing** using bcryptjs
- **JWT-based authentication** for stateless sessions
- **Role-based access control** (RBAC) with granular permissions
- **Account lockout** after failed login attempts
- **Admin management interface** for creating and managing admin accounts
- **Multiple admin roles**: Super Admin, Admin, Moderator

## Features

### Security Features
- **Password Hashing**: All passwords are hashed using bcryptjs with salt rounds of 12
- **JWT Tokens**: Secure token-based authentication with 24-hour expiration
- **Account Lockout**: Accounts are locked after 5 failed login attempts for 2 hours
- **Role-based Permissions**: Granular permission system for different admin capabilities
- **Secure API**: All admin endpoints require valid JWT tokens

### Admin Roles & Permissions

#### Super Admin
- Full system access
- Can create, edit, delete other admin accounts
- Can assign any role including other super admins
- All event management permissions
- Analytics access

#### Admin
- Can create, edit, delete events
- Analytics access
- Cannot manage other admin accounts (unless specifically granted permission)

#### Moderator
- Limited event management capabilities
- Configurable permissions per admin

### Permission Types
- `canCreateEvents`: Create new events
- `canEditEvents`: Edit existing events
- `canDeleteEvents`: Delete events
- `canManageAdmins`: Create and manage other admin accounts
- `canViewAnalytics`: Access analytics and reports

## Database Schema

### Admin Model (`/src/models/Admin.js`)
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  fullName: String (required),
  role: String (enum: ['super_admin', 'admin', 'moderator']),
  permissions: {
    canCreateEvents: Boolean,
    canEditEvents: Boolean,
    canDeleteEvents: Boolean,
    canManageAdmins: Boolean,
    canViewAnalytics: Boolean
  },
  status: String (enum: ['active', 'inactive', 'suspended']),
  lastLogin: Date,
  loginAttempts: Number,
  lockUntil: Date,
  createdBy: ObjectId (ref: Admin),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication Endpoints (`/routes/adminRoutes.js`)

- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Create new admin (protected)
- `GET /api/admin/profile` - Get admin profile (protected)
- `PUT /api/admin/profile` - Update admin profile (protected)
- `PUT /api/admin/change-password` - Change password (protected)
- `GET /api/admin/list` - Get all admins (protected)
- `POST /api/admin/verify-token` - Verify JWT token (protected)

### Request/Response Examples

#### Login Request
```javascript
POST /api/admin/login
{
  "username": "admin",
  "password": "admin123"
}
```

#### Login Response
```javascript
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "...",
      "username": "admin",
      "email": "admin@cem.edu.lk",
      "fullName": "Event Administrator",
      "role": "admin",
      "permissions": {...},
      "lastLogin": "2025-08-27T07:00:00.000Z"
    }
  }
}
```

## Frontend Integration

### Auth Service (`/src/services/authService.js`)
- Centralized authentication service
- Automatic token management
- Request/response interceptors
- Local storage integration
- Backward compatibility with existing components

### Protected Routes
- `ProtectedRoute` component updated to use new auth service
- Automatic redirect to login on authentication failure
- Token validation on protected pages

### Admin Management Interface
- **AdminManagement** component (`/src/pages/AdminManagement.jsx`)
- Create new admin accounts
- View all admin accounts with roles and permissions
- Permission-based access control
- Integration with AdminDashboard

## Setup Instructions

### 1. Install Dependencies
```bash
npm install bcryptjs jsonwebtoken --legacy-peer-deps
```

### 2. Initialize Admin Accounts
```bash
npm run init:admin
```

This creates:
- **Super Admin**: username: `superadmin`, password: `SuperAdmin123!`
- **Regular Admin**: username: `admin`, password: `admin123`

### 3. Environment Variables
Add to your `.env` file:
```
JWT_SECRET=your_secure_jwt_secret_here
```

### 4. Start the Application
```bash
# Start backend
npm run server

# Start frontend (in another terminal)
npm run dev
```

## Default Credentials

After running `npm run init:admin`, you can login with:

**Super Administrator:**
- Username: `superadmin`
- Password: `SuperAdmin123!`
- Email: `admin@cem.edu.lk`

**Regular Administrator:**
- Username: `admin`
- Password: `admin123`
- Email: `admin.events@cem.edu.lk`

⚠️ **Important**: Change default passwords after first login!

## Security Considerations

1. **Change Default Passwords**: Always change default passwords in production
2. **JWT Secret**: Use a strong, randomly generated JWT secret in production
3. **HTTPS**: Use HTTPS in production to protect token transmission
4. **Token Expiration**: Tokens expire in 24 hours for security
5. **Account Lockout**: Failed login attempts are tracked and accounts are locked temporarily

## Migration from Old System

The new system is backward compatible with existing components:
- Old auth functions are still available for compatibility
- Components have been updated to use the new auth service
- Local storage structure remains similar for seamless transition

## Admin Management

### Creating New Admins
1. Login as Super Admin or Admin with management permissions
2. Navigate to Admin Dashboard
3. Click "Manage Admins" button
4. Click "Add Admin" button
5. Fill in admin details and select permissions
6. Submit the form

### Permission Management
- Super Admins can grant any permissions
- Regular Admins can only create other admins if they have `canManageAdmins` permission
- Permissions are granular and can be customized per admin

## Troubleshooting

### Common Issues

1. **Login Failed**: Check username/password, verify account is active
2. **Account Locked**: Wait 2 hours or contact super admin
3. **Permission Denied**: Verify admin has required permissions
4. **Token Issues**: Clear browser storage and login again

### Logs
- Server logs authentication attempts
- Failed login attempts are tracked
- Account lockouts are logged

## Future Enhancements

Possible future improvements:
- Email verification for new admins
- Password reset functionality
- Two-factor authentication (2FA)
- Session management dashboard
- Audit logs for admin actions
- Password complexity requirements
- Multi-tenancy support

## Support

For issues or questions regarding the admin authentication system, please check:
1. Server logs for authentication errors
2. Browser console for frontend errors
3. Database for admin account status
4. This documentation for setup instructions
