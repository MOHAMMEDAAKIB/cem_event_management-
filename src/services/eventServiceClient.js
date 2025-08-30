import api from '../utils/api.js';

/**
 * Upload image files to server
 * @param {File[]} files - Image files to upload
 * @returns {Promise<Array>} - Upload results
 */
const uploadImages = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });

  const response = await api.post('/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.images;
};

/**
 * Create a new event
 * @param {Object} eventData - Event data
 * @param {File[]} imageFiles - Image files
 * @returns {Promise<Object>} - Created event
 */
export const createEvent = async (eventData, imageFiles = []) => {
  try {
    let images = [];

    // Upload images first if provided
    if (imageFiles && imageFiles.length > 0) {
      try {
        console.log('Uploading images:', imageFiles.length);
        images = await uploadImages(imageFiles);
        console.log('Images uploaded successfully:', images);
      } catch (uploadError) {
        console.warn('Image upload failed, proceeding without images:', uploadError);
        // Continue with event creation even if image upload fails
        images = [];
      }
    }

    // Prepare event data with uploaded images
    const eventDataWithImages = {
      ...eventData,
      images: images.length > 0 ? images : []
    };

    console.log('Creating event with data:', eventDataWithImages);

    const response = await api.post('/events', eventDataWithImages);

    const createdEvent = response.data.success ? response.data.data : response.data;
    console.log('Event created successfully:', createdEvent);
    
    return createdEvent;
  } catch (error) {
    console.error('Error creating event:', error);
    console.error('Error response:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to create event');
  }
};

/**
 * Get all events with optional filters
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} - Events array
 */
export const getAllEvents = async (params = {}) => {
  try {
    const response = await api.get('/events', { params });
    
    // Handle different response structures
    if (response.data.success) {
      // If data is nested (data.data.events)
      if (response.data.data && response.data.data.events) {
        return response.data.data.events;
      }
      // If data is direct (data.data as array)
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      }
      // If events is direct property
      if (response.data.events) {
        return response.data.events;
      }
      return [];
    }
    
    // Fallback for direct array responses
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events');
  }
};

/**
 * Get upcoming events
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} - Upcoming events
 */
export const getUpcomingEvents = async (params = {}) => {
  try {
    const response = await api.get('/events/upcoming', { params });
    
    // Handle different response structures
    if (response.data.success) {
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      }
      if (response.data.data && response.data.data.events) {
        return response.data.data.events;
      }
      return [];
    }
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw new Error('Failed to fetch upcoming events');
  }
};

/**
 * Get past events
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} - Past events
 */
export const getPastEvents = async (params = {}) => {
  try {
    const response = await api.get('/events/past', { params });
    
    // Handle different response structures
    if (response.data.success) {
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      }
      if (response.data.data && response.data.data.events) {
        return response.data.data.events;
      }
      return [];
    }
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    return [];
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
    const response = await api.get('/events/featured', {
      params: { limit }
    });
    return response.data.success ? response.data.data : [];
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
    const response = await api.get(`/events/${eventId}`);
    return response.data.success ? response.data.data : null;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw new Error('Failed to fetch event');
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
    let newImages = [];

    // Upload new images if provided
    if (newImageFiles && newImageFiles.length > 0) {
      newImages = await uploadImages(newImageFiles);
    }

    const response = await api.put(`/events/${eventId}`, {
      ...eventData,
      newImages,
      imagesToDelete,
    });

    return response.data.success ? response.data.data : response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw new Error(error.response?.data?.message || 'Failed to update event');
  }
};

/**
 * Delete an event
 * @param {string} eventId - Event ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteEvent = async (eventId) => {
  try {
    const response = await api.delete(`/events/${eventId}`);
    return response.data.success || true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw new Error('Failed to delete event');
  }
};

/**
 * Get events by category
 * @param {string} category - Event category
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Array>} - Events in category
 */
export const getEventsByCategory = async (category, params = {}) => {
  try {
    const response = await api.get('/events', {
      params: { ...params, category }
    });
    return response.data.success ? response.data.data.events : [];
  } catch (error) {
    console.error('Error fetching events by category:', error);
    throw new Error('Failed to fetch events by category');
  }
};

/**
 * Search events
 * @param {string} searchTerm - Search term
 * @param {Object} params - Additional parameters
 * @returns {Promise<Array>} - Search results
 */
export const searchEvents = async (searchTerm, params = {}) => {
  try {
    const response = await api.get('/events', {
      params: { ...params, search: searchTerm }
    });
    return response.data.success ? response.data.data.events : [];
  } catch (error) {
    console.error('Error searching events:', error);
    throw new Error('Failed to search events');
  }
};

/**
 * Get event statistics
 * @returns {Promise<Object>} - Event statistics
 */
export const getEventStatistics = async () => {
  try {
    const response = await api.get('/events/statistics');
    return response.data.success ? response.data.data : {};
  } catch (error) {
    console.error('Error fetching event statistics:', error);
    throw new Error('Failed to fetch event statistics');
  }
};

// For backward compatibility, keep the same function names as Firebase
export const uploadEventImage = uploadImages;
export const deleteEventImage = async (imageUrl) => {
  // Extract public ID from Cloudinary URL if needed
  const publicId = imageUrl.split('/').pop().split('.')[0];
  
  try {
    await api.delete(`/upload/images/${publicId}`);
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
};
