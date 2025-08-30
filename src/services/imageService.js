import api from '../utils/api.js';

/**
 * Upload image via API to server
 * @param {File} file - Image file to upload
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Object>} - Upload result with URL and public_id
 */
export const uploadImage = async (file, folder = 'events') => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.success ? response.data.image : null;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Upload multiple images via API to server
 * @param {File[]} files - Array of image files
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Object[]>} - Array of upload results
 */
export const uploadMultipleImages = async (files, folder = 'events') => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.success ? response.data.images : [];
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw new Error('Failed to upload images');
  }
};

/**
 * Delete image via API
 * @param {string} publicId - Cloudinary public_id of the image
 * @returns {Promise<boolean>} - Success status
 */
export const deleteImage = async (publicId) => {
  try {
    const response = await api.delete(`/upload/images/${publicId}`);
    return response.data.success || true;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
};

/**
 * Generate optimized image URL with transformations (client-side utility)
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
  if (originalUrl && originalUrl.includes('cloudinary.com')) {
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
 * Get image upload widget configuration for frontend
 * @param {string} folder - Upload folder
 * @returns {Object} - Widget configuration
 */
export const getUploadWidgetConfig = (folder = 'events') => {
  return {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    uploadPreset: 'unsigned_upload', // You'll need to create this in Cloudinary
    folder: folder,
    multiple: true,
    maxFiles: 5,
    maxFileSize: 10000000, // 10MB
    clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1200, height: 800, crop: 'fill', quality: 'auto:good' }
    ]
  };
};

// For backward compatibility, keep the same function names
export const uploadEventImage = uploadMultipleImages;
export const deleteEventImage = deleteImage;
