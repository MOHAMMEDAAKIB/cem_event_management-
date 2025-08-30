import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, FileText, Users, Upload, Save } from 'lucide-react';

export default function EventForm({ event, onClose, onSave }) {
  const [form, setForm] = useState({
    title: event?.title || '',
    date: event?.date ? event.date.slice(0, 10) : '',
    time: event?.time || '',
    location: event?.location || '',
    category: event?.category || 'Workshop',
    description: event?.description || '',
    participants: event?.participants?.map(p => p.name).join(', ') || '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = ['Workshop', 'Seminar', 'Sports', 'Cultural'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.location.trim()) newErrors.location = 'Location is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    else if (form.description.length > 800) newErrors.description = 'Description must be 800 characters or less';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const eventData = {
        ...form,
        participants: form.participants
          ? form.participants.split(',').map((name, index) => ({
              id: Date.now() + index,
              name: name.trim(),
              avatar: `https://i.pravatar.cc/150?img=${index + 1}`
            }))
          : [],
        images: [
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3',
          'https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-4.0.3',
        ],
        _id: event?._id || Date.now().toString()
      };
      
      onSave(eventData);
    } catch (err) {
      console.error('Error saving event:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading-2 mb-0">
          {event ? 'Edit Event' : 'Add New Event'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="form-group">
          <label className="form-label">
            <Calendar className="w-4 h-4 inline mr-2" />
            Event Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter event title"
            className={`form-input ${errors.title ? 'border-red-500' : ''}`}
            required
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Date and Time Row */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date
            </label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className={`form-input ${errors.date ? 'border-red-500' : ''}`}
              required
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <Clock className="w-4 h-4 inline mr-2" />
              Time
            </label>
            <input
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        {/* Location and Category Row */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">
              <MapPin className="w-4 h-4 inline mr-2" />
              Location
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Enter event location"
              className={`form-input ${errors.location ? 'border-red-500' : ''}`}
              required
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="form-input form-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">
            <FileText className="w-4 h-4 inline mr-2" />
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter event description (800 characters max)"
            className={`form-input form-textarea ${errors.description ? 'border-red-500' : ''}`}
            rows={4}
            maxLength={800}
            required
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            <div className="flex-1"></div>
            <span className="text-sm text-gray-500">{form.description.length}/800</span>
          </div>
        </div>

        {/* Participants */}
        <div className="form-group">
          <label className="form-label">
            <Users className="w-4 h-4 inline mr-2" />
            Participants (Optional)
          </label>
          <input
            name="participants"
            value={form.participants}
            onChange={handleChange}
            placeholder="Enter participant names, separated by commas"
            className="form-input"
          />
          <p className="text-sm text-gray-600 mt-1">
            Add participant names separated by commas (e.g., John Doe, Jane Smith)
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex-1"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </div>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                {event ? 'Update Event' : 'Create Event'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
