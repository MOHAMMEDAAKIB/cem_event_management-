import express from 'express';
import multer from 'multer';
import { uploadImage, uploadMultipleImages, deleteImage, getImagesFromFolder } from '../src/services/imageServiceServer.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

/**
 * Upload multiple images
 * POST /api/upload/images
 */
router.post('/images', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided'
      });
    }

    try {
      // Convert multer files to base64 for Cloudinary
      const imagePromises = req.files.map(async (file) => {
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        return uploadImage(base64, 'events');
      });

      const uploadResults = await Promise.all(imagePromises);

      res.status(200).json({
        success: true,
        message: 'Images uploaded successfully to Cloudinary',
        images: uploadResults
      });
    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed:', cloudinaryError);
      
      // Fallback to mock images if Cloudinary fails
      const mockResults = req.files.map((file, index) => ({
        url: `https://via.placeholder.com/800x600/1B4D3E/FFFFFF?text=Upload+Failed+${index + 1}`,
        publicId: `mock_image_${Date.now()}_${index}`,
        width: 800,
        height: 600,
        format: 'jpg'
      }));

      res.status(200).json({
        success: true,
        message: 'Images uploaded using fallback service (Cloudinary failed)',
        images: mockResults,
        warning: 'Cloudinary upload failed, using placeholder images'
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
});

/**
 * Upload single image
 * POST /api/upload/image
 */
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image provided'
      });
    }

    try {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const uploadResult = await uploadImage(base64, 'events');

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully to Cloudinary',
        image: uploadResult
      });
    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed:', cloudinaryError);
      
      // Fallback to mock image if Cloudinary fails
      const mockResult = {
        url: `https://via.placeholder.com/800x600/1B4D3E/FFFFFF?text=Upload+Failed`,
        publicId: `mock_image_${Date.now()}`,
        width: 800,
        height: 600,
        format: 'jpg'
      };

      res.status(200).json({
        success: true,
        message: 'Image uploaded using fallback service (Cloudinary failed)',
        image: mockResult,
        warning: 'Cloudinary upload failed, using placeholder image'
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

/**
 * Delete image by public ID
 * DELETE /api/upload/images/:publicId
 */
router.delete('/images/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    await deleteImage(publicId);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

/**
 * Get images from a specific event folder
 * GET /api/upload/gallery/:eventName
 */
router.get('/gallery/:eventName', async (req, res) => {
  try {
    const { eventName } = req.params;
    
    if (!eventName) {
      return res.status(400).json({
        success: false,
        message: 'Event name is required'
      });
    }

    try {
      // Use the imported function
      const folderPath = `events/${eventName}`;
      const images = await getImagesFromFolder(folderPath);

      res.status(200).json({
        success: true,
        message: 'Images retrieved successfully',
        eventName,
        images
      });
    } catch (cloudinaryError) {
      console.warn(`No images found for event: ${eventName}`, cloudinaryError);
      
      // Return empty array if no images found
      res.status(200).json({
        success: true,
        message: 'No images found for this event',
        eventName,
        images: []
      });
    }
  } catch (error) {
    console.error('Gallery fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images',
      error: error.message
    });
  }
});

/**
 * Get images for multiple events
 * POST /api/upload/gallery/multiple
 */
router.post('/gallery/multiple', async (req, res) => {
  try {
    const { eventNames } = req.body;
    
    if (!eventNames || !Array.isArray(eventNames)) {
      return res.status(400).json({
        success: false,
        message: 'Event names array is required'
      });
    }

    try {
      // Import the function dynamically to avoid client-side issues
      const { getImagesFromFolder } = await import('../src/services/imageService.js');
      const eventImages = {};
      
      await Promise.all(
        eventNames.map(async (eventName) => {
          try {
            const folderPath = `events/${eventName}`;
            const images = await getImagesFromFolder(folderPath);
            eventImages[eventName] = images;
          } catch (error) {
            console.warn(`No images found for event: ${eventName}`);
            eventImages[eventName] = [];
          }
        })
      );

      res.status(200).json({
        success: true,
        message: 'Gallery images retrieved successfully',
        eventImages
      });
    } catch (cloudinaryError) {
      console.error('Cloudinary error:', cloudinaryError);
      
      // Return empty object if Cloudinary fails
      const eventImages = {};
      eventNames.forEach(eventName => {
        eventImages[eventName] = [];
      });

      res.status(200).json({
        success: true,
        message: 'Gallery images could not be retrieved from Cloudinary',
        eventImages,
        warning: 'Cloudinary service unavailable'
      });
    }
  } catch (error) {
    console.error('Gallery fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images',
      error: error.message
    });
  }
});

export default router;
