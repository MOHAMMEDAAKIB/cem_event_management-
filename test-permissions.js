// Firebase Permission Test
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBYX-Wh7S3-XZEYtxQvWnlhZWO5rE3FPQk",
  authDomain: "cem-event-management-bika.firebaseapp.com",
  projectId: "cem-event-management-bika",
  storageBucket: "cem-event-management-bika.firebasestorage.app",
  messagingSenderId: "1069059473848",
  appId: "1:1069059473848:web:5a0b74a89e8456c5b7f8a9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testPermissions() {
  console.log('🔧 Testing Firestore Permissions...\n');
  
  try {
    // Test 1: Try to read from events collection
    console.log('📖 Test 1: Reading events collection...');
    const eventsSnapshot = await getDocs(collection(db, 'events'));
    console.log('✅ Read permission: SUCCESS');
    console.log(`📊 Found ${eventsSnapshot.size} events\n`);
    
    // Test 2: Try to create a test document
    console.log('✍️ Test 2: Creating test document...');
    const testEvent = {
      title: 'Permission Test Event',
      date: new Date().toISOString().split('T')[0],
      category: 'Test',
      description: 'This is a test event to verify permissions',
      createdAt: new Date(),
      isTest: true
    };
    
    const docRef = await addDoc(collection(db, 'events'), testEvent);
    console.log('✅ Write permission: SUCCESS');
    console.log(`📝 Created test document with ID: ${docRef.id}\n`);
    
    // Test 3: Try to read the document we just created
    console.log('🔍 Test 3: Reading back the test document...');
    const refreshedSnapshot = await getDocs(collection(db, 'events'));
    console.log('✅ Read after write: SUCCESS');
    console.log(`📊 Total events now: ${refreshedSnapshot.size}\n`);
    
    console.log('🎉 ALL TESTS PASSED! Firestore permissions are working correctly.');
    console.log('🚀 Your event management app should now work properly.');
    
  } catch (error) {
    console.error('❌ PERMISSION ERROR:', error.code);
    console.error('📋 Error details:', error.message);
    
    if (error.code === 'permission-denied') {
      console.log('\n🔧 TO FIX THIS:');
      console.log('1. Go to Firebase Console: https://console.firebase.google.com');
      console.log('2. Select your project: cem-event-management-bika');
      console.log('3. Go to Firestore Database > Rules');
      console.log('4. Replace the rules with:');
      console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
      `);
      console.log('5. Click "Publish"');
      console.log('6. Wait 1-2 minutes and try again');
    }
  }
}

testPermissions();
