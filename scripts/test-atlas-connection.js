import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  console.log('🔍 Testing MongoDB Atlas connection...');
  console.log('📋 Connection URI:', process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//[USERNAME]:[PASSWORD]@'));
  
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cem_events', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });

    console.log('✅ MongoDB Atlas connection successful!');
    console.log(`🏠 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    console.log(`🌐 Atlas Cluster: ${conn.connection.host.includes('mongodb.net') ? 'YES' : 'NO'}`);
    
    // Test database operations
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📚 Available Collections: ${collections.length}`);
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    console.log('🎉 All tests passed! Your MongoDB Atlas connection is working perfectly.');
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed!');
    console.error('📋 Error Details:');
    console.error(`   Type: ${error.name}`);
    console.error(`   Code: ${error.code || 'N/A'}`);
    console.error(`   Message: ${error.message}`);
    
    // Provide specific guidance based on error type
    if (error.message.includes('Authentication failed')) {
      console.log('\n💡 Solution: Check your username and password in the .env file');
      console.log('   1. Go to MongoDB Atlas Dashboard');
      console.log('   2. Navigate to Database Access');
      console.log('   3. Verify your database user credentials');
      console.log('   4. Update MONGODB_URI in .env file');
    } else if (error.message.includes('Server selection timeout')) {
      console.log('\n💡 Solution: Check your network access');
      console.log('   1. Go to MongoDB Atlas Dashboard');
      console.log('   2. Navigate to Network Access');
      console.log('   3. Add your IP address or use 0.0.0.0/0');
    }
  } finally {
    await mongoose.connection.close();
    console.log('👋 Connection test completed');
    process.exit(0);
  }
};

// Run the test
testConnection();
