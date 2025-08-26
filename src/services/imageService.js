import cloudinary from '../config/cloudinary.js';

/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Object>} - Upload result with URL and public_id
 */
export const uploadImage = async (file, folder = 'events') => {
  try {
    // Convert file to base64 if it's a File object
    let fileData;
    if (file instanceof File) {
      fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } else {
      fileData = file;
    }

    const uploadResult = await cloudinary.uploader.upload(fileData, {
      folder: folder,
      resource_type: 'auto',
      quality: 'auto:good',
      fetch_format: 'auto',
      transformation: [
        { width: 1200, height: 800, crop: 'fill', quality: 'auto:good' },
        { flags: 'progressive' }
      ]
    });

    return {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {File[]} files - Array of image files
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Object[]>} - Array of upload results
 */
export const uploadMultipleImages = async (files, folder = 'events') => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw new Error('Failed to upload images');
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public_id of the image
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Failed to delete image');
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {string[]} publicIds - Array of Cloudinary public_ids
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteMultipleImages = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error('Error deleting multiple images:', error);
    throw new Error('Failed to delete images');
  }
};

/**
 * Generate optimized image URL with transformations
 * @param {string} publicId - Cloudinary public_id
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (publicId, options = {}) => {
  const {
    width = 800,
    height = 600,
    crop = 'fill',
    quality = 'auto:good',
    format = 'auto'
  } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    fetch_format: format,
    flags: 'progressive'
  });
};

/**
 * Get image upload widget configuration for frontend
 * @param {string} folder - Upload folder
 * @returns {Object} - Widget configuration
 */
export const getUploadWidgetConfig = (folder = 'events') => {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
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
