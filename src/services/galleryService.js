import api from '../utils/api.js';

/**
 * Get images for a specific event from the backend
 * @param {string} eventName - Event name/folder name
 * @returns {Promise<Object[]>} - Array of image objects
 */
export const getEventImages = async (eventName) => {
  try {
    const response = await api.get(`/upload/gallery/${eventName}`);
    return response.data.success ? response.data.images : [];
  } catch (error) {
    console.error(`Error fetching images for event ${eventName}:`, error);
    return [];
  }
};

/**
 * Get images for multiple events from the backend
 * @param {string[]} eventNames - Array of event names/folder names
 * @returns {Promise<Object>} - Object with event names as keys and image arrays as values
 */
export const getMultipleEventImages = async (eventNames) => {
  try {
    const response = await api.post('/upload/gallery/multiple', {
      eventNames
    });
    return response.data.success ? response.data.eventImages : {};
  } catch (error) {
    console.error('Error fetching multiple event images:', error);
    // Return empty object with all event names
    const emptyResult = {};
    eventNames.forEach(eventName => {
      emptyResult[eventName] = [];
    });
    return emptyResult;
  }
};

/**
 * Generate folder name from event title
 * @param {string} eventTitle - Original event title
 * @returns {string} - Sanitized folder name
 */
export const sanitizeEventName = (eventTitle) => {
  return eventTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .trim();
};

/**
 * Get optimized image URL with transformations (client-side utility)
 * @param {string} originalUrl - Original image URL
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (originalUrl, options = {}) => {
  const {
    width = 800,
    height = 600,
    crop = 'fill',
    quality = 'auto:good'
  } = options;

  // If it's already a Cloudinary URL, we can add transformations
  if (originalUrl.includes('cloudinary.com')) {
    // Extract the parts of the URL
    const urlParts = originalUrl.split('/upload/');
    if (urlParts.length === 2) {
      const transformation = `w_${width},h_${height},c_${crop},q_${quality}`;
      return `${urlParts[0]}/upload/${transformation}/${urlParts[1]}`;
    }
  }
  
  // Return original URL if not Cloudinary or transformation fails
  return originalUrl;
};

/**
 * Create thumbnail URL from original image URL
 * @param {string} originalUrl - Original image URL
 * @returns {string} - Thumbnail URL
 */
export const getThumbnailUrl = (originalUrl) => {
  return getOptimizedImageUrl(originalUrl, {
    width: 300,
    height: 300,
    crop: 'fill',
    quality: 'auto:good'
  });
};

/**
 * Create large image URL from original image URL
 * @param {string} originalUrl - Original image URL
 * @returns {string} - Large image URL
 */
export const getLargeImageUrl = (originalUrl) => {
  return getOptimizedImageUrl(originalUrl, {
    width: 1200,
    height: 800,
    crop: 'fill',
    quality: 'auto:good'
  });
};
