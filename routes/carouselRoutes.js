import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Carousel from '../src/models/Carousel.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Function to initialize default carousel items - to be called from server.js
export const initializeDefaultCarouselItems = async () => {
  try {
    const count = await Carousel.countDocuments();
    if (count === 0) {
      const defaultItems = [
        {
          description: 'Annual Tech Conference 2025 - Embracing Innovation and Digital Transformation',
          imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
          order: 1
        },
        {
          description: 'Cultural Night Celebration - Showcasing Diverse Talents and Traditions',
          imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
          order: 2
        },
        {
          description: 'Sports Day Highlights - Athletic Excellence and Team Spirit',
          imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
          order: 3
        }
      ];
      
      await Carousel.insertMany(defaultItems);
      console.log('✅ Default carousel items initialized');
    }
  } catch (error) {
    console.error('❌ Error initializing default carousel items:', error);
  }
};

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (buffer, originalname) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'carousel',
        public_id: `carousel_${Date.now()}`,
        transformation: [
          { width: 1200, height: 800, crop: 'fill', quality: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

// GET /api/carousel - Get all carousel items
router.get('/', async (req, res) => {
  try {
    const carouselItems = await Carousel.getActiveItems();
    
    // Transform the MongoDB documents to match the expected format
    const formattedItems = carouselItems.map(item => ({
      id: item._id.toString(),
      description: item.description,
      imageUrl: item.imageUrl,
      order: item.order,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
    
    res.json(formattedItems);
  } catch (error) {
    console.error('Error fetching carousel items:', error);
    res.status(500).json({ error: 'Failed to fetch carousel items' });
  }
});

// POST /api/carousel - Create new carousel item
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { description, order } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    let imageUrl = '';
    
    // Upload image to Cloudinary if provided
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ error: 'Failed to upload image' });
      }
    } else {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Get the next order number if not provided
    let itemOrder = parseInt(order);
    if (!itemOrder) {
      const lastItem = await Carousel.findOne().sort({ order: -1 });
      itemOrder = lastItem ? lastItem.order + 1 : 1;
    }

    const newItem = new Carousel({
      description,
      imageUrl,
      order: itemOrder
    });

    await newItem.save();
    
    // Return formatted response
    const formattedItem = {
      id: newItem._id.toString(),
      description: newItem.description,
      imageUrl: newItem.imageUrl,
      order: newItem.order,
      createdAt: newItem.createdAt,
      updatedAt: newItem.updatedAt
    };
    
    res.status(201).json(formattedItem);
  } catch (error) {
    console.error('Error creating carousel item:', error);
    res.status(500).json({ error: 'Failed to create carousel item' });
  }
});

// PUT /api/carousel/:id - Update carousel item
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { description, order } = req.body;

    const existingItem = await Carousel.findById(id);
    if (!existingItem) {
      return res.status(404).json({ error: 'Carousel item not found' });
    }

    let imageUrl = existingItem.imageUrl;

    // Upload new image to Cloudinary if provided
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        imageUrl = result.secure_url;

        // Optionally delete old image from Cloudinary
        if (existingItem.imageUrl && existingItem.imageUrl.includes('cloudinary.com')) {
          try {
            const urlParts = existingItem.imageUrl.split('/');
            const publicIdWithExt = urlParts[urlParts.length - 1];
            const publicId = `carousel/${publicIdWithExt.split('.')[0]}`;
            await cloudinary.uploader.destroy(publicId);
          } catch (deleteError) {
            console.warn('Failed to delete old image:', deleteError);
          }
        }
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ error: 'Failed to upload image' });
      }
    }

    // Update the item
    existingItem.description = description || existingItem.description;
    existingItem.imageUrl = imageUrl;
    existingItem.order = order ? parseInt(order) : existingItem.order;

    const updatedItem = await existingItem.save();
    
    // Return formatted response
    const formattedItem = {
      id: updatedItem._id.toString(),
      description: updatedItem.description,
      imageUrl: updatedItem.imageUrl,
      order: updatedItem.order,
      createdAt: updatedItem.createdAt,
      updatedAt: updatedItem.updatedAt
    };
    
    res.json(formattedItem);
  } catch (error) {
    console.error('Error updating carousel item:', error);
    res.status(500).json({ error: 'Failed to update carousel item' });
  }
});

// DELETE /api/carousel/:id - Delete carousel item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Carousel.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Carousel item not found' });
    }

    // Delete image from Cloudinary
    if (item.imageUrl && item.imageUrl.includes('cloudinary.com')) {
      try {
        const urlParts = item.imageUrl.split('/');
        const publicIdWithExt = urlParts[urlParts.length - 1];
        const publicId = `carousel/${publicIdWithExt.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.warn('Failed to delete image from Cloudinary:', deleteError);
      }
    }

    await Carousel.findByIdAndDelete(id);
    
    res.json({ message: 'Carousel item deleted successfully' });
  } catch (error) {
    console.error('Error deleting carousel item:', error);
    res.status(500).json({ error: 'Failed to delete carousel item' });
  }
});

export default router;
