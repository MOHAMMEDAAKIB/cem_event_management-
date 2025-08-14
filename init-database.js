// Firestore Database Initialization Script
import { db } from './src/firebase/config.js';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Sample event data to initialize the database
const sampleEvents = [
  {
    title: "Welcome Orientation 2025",
    date: "2025-08-20",
    time: "10:00",
    location: "Main Auditorium",
    category: "Cultural",
    shortDescription: "Welcome new students to the college",
    description: "Join us for an exciting welcome orientation where new students will learn about college life, meet faculty, and connect with fellow students.",
    imageUrl: "",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Annual Sports Meet",
    date: "2025-09-15",
    time: "09:00",
    location: "Sports Complex",
    category: "Sports",
    shortDescription: "College annual sports competition",
    description: "Participate in various sports competitions including athletics, football, basketball, and more. Open to all students and faculty.",
    imageUrl: "",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Tech Workshop: AI & Machine Learning",
    date: "2025-09-10",
    time: "14:00",
    location: "Computer Lab 1",
    category: "Workshop",
    shortDescription: "Learn about AI and ML fundamentals",
    description: "Hands-on workshop covering the basics of Artificial Intelligence and Machine Learning with practical examples and exercises.",
    imageUrl: "",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function initializeDatabase() {
  console.log('🔥 Initializing Firestore Database...');
  
  try {
    // Check if events collection exists and has data
    console.log('📊 Checking existing events...');
    const eventsRef = collection(db, 'events');
    const existingEvents = await getDocs(eventsRef);
    
    if (existingEvents.size > 0) {
      console.log(`✅ Database already has ${existingEvents.size} events`);
      return;
    }
    
    // Add sample events
    console.log('📝 Adding sample events...');
    for (const event of sampleEvents) {
      const docRef = await addDoc(eventsRef, event);
      console.log(`✅ Added event: ${event.title} (ID: ${docRef.id})`);
    }
    
    console.log('🎉 Database initialization complete!');
    console.log('🚀 Your event management system is ready to use!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    
    if (error.code === 'permission-denied') {
      console.log('\n🔐 Permission Error - You need to:');
      console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
      console.log('2. Select your project: cem-event-management');
      console.log('3. Go to Firestore Database');
      console.log('4. Click "Create database"');
      console.log('5. Choose "Start in test mode" for now');
      console.log('6. Select a location (choose one close to you)');
    } else if (error.code === 'not-found') {
      console.log('\n🏗️ Database Not Found - You need to:');
      console.log('1. Enable Firestore in Firebase Console');
      console.log('2. Create the database first');
      console.log('3. Then run this script again');
    }
  }
}

initializeDatabase();
