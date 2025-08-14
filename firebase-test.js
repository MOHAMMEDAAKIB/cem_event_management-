// Firebase Connection Test
import { db } from './src/firebase/config.js';
import { collection, getDocs, connectFirestoreEmulator } from 'firebase/firestore';

async function testFirebaseConnection() {
  console.log('🔥 Testing Firebase connection...');
  
  try {
    // Try to get a simple collection (this will test the connection)
    console.log('📡 Attempting to connect to Firestore...');
    
    // Test with a simple query
    const testCollection = collection(db, 'test');
    console.log('✅ Firestore collection reference created');
    
    // Try to get documents (this will actually test the connection)
    const snapshot = await getDocs(testCollection);
    console.log('✅ Successfully connected to Firestore!');
    console.log(`📊 Found ${snapshot.size} documents in test collection`);
    
    // Test the events collection
    const eventsCollection = collection(db, 'events');
    const eventsSnapshot = await getDocs(eventsCollection);
    console.log(`📅 Found ${eventsSnapshot.size} events in database`);
    
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check your internet connection');
    console.log('2. Verify Firebase project exists: https://console.firebase.google.com/');
    console.log('3. Ensure Firestore is enabled in your Firebase project');
    console.log('4. Check Firebase project settings match your config');
    console.log('5. Verify your Firebase config keys are correct');
  }
}

testFirebaseConnection();
