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
  AlertTriangle,
  Heart,
  Bookmark,
  User,
  Mail,
  Phone,
  ExternalLink,
  Info,
  Sparkles
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { getEventById } from '../services/eventServiceClient';

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading event with ID:', id);
      const eventData = await getEventById(id);
      console.log('Event data received:', eventData);
      setEvent(eventData);
    } catch (err) {
      console.error('Error loading event:', err);
      setError('Event not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (event?.images && event.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === event.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (event?.images && event.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? event.images.length - 1 : prev - 1
      );
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Cultural: 'from-purple-500 to-pink-500',
      Sports: 'from-blue-500 to-cyan-500',
      Workshop: 'from-green-500 to-emerald-500',
      Seminar: 'from-orange-500 to-amber-500',
      Conference: 'from-indigo-500 to-purple-500',
      Competition: 'from-red-500 to-rose-500'
    };
    return colors[category] || 'from-gray-500 to-slate-500';
  };

  const getCategoryBadgeColor = (category) => {
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

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const getTimeUntilEvent = () => {
    const eventDate = new Date(event.date);
    const now = new Date();
    const diffTime = eventDate - now;
    
    if (diffTime <= 0) return null;
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''}`;
    return `In ${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''}`;
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
  const timeUntilEvent = getTimeUntilEvent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section with Floating Background */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 right-20 w-60 h-60 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative container section-padding">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-700 rounded-2xl hover:bg-white/90 hover:shadow-lg transition-all duration-300 font-medium mb-8 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Events
          </motion.button>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Category and Status Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`px-4 py-2 rounded-2xl text-sm font-semibold border backdrop-blur-sm ${getCategoryBadgeColor(event.category)}`}
                >
                  <Sparkles className="w-4 h-4 mr-2 inline" />
                  {event.category}
                </motion.span>
                
                {isUpcoming && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="px-4 py-2 rounded-2xl text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 backdrop-blur-sm"
                  >
                    <Star className="w-4 h-4 mr-2 inline animate-pulse" />
                    {timeUntilEvent || 'Upcoming'}
                  </motion.span>
                )}
                
                {!isUpcoming && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="px-4 py-2 rounded-2xl text-sm font-semibold bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-200 backdrop-blur-sm"
                  >
                    <Clock className="w-4 h-4 mr-2 inline" />
                    Concluded
                  </motion.span>
                )}
              </div>
              
              {/* Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight"
              >
                {event.title}
              </motion.h1>
              
              {/* Short Description */}
              {event.shortDescription && (
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="text-xl text-gray-600 leading-relaxed"
                >
                  {event.shortDescription}
                </motion.p>
              )}
              
              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="flex flex-wrap items-center gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg ${
                    isLiked 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-200' 
                      : 'bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 hover:bg-white/90 hover:shadow-xl'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg ${
                    isBookmarked 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-200' 
                      : 'bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 hover:bg-white/90 hover:shadow-xl'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  {isBookmarked ? 'Saved' : 'Save'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-lg shadow-purple-200"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Content - Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="relative"
            >
              {event.images && event.images.length > 0 ? (
                <div className="relative group">
                  {/* Main Image Container */}
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-gray-300/50">
                    <img
                      src={event.images[currentImageIndex]?.url || event.images[0]?.url}
                      alt={event.title}
                      className="w-full h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    
                    {/* Image Navigation */}
                    {event.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                        
                        {/* Image Indicators */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {event.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index === currentImageIndex ? 'bg-white shadow-lg' : 'bg-white/50 hover:bg-white/70'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl animate-pulse"></div>
                  <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
                </div>
              ) : (
                <div className="w-full h-80 lg:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Calendar className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">No image available</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100/50 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${getCategoryColor(event.category)}`}></div>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Info className="w-6 h-6 text-blue-500" />
                  Event Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-600 mb-1">Event Date</p>
                      <p className="text-gray-900 font-bold text-lg">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </motion.div>
                  
                  {event.time && (
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-purple-600 mb-1">Event Time</p>
                        <p className="text-gray-900 font-bold text-lg">{event.time}</p>
                      </div>
                    </motion.div>
                  )}
                  
                  {event.location && (
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 md:col-span-2"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-600 mb-1">Location</p>
                        <p className="text-gray-900 font-bold text-lg">
                          {typeof event.location === 'string' 
                            ? event.location 
                            : `${event.location.address || ''}, ${event.location.city || ''}, ${event.location.state || ''} ${event.location.zipCode || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*/, '').replace(/,\s*$/, '').trim()
                          }
                        </p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-green-500" />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100/50 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Star className="w-6 h-6 text-yellow-500" />
                  About This Event
                </h2>
              </div>
              <div className="p-8">
                <div className="prose prose-lg max-w-none">
                  <p className={`text-gray-700 leading-relaxed text-lg transition-all duration-300 ${
                    showFullDescription ? '' : 'line-clamp-6'
                  }`}>
                    {event.description}
                  </p>
                  {event.description && event.description.length > 300 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg"
                    >
                      {showFullDescription ? 'Show Less' : 'Read More'}
                      <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${showFullDescription ? 'rotate-90' : ''}`} />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Organizer Info */}
            {event.organizer && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100/50 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-8 py-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Users className="w-6 h-6 text-emerald-500" />
                    Event Organizer
                  </h2>
                </div>
                <div className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <h3 className="text-xl font-bold text-gray-900">{event.organizer.name}</h3>
                      {event.organizer.email && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <Mail className="w-5 h-5 text-blue-500" />
                          <a href={`mailto:${event.organizer.email}`} className="hover:text-blue-600 transition-colors">
                            {event.organizer.email}
                          </a>
                        </div>
                      )}
                      {event.organizer.phone && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <Phone className="w-5 h-5 text-green-500" />
                          <a href={`tel:${event.organizer.phone}`} className="hover:text-green-600 transition-colors">
                            {event.organizer.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Status Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100/50 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${getCategoryColor(event.category)}`}></div>
              <div className="p-6">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg ${
                      isUpcoming 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                        : 'bg-gradient-to-br from-gray-500 to-slate-500'
                    }`}
                  >
                    <Calendar className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h3 className={`text-xl font-bold mb-2 ${
                    isUpcoming ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {isUpcoming ? 'Upcoming Event' : 'Past Event'}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    {isUpcoming ? 
                      (timeUntilEvent ? `${timeUntilEvent} • Don't miss out!` : 'Mark your calendar') : 
                      'This event has concluded'
                    }
                  </p>
                  
                  {isUpcoming && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold shadow-lg shadow-green-200"
                    >
                      <Calendar className="w-5 h-5" />
                      Add to Calendar
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100/50 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/gallery')}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 font-semibold shadow-lg"
                >
                  <Calendar className="w-5 h-5" />
                  View All Events
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/calendar')}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg"
                >
                  <Clock className="w-5 h-5" />
                  Event Calendar
                </motion.button>
              </div>
            </motion.div>

            {/* Event Meta */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100/50 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Event Details</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Category</span>
                  <span className={`px-3 py-1 rounded-xl text-sm font-semibold ${getCategoryBadgeColor(event.category)}`}>
                    {event.category}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Status</span>
                  <span className={`px-3 py-1 rounded-xl text-sm font-semibold ${
                    isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isUpcoming ? 'Upcoming' : 'Concluded'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Created</span>
                  <span className="text-gray-900 font-medium">
                    {event.createdAt ? new Date(event.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
