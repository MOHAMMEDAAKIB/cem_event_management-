// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
// Replace these values with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC7ILy_EQas0AFhkKUGTkxV10uvGKF_fCM",
  authDomain: "cem-event-management.firebaseapp.com",
  projectId: "cem-event-management",
  storageBucket: "cem-event-management.firebasestorage.app",
  messagingSenderId: "997227746237",
  appId: "1:997227746237:web:f7b6ac50ba62ff79a2f8d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
