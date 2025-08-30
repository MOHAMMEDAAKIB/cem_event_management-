import express from 'express';
import {
  createEvent,
  getAllEvents,
  getUpcomingEvents,
  getPastEvents,
  getFeaturedEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByCategory,
  searchEvents,
  getEventStatistics
} from '../src/services/eventService.js';

const router = express.Router();

/**
 * Get all events with filtering and pagination
 * GET /api/events
 */
router.get('/', async (req, res) => {
  try {
    const result = await getAllEvents(req.query);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Get upcoming events
 * GET /api/events/upcoming
 */
router.get('/upcoming', async (req, res) => {
  try {
    const events = await getUpcomingEvents(req.query);
    console.log('Upcoming events found:', events.length);
    if (events.length > 0) {
      console.log('First event ID:', events[0]._id);
      console.log('First event ID type:', typeof events[0]._id);
    }
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Get past events
 * GET /api/events/past
 */
router.get('/past', async (req, res) => {
  try {
    const events = await getPastEvents(req.query);
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get past events error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Get featured events
 * GET /api/events/featured
 */
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const events = await getFeaturedEvents(limit);
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get featured events error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Search events
 * GET /api/events/search
 */
router.get('/search', async (req, res) => {
  try {
    const { q: searchTerm } = req.query;
    
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    const events = await searchEvents(searchTerm, req.query);
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Search events error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Get event statistics
 * GET /api/events/statistics
 */
router.get('/statistics', async (req, res) => {
  try {
    const stats = await getEventStatistics();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Get single event by ID
 * GET /api/events/:id
 */
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching event with ID:', req.params.id);
    console.log('ID type:', typeof req.params.id);
    console.log('ID length:', req.params.id?.length);
    
    const event = await getEventById(req.params.id);
    console.log('Event found:', event ? 'Yes' : 'No');
    if (event) {
      console.log('Event title:', event.title);
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event by ID error:', error);
    console.error('Error message:', error.message);
    res.status(error.message === 'Event not found' ? 404 : 500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Create new event
 * POST /api/events
 */
router.post('/', async (req, res) => {
  try {
    const { images, ...eventData } = req.body;
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'date', 'time', 'location', 'category', 'organizer'];
    for (const field of requiredFields) {
      if (!eventData[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // Process the event data
    const processedEventData = {
      ...eventData,
      date: new Date(eventData.date),
      images: images || []
    };

    const event = await createEvent(processedEventData);
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Update event
 * PUT /api/events/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { newImages, imagesToDelete, ...eventData } = req.body;
    
    // Process the event data
    const processedEventData = {
      ...eventData
    };

    if (eventData.date) {
      processedEventData.date = new Date(eventData.date);
    }

    const event = await updateEvent(
      req.params.id,
      processedEventData,
      [], // newImageFiles - handled separately in frontend
      imagesToDelete || []
    );

    // Add new images if provided
    if (newImages && newImages.length > 0) {
      event.images = [...(event.images || []), ...newImages];
      await event.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(error.message === 'Event not found' ? 404 : 500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Delete event
 * DELETE /api/events/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    await deleteEvent(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(error.message === 'Event not found' ? 404 : 500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
