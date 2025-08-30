import mongoose from 'mongoose';
import Event from '../models/Event.js';
import { uploadImage, uploadMultipleImages, deleteImage } from './imageServiceServer.js';

// Helper function to handle multiple image deletions
const deleteMultipleImages = async (publicIds) => {
  try {
    const deletePromises = publicIds.map(publicId => deleteImage(publicId));
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error('Error deleting multiple images:', error);
    throw new Error('Failed to delete some images');
  }
};

/**
 * Create a new event
 * @param {Object} eventData - Event data
 * @param {File[]} imageFiles - Array of image files
 * @returns {Promise<Object>} - Created event
 */
export const createEvent = async (eventData, imageFiles = []) => {
  try {
    console.log('Creating event with data:', eventData);
    console.log('Image files provided:', imageFiles?.length || 0);
    
    let images = [];

    // Handle images if provided
    if (imageFiles && imageFiles.length > 0) {
      try {
        // Check if images are already processed (from frontend upload)
        if (Array.isArray(eventData.images) && eventData.images.length > 0) {
          images = eventData.images;
        } else {
          // Upload new image files
          const uploadResults = await uploadMultipleImages(imageFiles, 'events');
          images = uploadResults.map((result, index) => ({
            url: result.url,
            publicId: result.publicId,
            caption: `Event image ${index + 1}`
          }));
        }
      } catch (imageError) {
        console.warn('Image upload failed, proceeding without images:', imageError);
        images = [];
      }
    } else if (eventData.images && Array.isArray(eventData.images)) {
      // Use provided images from eventData
      images = eventData.images;
    }
    
    // Add a placeholder image if no images are provided at all
    if (!images || images.length === 0) {
      images = [{
        url: 'https://via.placeholder.com/800x400/1B4D3E/FFFFFF?text=Event+Image',
        publicId: `placeholder_${Date.now()}`,
        caption: 'Event placeholder image'
      }];
    }

    // Prepare event data
    const eventToCreate = {
      ...eventData,
      images,
      // Ensure date is properly formatted
      date: new Date(eventData.date),
      status: 'published'
    };

    // Remove images from eventData to avoid duplication
    delete eventToCreate.images;

    // Create event
    const event = new Event({
      ...eventToCreate,
      images
    });

    console.log('Saving event to database...');
    const savedEvent = await event.save();
    console.log('Event saved successfully:', savedEvent._id);
    
    return savedEvent;
  } catch (error) {
    console.error('Error creating event:', error);
    console.error('Error details:', error.message);
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    
    throw new Error(`Failed to create event: ${error.message}`);
  }
};

/**
 * Get all events with pagination and filtering
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Events with pagination info
 */
export const getAllEvents = async (options = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'desc',
      category,
      status = 'published',
      featured,
      search,
      startDate,
      endDate
    } = options;

    // Build query
    const query = { status };

    if (category) query.category = category;
    if (featured !== undefined) query.featured = featured;

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Execute query
    const [events, total] = await Promise.all([
      Event.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean()
        .exec(),
      Event.countDocuments(query)
    ]);

    // Ensure _id is converted to string for JSON serialization
    const eventsWithStringIds = events.map(event => ({
      ...event,
      _id: event._id.toString()
    }));

    return {
      events: eventsWithStringIds,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalEvents: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events');
  }
};

/**
 * Get upcoming events
 * @param {Object} options - Query options
 * @returns {Promise<Array>} - Upcoming events
 */
export const getUpcomingEvents = async (options = {}) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const queryOptions = {
      ...options,
      startDate: today,
      sortBy: 'date',
      sortOrder: 'asc'
    };

    const result = await getAllEvents(queryOptions);
    return result.events;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw new Error('Failed to fetch upcoming events');
  }
};

/**
 * Get past events
 * @param {Object} options - Query options
 * @returns {Promise<Array>} - Past events
 */
export const getPastEvents = async (options = {}) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const queryOptions = {
      ...options,
      endDate: today,
      sortBy: 'date',
      sortOrder: 'desc'
    };

    const result = await getAllEvents(queryOptions);
    return result.events;
  } catch (error) {
    console.error('Error fetching past events:', error);
    throw new Error('Failed to fetch past events');
  }
};

/**
 * Get featured events
 * @param {number} limit - Number of events to return
 * @returns {Promise<Array>} - Featured events
 */
export const getFeaturedEvents = async (limit = 5) => {
  try {
    const events = await Event.find({ 
      featured: true, 
      status: 'published',
      date: { $gte: new Date() }
    })
    .sort({ date: 1 })
    .limit(limit)
    .lean();

    return events;
  } catch (error) {
    console.error('Error fetching featured events:', error);
    throw new Error('Failed to fetch featured events');
  }
};

