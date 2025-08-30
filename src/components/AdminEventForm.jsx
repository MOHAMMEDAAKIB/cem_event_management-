import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Upload, 
  X, 
  Save, 
  Image as ImageIcon, 
  Type,
  FileText,
  Tag,
  Clock
} from 'lucide-react';
import { uploadMultipleImages } from '../services/imageService';

const AdminEventForm = ({ 
  onSubmit, 
  onCancel, 
  initialData = null, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    location: {
      address: initialData?.location?.address || '',
      city: initialData?.location?.city || '',
      state: initialData?.location?.state || '',
      zipCode: initialData?.location?.zipCode || ''
    },
    organizer: {
      name: initialData?.organizer?.name || '',
      email: initialData?.organizer?.email || '',
      phone: initialData?.organizer?.phone || ''
    },
    category: initialData?.category || 'Cultural',
    description: initialData?.description || '',
    shortDescription: initialData?.shortDescription || ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || '');
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const categories = ['Cultural', 'Sports', 'Workshop', 'Seminar', 'Conference', 'Competition'];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event name is required';
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required';
    }

    if (!formData.location.address.trim()) {
      newErrors.locationAddress = 'Event address is required';
    }

    if (!formData.location.city.trim()) {
      newErrors.locationCity = 'City is required';
    }

    if (!formData.organizer.name.trim()) {
      newErrors.organizerName = 'Organizer name is required';
    }

    if (!formData.organizer.email.trim()) {
      newErrors.organizerEmail = 'Organizer email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.organizer.email)) {
      newErrors.organizerEmail = 'Please enter a valid email address';
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    } else if (formData.shortDescription.length > 150) {
      newErrors.shortDescription = 'Short description must be 150 characters or less';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 800) {
      newErrors.description = 'Description must be 800 characters or less';
    }

    // Image is now optional - remove the requirement
    // if (!initialData && !imageFile) {
    //   newErrors.image = 'Event image is required';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested object properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file'
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 5MB'
        }));
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(initialData?.imageUrl || '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Create an array to hold image files if they exist
    const imageFiles = imageFile ? [imageFile] : [];
    
    // Call the onSubmit function with form data and image files array
    onSubmit(formData, imageFiles);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-college-primary to-college-primary/90 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {initialData ? 'Edit Event' : 'Create New Event'}
                </h2>
                <p className="text-college-accent/80">
                  {initialData ? 'Update event details' : 'Add a new event to your calendar'}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              {/* Event Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Type className="w-4 h-4" />
                  Event Name *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-0 ${
                    errors.title 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-college-primary'
                  }`}
                  placeholder="Enter event name"
                />
                <AnimatePresence>
                  {errors.title && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.title}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Date and Time */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4" />
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-0 ${
                      errors.date 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-college-primary'
                    }`}
                  />
                  <AnimatePresence>
                    {errors.date && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.date}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="w-4 h-4" />
                    Event Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-college-primary transition-all focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Location Details */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">
                  Event Location *
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="location.address"
                      value={formData.location.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-0 ${
                        errors.locationAddress 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-college-primary'
                      }`}
                      placeholder="Street Address *"
                    />
                    <AnimatePresence>
                      {errors.locationAddress && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {errors.locationAddress}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-0 ${
                        errors.locationCity 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-college-primary'
                      }`}
                      placeholder="City *"
                    />
                    <AnimatePresence>
                      {errors.locationCity && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {errors.locationCity}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <input
                    type="text"
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-college-primary transition-all focus:outline-none focus:ring-0"
                    placeholder="State"
                  />
                  <input
                    type="text"
                    name="location.zipCode"
                    value={formData.location.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-college-primary transition-all focus:outline-none focus:ring-0"
                    placeholder="ZIP Code"
                  />
                </div>
              </div>

              {/* Organizer Information */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">
                  Organizer Information *
                </label>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="organizer.name"
                      value={formData.organizer.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-0 ${
                        errors.organizerName 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-college-primary'
                      }`}
                      placeholder="Organizer Name *"
                    />
                    <AnimatePresence>
                      {errors.organizerName && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {errors.organizerName}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="email"
                        name="organizer.email"
                        value={formData.organizer.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-0 ${
                          errors.organizerEmail 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 focus:border-college-primary'
                        }`}
                        placeholder="Email Address *"
                      />
                      <AnimatePresence>
                        {errors.organizerEmail && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors.organizerEmail}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <input
                      type="tel"
                      name="organizer.phone"
                      value={formData.organizer.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-college-primary transition-all focus:outline-none focus:ring-0"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Tag className="w-4 h-4" />
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-college-primary transition-all focus:outline-none focus:ring-0"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Short Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="w-4 h-4" />
                  Short Description *
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  rows={3}
                  maxLength={150}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-0 resize-none ${
                    errors.shortDescription 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-college-primary'
                  }`}
                  placeholder="Brief description for event cards (150 characters max)"
                />
                <div className="flex justify-between items-center mt-1">
                  <AnimatePresence>
                    {errors.shortDescription && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-sm"
                      >
                        {errors.shortDescription}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <span className="text-sm text-gray-500">
                    {formData.shortDescription.length}/150
                  </span>
                </div>
              </div>

              {/* Full Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="w-4 h-4" />
                  Full Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  maxLength={800}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-0 resize-none ${
                    errors.description 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-college-primary'
                  }`}
                  placeholder="Detailed description of the event (800 characters max)"
                />
                <div className="flex justify-between items-center mt-1">
                  <AnimatePresence>
                    {errors.description && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-sm"
                      >
                        {errors.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <span className="text-sm text-gray-500">
                    {formData.description.length}/800
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
                <ImageIcon className="w-4 h-4" />
                Event Image (Optional)
              </label>
              
              <div className="space-y-4">
                {/* Image Preview */}
                {imagePreview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-xl overflow-hidden border-2 border-gray-200"
                  >
                    <img
                      src={imagePreview}
                      alt="Event preview"
                      className="w-full h-64 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {/* Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer hover:border-college-primary hover:bg-college-accent/20 ${
                    errors.image ? 'border-red-300' : 'border-gray-300'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                <AnimatePresence>
                  {errors.image && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-sm"
                    >
                      {errors.image}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-8 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-college-primary text-white rounded-xl hover:bg-college-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {initialData ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {initialData ? 'Update Event' : 'Create Event'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminEventForm;
