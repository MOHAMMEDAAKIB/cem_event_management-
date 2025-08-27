import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../src/models/Admin.js';

const router = express.Router();

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
const JWT_EXPIRE = '24h';

// Middleware to verify JWT token
export const verifyAdminToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId).select('-password');
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Admin not found.'
      });
    }

    if (admin.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive or suspended.'
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Helper function to generate JWT token
const generateToken = (adminId) => {
  return jwt.sign({ adminId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

// POST /api/admin/login - Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.'
      });
    }

    console.log(`Admin login attempt for username: ${username}`);

    // Find admin by username or email
    const admin = await Admin.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: username.toLowerCase() }
      ]
    });

    if (!admin) {
      console.log(`Admin not found: ${username}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.'
      });
    }

    // Check if account is locked
    if (admin.isLocked) {
      console.log(`Account locked for admin: ${username}`);
      return res.status(401).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }

    // Check if account is active
    if (admin.status !== 'active') {
      console.log(`Inactive account for admin: ${username}`);
      return res.status(401).json({
        success: false,
        message: 'Account is inactive or suspended. Please contact the system administrator.'
      });
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      console.log(`Invalid password for admin: ${username}`);
      await admin.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.'
      });
    }

    // Reset login attempts on successful login
    await admin.resetLoginAttempts();

    // Generate JWT token
    const token = generateToken(admin._id);

    console.log(`Successful login for admin: ${username}`);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role,
          permissions: admin.permissions,
          lastLogin: admin.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

// POST /api/admin/register - Create new admin (only accessible by super_admin)
router.post('/register', verifyAdminToken, async (req, res) => {
  try {
    // Check if requesting admin has permission to manage other admins
    if (!req.admin.hasPermission('canManageAdmins') && req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to create admin accounts.'
      });
    }

    const { username, email, password, fullName, role, permissions } = req.body;

    // Validate required fields
    if (!username || !email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, password, and full name are required.'
      });
    }

    // Check if username or email already exists
    const existingAdmin = await Admin.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() }
      ]
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists.'
      });
    }

    // Only super_admin can create other super_admins
    if (role === 'super_admin' && req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super administrators can create other super administrators.'
      });
    }

    // Create new admin
    const newAdmin = new Admin({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      fullName,
      role: role || 'admin',
      permissions: permissions || {},
      createdBy: req.admin._id
    });

    await newAdmin.save();

    console.log(`New admin created: ${username} by ${req.admin.username}`);

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully.',
      data: {
        admin: {
          id: newAdmin._id,
          username: newAdmin.username,
          email: newAdmin.email,
          fullName: newAdmin.fullName,
          role: newAdmin.role,
          permissions: newAdmin.permissions,
          status: newAdmin.status
        }
      }
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

// GET /api/admin/profile - Get admin profile
router.get('/profile', verifyAdminToken, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        admin: req.admin
      }
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
});

// PUT /api/admin/profile - Update admin profile
router.put('/profile', verifyAdminToken, async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const updateFields = {};

    if (fullName) updateFields.fullName = fullName;
    if (email) updateFields.email = email.toLowerCase();

    // Check if email already exists (for other admins)
    if (email) {
      const existingAdmin = await Admin.findOne({
        email: email.toLowerCase(),
        _id: { $ne: req.admin._id }
      });

      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists.'
        });
      }
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.admin._id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        admin: updatedAdmin
      }
    });

  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
});

// PUT /api/admin/change-password - Change admin password
router.put('/change-password', verifyAdminToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.'
      });
    }

    // Get admin with password field
    const admin = await Admin.findById(req.admin._id).select('+password');
    
    // Verify current password
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
});

// GET /api/admin/list - Get all admins (only for super_admin or admins with canManageAdmins permission)
router.get('/list', verifyAdminToken, async (req, res) => {
  try {
    if (!req.admin.hasPermission('canManageAdmins') && req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to view admin accounts.'
      });
    }

    const admins = await Admin.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        admins,
        total: admins.length
      }
    });

  } catch (error) {
    console.error('Get admin list error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
});

// POST /api/admin/verify-token - Verify if token is valid
router.post('/verify-token', verifyAdminToken, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Token is valid.',
      data: {
        admin: req.admin
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
});

export default router;