/**
 * Get a single event by ID
 * @param {string} eventId - Event ID
 * @returns {Promise<Object>} - Event data
 */
export const getEventById = async (eventId) => {
  try {
    // Validate if the eventId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new Error('Event not found');
    }

    const event = await Event.findById(eventId).lean();
    
    if (!event) {
      throw new Error('Event not found');
    }

    // Ensure _id is converted to string for JSON serialization
    return {
      ...event,
      _id: event._id.toString()
    };
  } catch (error) {
    console.error('Error fetching event:', error);
    
    // If it's already an "Event not found" error, preserve it
    if (error.message === 'Event not found') {
      throw error;
    }
    
    // For other errors, throw a generic error
    throw new Error('Event not found');
  }
};

/**
 * Update an event
 * @param {string} eventId - Event ID
 * @param {Object} eventData - Updated event data
 * @param {File[]} newImageFiles - New image files to add
 * @param {string[]} imagesToDelete - Public IDs of images to delete
 * @returns {Promise<Object>} - Updated event
 */
export const updateEvent = async (eventId, eventData, newImageFiles = [], imagesToDelete = []) => {
  try {
    const existingEvent = await Event.findById(eventId);
    
    if (!existingEvent) {
      throw new Error('Event not found');
    }

    // Handle image deletions
    if (imagesToDelete.length > 0) {
      await deleteMultipleImages(imagesToDelete);
      existingEvent.images = existingEvent.images.filter(
        img => !imagesToDelete.includes(img.publicId)
      );
    }

    // Handle new image uploads
    if (newImageFiles.length > 0) {
      const uploadResults = await uploadMultipleImages(newImageFiles, 'events');
      const newImages = uploadResults.map((result, index) => ({
        url: result.url,
        publicId: result.publicId,
        caption: `Event image ${existingEvent.images.length + index + 1}`
      }));
      existingEvent.images.push(...newImages);
    }

    // Update event data
    Object.assign(existingEvent, eventData);
    const updatedEvent = await existingEvent.save();

    return updatedEvent;
  } catch (error) {
    console.error('Error updating event:', error);
    throw new Error(`Failed to update event: ${error.message}`);
  }
};

/**
 * Delete an event
 * @param {string} eventId - Event ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    
    if (!event) {
      throw new Error('Event not found');
    }

    // Delete associated images from Cloudinary
    if (event.images && event.images.length > 0) {
      const publicIds = event.images.map(img => img.publicId);
      await deleteMultipleImages(publicIds);
    }

    // Delete event from database
    await Event.findByIdAndDelete(eventId);
    
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw new Error('Failed to delete event');
  }
};

/**
 * Get events by category
 * @param {string} category - Event category
 * @param {Object} options - Query options
 * @returns {Promise<Array>} - Events in category
 */
export const getEventsByCategory = async (category, options = {}) => {
  try {
    const queryOptions = {
      ...options,
      category
    };

    const result = await getAllEvents(queryOptions);
    return result.events;
  } catch (error) {
    console.error('Error fetching events by category:', error);
    throw new Error('Failed to fetch events by category');
  }
};

/**
 * Search events
 * @param {string} searchTerm - Search term
 * @param {Object} options - Additional options
 * @returns {Promise<Array>} - Search results
 */
export const searchEvents = async (searchTerm, options = {}) => {
  try {
    const queryOptions = {
      ...options,
      search: searchTerm
    };

    const result = await getAllEvents(queryOptions);
    return result.events;
  } catch (error) {
    console.error('Error searching events:', error);
    throw new Error('Failed to search events');
  }
};

/**
 * Get events statistics
 * @returns {Promise<Object>} - Event statistics
 */
export const getEventStatistics = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalEvents,
      upcomingEvents,
      pastEvents,
      eventsByCategory,
      featuredEvents
    ] = await Promise.all([
      Event.countDocuments({ status: 'published' }),
      Event.countDocuments({ 
        status: 'published',
        date: { $gte: today }
      }),
      Event.countDocuments({ 
        status: 'published',
        date: { $lt: today }
      }),
      Event.aggregate([
        { $match: { status: 'published' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Event.countDocuments({ 
        status: 'published',
        featured: true 
      })
    ]);

    return {
      totalEvents,
      upcomingEvents,
      pastEvents,
      featuredEvents,
      eventsByCategory: eventsByCategory.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Error fetching event statistics:', error);
    throw new Error('Failed to fetch event statistics');
  }
};
