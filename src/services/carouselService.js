import api from '../utils/api.js';

// Carousel API service
export const carouselService = {
  // Get all carousel items
  getCarouselItems: async () => {
    try {
      const response = await api.get('/carousel');
      return response.data;
    } catch (error) {
      console.error('Error fetching carousel items:', error);
      throw error;
    }
  },

  // Create new carousel item
  createCarouselItem: async (carouselData, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('description', carouselData.description);
      formData.append('order', carouselData.order);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await api.post('/carousel', formData, {
        headers: {
          'Content-Type': undefined, // Let browser set the content type with boundary
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creating carousel item:', error);
      throw error;
    }
  },

  // Update carousel item
  updateCarouselItem: async (id, carouselData, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('description', carouselData.description);
      formData.append('order', carouselData.order);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await api.put(`/carousel/${id}`, formData, {
        headers: {
          'Content-Type': undefined, // Let browser set the content type with boundary
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error updating carousel item:', error);
      throw error;
    }
  },

  // Delete carousel item
  deleteCarouselItem: async (id) => {
    try {
      const response = await api.delete(`/carousel/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting carousel item:', error);
      throw error;
    }
  }
};

export default carouselService;
