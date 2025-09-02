import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Search, ChevronDown, ChevronUp, Image, RefreshCw, Calendar } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { getPastEvents } from '../services/eventServiceClient';
<<<<<<< HEAD
=======
import { getMultipleEventImages, sanitizeEventName, getThumbnailUrl, getLargeImageUrl } from '../services/galleryService';
>>>>>>> branch1

const GalleryPage = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [eventImages, setEventImages] = useState({});
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEvents, setExpandedEvents] = useState(new Set());
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

<<<<<<< HEAD
  const categories = ['all', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Conference', 'Competition'];

  // Load past events only
  useEffect(() => {
    loadEvents();
    
    // Add event listener for when events are updated
    const handleEventsUpdated = () => {
      console.log('Events updated, refreshing gallery...');
      loadEvents();
    };

    // Listen for custom events from admin dashboard
    window.addEventListener('eventsUpdated', handleEventsUpdated);
    
    // Also listen for storage changes (if events are updated in another tab)
    window.addEventListener('storage', (e) => {
      if (e.key === 'eventsUpdated') {
        handleEventsUpdated();
      }
    });

    return () => {
      window.removeEventListener('eventsUpdated', handleEventsUpdated);
      window.removeEventListener('storage', handleEventsUpdated);
    };
=======
  useEffect(() => {
    loadPastEventsAndImages();
>>>>>>> branch1
  }, []);

  const loadPastEventsAndImages = async () => {
    try {
      setLoading(true);
      setError(null);
<<<<<<< HEAD
      console.log('Loading past events for gallery...');
      
      const events = await getPastEvents();
      console.log('Past events loaded:', events);
      
      // Handle different response structures
      const eventsList = Array.isArray(events) ? events : 
                        events?.data?.events || events?.data || 
                        events?.events || [];
      
      setAllEvents(eventsList);
      setFiltered(eventsList);
=======
      
      // Get past events
      const events = await getPastEvents();
      
      // Ensure we have an array and add proper ID fields
      const processedEvents = Array.isArray(events) ? events.map(event => ({
        ...event,
        id: event._id || event.id
      })) : [];
      
      setPastEvents(processedEvents);
      setFilteredEvents(processedEvents);

      // Get images for each past event
      if (processedEvents.length > 0) {
        const eventNames = processedEvents.map(event => sanitizeEventName(event.title));
        
        try {
          const images = await getMultipleEventImages(eventNames);
          setEventImages(images);
        } catch (imageError) {
          console.warn('Could not load images from Cloudinary:', imageError);
          setEventImages({});
        }
      }
>>>>>>> branch1
    } catch (err) {
      console.error('Error loading past events:', err);
      setError('Failed to load past events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredEvents(pastEvents);
      return;
    }

    const filtered = pastEvents.filter(event =>
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase()) ||
      event.category.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredEvents(filtered);
  };

  const toggleEventExpansion = (eventId) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const openImageModal = (image, eventTitle) => {
    setSelectedImage({ ...image, eventTitle });
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventFolderName = (eventTitle) => {
    return sanitizeEventName(eventTitle);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Cultural: 'bg-purple-100 text-purple-800 border-purple-200',
      Sports: 'bg-blue-100 text-blue-800 border-blue-200',
      Workshop: 'bg-green-100 text-green-800 border-green-200',
      Seminar: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Conference: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      Competition: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-college-accent/30 via-white to-college-accent/20 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading gallery..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-college-accent/30 via-white to-college-accent/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <Camera className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Gallery</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadPastEventsAndImages}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-college-primary text-white rounded-xl hover:bg-college-primary/90 transition-colors font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-college-accent/30 via-white to-college-accent/20">
      <div className="container section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="heading-1 text-college-primary mb-0 font-serif">Event Gallery</h1>
          </div>
          
          {/* Past Events Badge */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-college-secondary/20 border border-college-secondary/30 rounded-full">
              <Calendar className="w-4 h-4 text-college-secondary" />
              <span className="text-sm font-semibold text-gray-700">Past Events Collection</span>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
<<<<<<< HEAD
            Explore the wonderful memories from our past events. Browse through 
            photos and relive the amazing moments from our college community's completed events.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="large" text="Loading past events..." />
=======
            Relive the amazing moments from our past events. Browse through photos organized by each event 
            and explore the memories we've created together.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 mb-8 p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-5 h-5 text-college-primary" />
            <span className="font-semibold text-gray-700">Search Past Events</span>
>>>>>>> branch1
          </div>
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search by event name, description, or category..."
          />
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredEvents.length} past events with photo galleries
          </div>
        </motion.div>

        {/* Events Gallery */}
        <AnimatePresence mode="wait">
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20"
            >
<<<<<<< HEAD
              <div className="p-8">
                <div className="space-y-6">
                  {/* Search Bar */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Search className="w-5 h-5 text-college-primary" />
                        <span className="font-semibold text-gray-700">Search Past Events</span>
                      </div>
                      <SearchBar 
                        onSearch={handleSearch} 
                        placeholder="Search by event name, description..."
                      />
                    </div>

                  {/* Filters */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Year Filter */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-5 h-5 text-college-primary" />
                        <span className="font-semibold text-gray-700">Filter by Year</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {years.map((year) => (
                          <motion.button
                            key={year}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleYearChange(year)}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${
                              selectedYear === year
                                ? 'bg-college-primary text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {year === 'all' ? 'All Years' : year}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Filter className="w-5 h-5 text-college-primary" />
                        <span className="font-semibold text-gray-700">Filter by Category</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <motion.button
                            key={category}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCategoryChange(category)}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${
                              selectedCategory === category
                                ? 'bg-college-secondary text-gray-800 shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {category === 'all' ? 'All Categories' : category}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Results Count */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Showing {filtered.length} of {allEvents.length} past events
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Click any event for quick view</span>
                      </div>
                      {(selectedYear !== 'all' || selectedCategory !== 'all') && (
                        <button
                          onClick={resetFilters}
                          className="text-sm text-college-primary hover:text-college-primary/80 font-medium"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </div>
                </div>
=======
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <Camera className="w-16 h-16 text-gray-400" />
>>>>>>> branch1
              </div>
              <h2 className="text-3xl font-bold text-gray-600 mb-4 font-serif">No past events found</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                We couldn't find any past events matching your search. Try a different search term.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {filteredEvents.map((event, index) => {
                const folderName = getEventFolderName(event.title);
                const images = eventImages[folderName] || [];
                const isExpanded = expandedEvents.has(event.id);

<<<<<<< HEAD
            {/* Gallery Grid */}
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-20"
                >
                  <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <Camera className="w-16 h-16 text-gray-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-600 mb-4 font-serif">No past events found</h2>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    We couldn't find any past events matching your criteria. Try adjusting your search or filters.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetFilters}
                    className="px-8 py-3 bg-college-primary text-white rounded-xl hover:bg-college-primary/90 transition-colors font-medium shadow-lg"
                  >
                    Show All Past Events
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filtered.map((event, index) => (
                    <motion.div
                      key={event._id || event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <EventCard 
                        event={event} 
                        onClick={() => handleEventClick(event)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
=======
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    {/* Event Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(event.category)}`}>
                              {event.category}
                            </span>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h3>
                          <p className="text-gray-600 text-sm">
                            {event.shortDescription || event.description}
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Image className="w-4 h-4" />
                              <span>{images.length} photos</span>
                            </div>
                            {event.venue && (
                              <span>📍 {event.venue}</span>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => toggleEventExpansion(event.id)}
                          className="ml-4 p-3 bg-college-primary/10 hover:bg-college-primary/20 rounded-xl transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-college-primary" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-college-primary" />
                          )}
                        </button>
                      </div>
                    </div>
>>>>>>> branch1

                    {/* Event Images */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          {images.length > 0 ? (
                            <div className="p-6">
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {images.map((image, imgIndex) => (
                                  <motion.div
                                    key={image.publicId}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: imgIndex * 0.05 }}
                                    className="aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300"
                                    onClick={() => openImageModal(image, event.title)}
                                  >
                                    <img
                                      src={getThumbnailUrl(image.url)}
                                      alt={`${event.title} - Photo ${imgIndex + 1}`}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                          <Image className="w-4 h-4 text-gray-700" />
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="p-6 text-center">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Camera className="w-8 h-8 text-gray-400" />
                              </div>
                              <p className="text-gray-500">No photos available for this event yet.</p>
                              <p className="text-sm text-gray-400 mt-1">
                                Photos should be uploaded to folder: events/{folderName}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {isModalOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeImageModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getLargeImageUrl(selectedImage.url)}
                alt={`${selectedImage.eventTitle} - Photo`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg">
                <h4 className="font-semibold">{selectedImage.eventTitle}</h4>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;

