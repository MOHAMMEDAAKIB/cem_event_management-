# Firebase Setup Instructions

## Overview
This event management application now includes full Firebase integration for event storage and image management. Follow these steps to configure Firebase for your project.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "CEM Event Management")
4. Enable Google Analytics (optional)
5. Wait for project creation to complete

## Step 2: Enable Required Services

### Enable Firestore Database
1. In your Firebase console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location closest to your users
5. Click "Enable"

### Enable Storage
1. Go to "Storage" in your Firebase console
2. Click "Get started"
3. Choose "Start in test mode" for development
4. Select the same location as your Firestore
5. Click "Done"

### Enable Authentication (Optional)
1. Go to "Authentication" in your Firebase console
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Save the configuration

## Step 3: Configure Web App

1. In your Firebase project overview, click the web icon (</>)
2. Register your app with a nickname (e.g., "CEM Web App")
3. Don't check "Firebase Hosting" for now
4. Click "Register app"
5. Copy the Firebase configuration object

## Step 4: Update Firebase Configuration

Replace the placeholder values in `/src/firebase/config.js` with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Step 5: Configure Firestore Security Rules

In your Firebase console, go to Firestore Database > Rules and update them:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to events for all users
    match /events/{document} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can write
    }
  }
}
```

For development, you can use more permissive rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Step 6: Configure Storage Security Rules

In your Firebase console, go to Storage > Rules and update them:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all files
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can upload
    }
  }
}
```

For development, you can use:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

## Step 7: Set Up Admin Authentication (Optional)

If you want to use the admin features:

1. In Firebase Console, go to Authentication > Users
2. Click "Add user"
3. Enter an email and password for the admin account
4. Save the user

Then update `/src/utils/auth.js` if needed to match your authentication logic.

## Features Included

### Event Management
- ✅ Create, Read, Update, Delete events
- ✅ Image upload and storage
- ✅ Real-time data synchronization
- ✅ Advanced filtering and search
- ✅ Classical, elegant UI design

### Firebase Integration
- ✅ Firestore for event data
- ✅ Storage for event images
- ✅ Optimized queries and caching
- ✅ Error handling and loading states
- ✅ Image compression and validation

### Classical Design Elements
- ✅ Serif fonts for headings
- ✅ Gold/cream/dark green color scheme
- ✅ Subtle shadows and borders
- ✅ Elegant card designs
- ✅ Smooth animations and transitions
- ✅ Responsive layout

## Usage

### Admin Features
1. Navigate to `/admin/login` to access admin panel
2. Login with your admin credentials
3. Use the dashboard to manage events:
   - Add new events with images
   - Edit existing events
   - Delete events
   - View statistics

### Public Features
1. **Gallery Page** (`/gallery`): Browse all events in an elegant grid
2. **Calendar Page** (`/calendar`): View events in calendar format
3. **Event Details** (`/events/:id`): View detailed event information

### Event Data Structure
Each event includes:
- Title (required)
- Date (required)
- Time (optional)
- Location (optional)
- Category (Cultural, Sports, Workshop, etc.)
- Short Description (required, max 150 chars)
- Full Description (required)
- Image (required for new events)
- Timestamps (created/updated automatically)

## Troubleshooting

### Common Issues

1. **"Failed to load events"**
   - Check your Firebase configuration
   - Verify Firestore rules allow read access
   - Check browser console for detailed errors

2. **"Failed to upload image"**
   - Verify Storage is enabled
   - Check Storage security rules
   - Ensure image file is under 5MB

3. **"Authentication required"**
   - Check if admin authentication is properly configured
   - Verify the user exists in Firebase Auth

### Development vs Production

For development:
- Use permissive Firestore and Storage rules
- Enable test mode for both services

For production:
- Implement proper authentication
- Restrict write access to authenticated admin users
- Set up proper security rules
- Consider enabling Firebase App Check for additional security

## Next Steps

1. Configure your Firebase project
2. Update the configuration file
3. Test the application
4. Deploy to production
5. Set up proper security rules
6. Consider adding more features like:
   - User registration for events
   - Email notifications
   - Social media integration
   - Advanced analytics

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your Firebase configuration
3. Review the Firebase documentation
4. Check that all required services are enabled
