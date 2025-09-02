import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload,
  Save,
  X,
  ArrowLeft,
  Image as ImageIcon,
  AlertTriangle,
  Eye
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { carouselService } from '../services/carouselService';

const AdminCarouselPage = () => {
  const navigate = useNavigate();
  const [carouselItems, setCarouselItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    imageFile: null,
    order: 1
  });
  const [dragActive, setDragActive] = useState(false);

  // Load carousel items from API
  useEffect(() => {
    loadCarouselData();
  }, []);

  const loadCarouselData = async () => {
    try {
      setLoading(true);
      const items = await carouselService.getCarouselItems();
      setCarouselItems(items);
    } catch (err) {
      console.error('Error loading carousel data:', err);
      setError('Failed to load carousel data.');
      // Fallback to default items
      setCarouselItems([
        {
          id: '1',
          description: 'Annual Tech Conference 2025 - Embracing Innovation and Digital Transformation',
          imageUrl: 'https://via.placeholder.com/800x600?text=Tech+Conference',
          order: 1
        },
        {
          id: '2',
          description: 'Cultural Night Celebration - Showcasing Diverse Talents and Traditions',
          imageUrl: 'https://via.placeholder.com/800x600?text=Cultural+Night',
          order: 2
        },
        {
          id: '3',
          description: 'Sports Day Highlights - Athletic Excellence and Team Spirit',
          imageUrl: 'https://via.placeholder.com/800x600?text=Sports+Day',
          order: 3
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setFormData(prev => ({ ...prev, imageFile: file }));
      setError(null); // Clear any previous errors
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setFormData(prev => ({ ...prev, imageFile: file }));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      setError('Description is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      let result;
      if (editing) {
        result = await carouselService.updateCarouselItem(editing.id, {
          description: formData.description,
          order: formData.order
        }, formData.imageFile);
      } else {
        result = await carouselService.createCarouselItem({
          description: formData.description,
          order: formData.order
        }, formData.imageFile);
      }

      // Refresh the data
      await loadCarouselData();
      
      setShowForm(false);
      setEditing(null);
      setFormData({ description: '', imageFile: null, order: 1 });
    } catch (err) {
      console.error('Error saving carousel item:', err);
      setError('Failed to save carousel item.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setFormData({
      description: item.description,
      imageFile: null,
      order: item.order
    });
    setShowForm(true);
  };

  const handleDelete = async (itemId) => {
    try {
      await carouselService.deleteCarouselItem(itemId);
      await loadCarouselData();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting carousel item:', err);
      setError('Failed to delete carousel item.');
    }
  };

  const resetForm = () => {
    setFormData({ description: '', imageFile: null, order: 1 });
    setEditing(null);
    setShowForm(false);
    setError(null);
    setDragActive(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-college-accent/20 via-white to-college-accent/10 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading carousel management..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-college-accent/20 via-white to-college-accent/10">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200">
        <div className="container">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 text-gray-600 hover:text-college-primary transition-colors rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 bg-gradient-to-br from-college-primary to-college-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-serif">Carousel Management</h1>
                <p className="text-gray-600">Manage landing page carousel images and descriptions</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              <Eye className="w-4 h-4" />
              Preview Landing Page
            </button>
          </div>
        </div>
      </div>

      <div className="container section-padding">
        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add New Button */}
        <div className="mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-3 px-6 py-3 bg-college-primary text-white rounded-xl hover:bg-college-primary/90 transition-colors font-medium shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add New Carousel Item
          </motion.button>
        </div>

        {/* Carousel Items Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {carouselItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={`Carousel item ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-college-primary text-white px-2 py-1 rounded-full text-xs font-bold">
                  #{item.order}
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {item.description}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(item)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {carouselItems.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Carousel Items</h3>
            <p className="text-gray-500">Add your first carousel item to get started!</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editing ? 'Edit Carousel Item' : 'Add New Carousel Item'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {submitting && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
                    <div className="text-center">
                      <LoadingSpinner size="large" />
                      <p className="mt-4 text-gray-600 font-medium">
                        {editing ? 'Updating carousel item...' : 'Creating carousel item...'}
                      </p>
                    </div>
                  </div>
                )}
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  <div 
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                      dragActive 
                        ? 'border-college-primary bg-college-primary/5' 
                        : 'border-gray-300 hover:border-college-primary'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {formData.imageFile || editing?.imageUrl ? (
                      <div className="space-y-4">
                        <img
                          src={formData.imageFile ? URL.createObjectURL(formData.imageFile) : editing?.imageUrl}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg mx-auto"
                        />
                        <div className="flex gap-2 justify-center">
                          <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            Change Image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, imageFile: null }))}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            Remove Image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <div className="pointer-events-none">
                          <Upload className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-college-primary' : 'text-gray-400'}`} />
                          <p className={`mb-2 font-medium ${dragActive ? 'text-college-primary' : 'text-gray-600'}`}>
                            {dragActive ? 'Drop image here' : 'Click to upload or drag and drop'}
                          </p>
                          <p className="text-gray-400 text-sm">Supports: JPG, PNG, GIF (Max: 5MB)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter event description for the carousel..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-college-primary focus:border-transparent resize-none"
                    required
                  />
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-college-primary focus:border-transparent"
                    required
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !formData.description.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-college-primary text-white rounded-xl hover:bg-college-primary/90 transition-colors font-medium disabled:opacity-50"
                  >
                    {submitting ? (
                      <LoadingSpinner size="small" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editing ? 'Update' : 'Save'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Carousel Item</h3>
                <p className="text-gray-600">
                  Are you sure you want to delete this carousel item? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCarouselPage;
