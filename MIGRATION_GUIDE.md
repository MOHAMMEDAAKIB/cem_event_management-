# CEM Event Management - MongoDB + Cloudinary Migration

This document outlines the migration from Firebase to MongoDB + Cloudinary for the CEM Event Management system.

## 🚀 Quick Start

### Prerequisites

1. **MongoDB** - Install locally or use MongoDB Atlas
2. **Cloudinary Account** - For image storage
3. **Node.js** - v16 or higher
4. **npm** - v8 or higher

### Environment Setup

1. Copy the `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your credentials:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/cem_events
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/cem_events

   # Cloudinary Configuration (Get from https://cloudinary.com/)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key_here
   FRONTEND_URL=http://localhost:5173
   ```

3. Update frontend environment variables:
   ```env
   # Create .env.local in the root directory
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Test MongoDB connection:**
   ```bash
   node mongodb-test.js
   ```

3. **Migrate sample data:**
   ```bash
   node migrate-data.js
   ```

4. **Start the application:**
   ```bash
   # Start both frontend and backend
   npm start

   # Or start separately:
   npm run server:dev  # Backend only
   npm run dev         # Frontend only
   ```

## 🗃️ Data Structure Changes

### Before (Firebase)
```javascript
{
  id: "event_id",
  title: "Event Title",
  description: "Event Description",
  date: "2025-09-15",
  time: "09:00",
  location: "Event Location",
  category: "Technical",
  organizer: "Organizer Name",
  imageUrl: "https://firebase-url.com/image.jpg",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### After (MongoDB)
```javascript
{
  _id: ObjectId("..."),
  title: "Event Title",
  description: "Event Description",
  date: Date("2025-09-15"),
  time: "09:00",
  location: {
    address: "Event Address",
    city: "Event City",
    state: "State",
    zipCode: "12345",
    coordinates: {
      latitude: 40.7128,
      longitude: -74.0060
    }
  },
  category: "Technical",
  organizer: {
    name: "Organizer Name",
    email: "organizer@email.com",
    phone: "(555) 123-4567"
  },
  images: [
    {
      url: "https://cloudinary-url.com/image.jpg",
      publicId: "events/image_id",
      caption: "Event image 1"
    }
  ],
  capacity: 100,
  registrationRequired: true,
  registrationDeadline: Date("2025-09-10"),
  price: 0,
  status: "published",
  featured: false,
  tags: ["technology", "conference"],
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ API Endpoints

### Events
- `GET /api/events` - Get all events (with pagination and filtering)
- `GET /api/events/upcoming` - Get upcoming events
- `GET /api/events/past` - Get past events
- `GET /api/events/featured` - Get featured events
- `GET /api/events/search?q=term` - Search events
- `GET /api/events/statistics` - Get event statistics
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Image Upload
- `POST /api/upload/images` - Upload multiple images
- `POST /api/upload/image` - Upload single image
- `DELETE /api/upload/images/:publicId` - Delete image

### Query Parameters (for GET /api/events)
```
?page=1&limit=10&category=Technical&status=published&featured=true&search=tech&startDate=2025-01-01&endDate=2025-12-31&sortBy=date&sortOrder=desc
```

## 🔄 Migration Steps

### 1. Export Firebase Data
If you have existing Firebase data, export it using the Firebase console or admin SDK.

### 2. Transform Data
Use the `migrate-data.js` script to transform and import your data:

```bash
# See data template
node migrate-data.js --template

# Run migration with your data
node migrate-data.js
```

### 3. Update Components
The following components have been updated to use the new MongoDB service:
- `src/pages/EventDetailsPage.jsx`
- `src/pages/CalendarPage.jsx`
- `src/pages/GalleryPage.jsx`
- `src/pages/AdminDashboard.jsx`

### 4. Remove Firebase Dependencies
After migration is complete, you can remove Firebase:

```bash
npm uninstall firebase
```

Remove Firebase files:
- `src/firebase/config.js`
- `src/firebase/eventService.js`
- `firebase-test.js`

## 🌟 New Features

### Enhanced Location Support
- Structured location data with coordinates
- Better address handling
- Support for GPS coordinates

### Multiple Images
- Support for multiple images per event
- Image carousel in event details
- Cloudinary optimization

### Advanced Event Management
- Event capacity and registration tracking
- Featured events
- Event status management
- Enhanced organizer information

### Better Search and Filtering
- Full-text search across multiple fields
- Advanced filtering options
- Pagination support

## 🧪 Testing

### Test MongoDB Connection
```bash
node mongodb-test.js
```

### Test API Endpoints
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test events endpoint
curl http://localhost:5000/api/events
```

## 🔧 Troubleshooting

### MongoDB Connection Issues
1. Ensure MongoDB is running locally (`mongod`)
2. Check connection string in `.env`
3. Verify network access for MongoDB Atlas

### Cloudinary Upload Issues
1. Verify Cloudinary credentials in `.env`
2. Check upload preset configuration
3. Ensure file size limits are appropriate

### API Issues
1. Check server logs for errors
2. Verify CORS configuration
3. Ensure all required environment variables are set

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

## 🤝 Contributing

When adding new features:
1. Update the MongoDB schema in `src/models/Event.js`
2. Add corresponding API endpoints in `routes/eventRoutes.js`
3. Update the frontend service in `src/services/eventServiceClient.js`
4. Update components to handle new data structure

## 🔐 Security Notes

- Never commit `.env` file to version control
- Use strong JWT secrets in production
- Implement proper authentication middleware
- Validate all input data
- Use HTTPS in production
