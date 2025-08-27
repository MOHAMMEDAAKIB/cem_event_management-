import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../src/models/Admin.js';

dotenv.config();

const checkAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    
    const admins = await Admin.find({}, 'username email createdAt');
    console.log('\n📋 Existing Admin Users:');
    console.log('========================');
    
    if (admins.length === 0) {
      console.log('❌ No admin users found');
    } else {
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. Username: ${admin.username}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Created: ${admin.createdAt}`);
        console.log('   ---');
      });
    }
    
    console.log(`\n📊 Total Admin Users: ${admins.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

checkAdmins();
