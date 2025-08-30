import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Event from './src/models/Event.js';
import uploadRoutes from './routes/uploadRoutes.js';
import carouselRoutes, { initializeDefaultCarouselItems } from './routes/carouselRoutes.js';

// Configure environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cem_events';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected Successfully');
    
    // Initialize default carousel items after DB connection
    await initializeDefaultCarouselItems();
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174' // Alternative frontend port
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'CEM Event Management API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Upload routes
app.use('/api/upload', uploadRoutes);

// Carousel routes
app.use('/api/carousel', carouselRoutes);

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status = 'published',
      featured,
      search
    } = req.query;

    // Build query
    const query = { status };
    if (category) query.category = category;
    if (featured !== undefined) query.featured = featured === 'true';

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [events, total] = await Promise.all([
      Event.find(query).sort({ date: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Event.countDocuments(query)
    ]);

    // Transform _id to id for frontend compatibility
    const transformedEvents = events.map(event => ({
      ...event,
      id: event._id,
      _id: undefined
    }));

    res.json({
      success: true,
      data: {
        events: transformedEvents,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalEvents: total
        }
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get upcoming events
app.get('/api/events/upcoming', async (req, res) => {
  try {
    const today = new Date();
    const events = await Event.find({ 
      date: { $gte: today },
      status: 'published'
    }).sort({ date: 1 }).limit(10).lean();

    // Transform _id to id for frontend compatibility
    const transformedEvents = events.map(event => ({
      ...event,
      id: event._id,
      _id: undefined
    }));

    res.json({
      success: true,
      data: transformedEvents
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get past events
app.get('/api/events/past', async (req, res) => {
  try {
    const today = new Date();
    const events = await Event.find({ 
      date: { $lt: today },
      status: 'published'
    }).sort({ date: -1 }).limit(10).lean();

    // Transform _id to id for frontend compatibility
    const transformedEvents = events.map(event => ({
      ...event,
      id: event._id,
      _id: undefined
    }));

    res.json({
      success: true,
      data: transformedEvents
    });
  } catch (error) {
    console.error('Get past events error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get featured events
app.get('/api/events/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const events = await Event.find({ 
      featured: true,
      status: 'published'
    }).sort({ date: 1 }).limit(limit).lean();

    // Transform _id to id for frontend compatibility
    const transformedEvents = events.map(event => ({
      ...event,
      id: event._id,
      _id: undefined
    }));

    res.json({
      success: true,
      data: transformedEvents
    });
  } catch (error) {
    console.error('Get featured events error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get event statistics
app.get('/api/events/statistics', async (req, res) => {
  try {
    const today = new Date();
    
    const [totalEvents, upcomingEvents, pastEvents, featuredEvents] = await Promise.all([
      Event.countDocuments({ status: 'published' }),
      Event.countDocuments({ date: { $gte: today }, status: 'published' }),
      Event.countDocuments({ date: { $lt: today }, status: 'published' }),
      Event.countDocuments({ featured: true, status: 'published' })
    ]);

    res.json({
      success: true,
      data: {
        totalEvents,
        upcomingEvents,
        pastEvents,
        featuredEvents,
        eventsByCategory: {}
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single event by ID
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Transform _id to id for frontend compatibility
    const transformedEvent = {
      ...event,
      id: event._id,
      _id: undefined
    };

    res.json({
      success: true,
      data: transformedEvent
    });
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create new event
app.post('/api/events', async (req, res) => {
  try {
    const eventData = req.body;
    
    // Validate required fields
    if (!eventData.title || !eventData.description || !eventData.date) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and date are required'
      });
    }

    const event = new Event(eventData);
    const savedEvent = await event.save();
    
    // Transform _id to id for frontend compatibility
    const transformedEvent = {
      ...savedEvent.toObject(),
      id: savedEvent._id,
      _id: undefined
    };
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: transformedEvent
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update event
app.put('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).lean();
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Transform _id to id for frontend compatibility
    const transformedEvent = {
      ...event,
      id: event._id,
      _id: undefined
    };
    
    res.json({
      success: true,
      message: 'Event updated successfully',
      data: transformedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }
  
  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 =================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}`);
  console.log('🚀 =================================');
});

export default app;
