import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../src/models/Admin.js';

// Configure environment variables
dotenv.config();

const initializeAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cem_events';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Check if any admin exists
    const existingAdminCount = await Admin.countDocuments();
    
    if (existingAdminCount > 0) {
      console.log(`ℹ️  Found ${existingAdminCount} existing admin(s). Skipping initialization.`);
      console.log('If you want to create a new admin, use the admin dashboard or API.');
      process.exit(0);
    }

    // Create the first super admin
    const superAdminData = {
      username: 'superadmin',
      email: 'admin@cem.edu.lk',
      password: 'SuperAdmin123!',
      fullName: 'Super Administrator',
      role: 'super_admin',
      permissions: {
        canCreateEvents: true,
        canEditEvents: true,
        canDeleteEvents: true,
        canManageAdmins: true,
        canViewAnalytics: true
      }
    };

    const superAdmin = new Admin(superAdminData);
    await superAdmin.save();

    console.log('🎉 Super admin created successfully!');
    console.log('📧 Email:', superAdminData.email);
    console.log('👤 Username:', superAdminData.username);
    console.log('🔐 Password:', superAdminData.password);
    console.log('');
    console.log('⚠️  IMPORTANT: Please change the default password after first login!');
    console.log('');

    // Also create a regular admin for demo
    const regularAdminData = {
      username: 'admin',
      email: 'admin.events@cem.edu.lk',
      password: 'admin123',
      fullName: 'Event Administrator',
      role: 'admin',
      permissions: {
        canCreateEvents: true,
        canEditEvents: true,
        canDeleteEvents: true,
        canManageAdmins: false,
        canViewAnalytics: true
      },
      createdBy: superAdmin._id
    };

    const regularAdmin = new Admin(regularAdminData);
    await regularAdmin.save();

    console.log('👥 Regular admin created successfully!');
    console.log('📧 Email:', regularAdminData.email);
    console.log('👤 Username:', regularAdminData.username);
    console.log('🔐 Password:', regularAdminData.password);
    console.log('');

  } catch (error) {
    console.error('❌ Error initializing admin:', error.message);
    if (error.code === 11000) {
      console.log('Admin with this username or email already exists.');
    }
  } finally {
    await mongoose.connection.close();
    console.log('📦 Database connection closed');
  }
};

// Run the initialization
initializeAdmin();
