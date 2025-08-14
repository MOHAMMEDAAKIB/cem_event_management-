import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowLeft, 
  Share2,
  Download,
  Star,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { getEventById } from '../firebase/eventService';

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const eventData = await getEventById(id);
      setEvent(eventData);
    } catch (err) {
      console.error('Error loading event:', err);
      setError('Event not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (event?.imageUrl) {
      // If only one image, do nothing
      return;
    }
  };

  const prevImage = () => {
    if (event?.imageUrl) {
      // If only one image, do nothing
      return;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Cultural: 'bg-purple-100 text-purple-800 border-purple-200',
      Sports: 'bg-blue-100 text-blue-800 border-blue-200',
      Workshop: 'bg-green-100 text-green-800 border-green-200',
      Seminar: 'bg-orange-100 text-orange-800 border-orange-200',
      Conference: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      Competition: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: event.shortDescription || event.description,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Event link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-college-accent/20 via-white to-college-accent/10 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading event details..." />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-college-accent/20 via-white to-college-accent/10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 font-serif">Event Not Found</h1>
          <p className="text-gray-600 mb-8">
            {error || "The event you're looking for doesn't exist or may have been removed."}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2 inline" />
              Go Back
            </button>
            <button
              onClick={() => navigate('/gallery')}
              className="px-6 py-3 bg-college-primary text-white rounded-xl hover:bg-college-primary/90 transition-colors font-medium"
            >
              View All Events
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const isUpcoming = new Date(event.date) > new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-college-accent/20 via-white to-college-accent/10">
      <div className="container section-padding">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                    {isUpcoming && (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
                        <Star className="w-3 h-3 mr-1 inline" />
                        Upcoming
                      </span>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </motion.button>
                </div>
                
                <h1 className="text-4xl font-bold text-college-primary mb-6 font-serif leading-tight">
                  {event.title}
                </h1>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-college-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-college-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Date</p>
                      <p className="text-gray-900 font-semibold">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {event.time && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-college-primary/10 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-college-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Time</p>
                        <p className="text-gray-900 font-semibold">{event.time}</p>
                      </div>
                    </div>
                  )}
                  
                  {event.location && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-college-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-college-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Location</p>
                        <p className="text-gray-900 font-semibold">{event.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Short Description */}
            {event.shortDescription && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">Event Overview</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">{event.shortDescription}</p>
                </div>
              </motion.div>
            )}

            {/* Main Image */}
            {event.imageUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
              </motion.div>
            )}

            {/* Full Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">About This Event</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 font-serif">Event Status</h3>
              </div>
              <div className="p-6">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      isUpcoming ? 'bg-green-100' : 'bg-gray-100'
                    }`}
                  >
                    <Calendar className={`w-10 h-10 ${
                      isUpcoming ? 'text-green-600' : 'text-gray-600'
                    }`} />
                  </motion.div>
                  <div className={`text-xl font-bold mb-2 ${
                    isUpcoming ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {isUpcoming ? 'Upcoming Event' : 'Past Event'}
                  </div>
                  <p className="text-gray-600 mb-6">
                    {isUpcoming ? 
                      'Save this event to your calendar' : 
                      'This event has already concluded'
                    }
                  </p>
                  
                  {isUpcoming && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-college-primary text-white rounded-xl hover:bg-college-primary/90 transition-colors font-medium shadow-lg"
                    >
                      <Calendar className="w-4 h-4" />
                      Add to Calendar
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Event Meta Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 font-serif">Event Details</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Category</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Created</span>
                  <span className="text-gray-900 font-medium">
                    {event.createdAt ? new Date(event.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                {event.updatedAt && event.updatedAt !== event.createdAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="text-gray-900 font-medium">
                      {new Date(event.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 font-serif">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  <Share2 className="w-4 h-4" />
                  Share Event
                </motion.button>
                
                <button
                  onClick={() => navigate('/gallery')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-college-secondary text-gray-800 rounded-xl hover:bg-college-secondary/90 transition-colors font-medium"
                >
                  <Calendar className="w-4 h-4" />
                  View All Events
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
