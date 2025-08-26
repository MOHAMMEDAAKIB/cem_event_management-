import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Search, Filter, Camera, Eye, RefreshCw } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAllEvents } from '../services/eventServiceClient';

const GalleryPage = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['all', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Conference', 'Competition'];

  // Load events from Firebase
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const events = await getAllEvents();
      setAllEvents(events);
      setFiltered(events);
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get unique years from events
  const years = ['all', ...new Set(allEvents.map(event => 
    new Date(event.date).getFullYear()
  ))].sort((a, b) => b - a);

  const handleSearch = query => {
    applyFilters(query, selectedYear, selectedCategory);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    applyFilters('', year, selectedCategory);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    applyFilters('', selectedYear, category);
  };

  const applyFilters = (query, year, category) => {
    let filteredEvents = allEvents;
    
    if (year !== 'all') {
      filteredEvents = filteredEvents.filter(e => new Date(e.date).getFullYear() === parseInt(year));
    }
    
    if (category !== 'all') {
      filteredEvents = filteredEvents.filter(e => e.category === category);
    }
    
    if (query) {
      filteredEvents = filteredEvents.filter(e => 
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.description.toLowerCase().includes(query.toLowerCase()) ||
        e.shortDescription?.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setFiltered(filteredEvents);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const resetFilters = () => {
    setSelectedYear('all');
    setSelectedCategory('all');
    setFiltered(allEvents);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Cultural: 'badge-primary',
      Sports: 'badge-secondary',
      Workshop: 'badge-success',
      Seminar: 'badge-warning',
      Conference: 'badge-info',
      Competition: 'badge-danger',
    };
    return colors[category] || 'badge-primary';
  };

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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-br from-college-primary to-college-primary/80 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Camera className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="heading-1 text-college-primary mb-0 font-serif">Event Gallery</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
            Explore the wonderful memories from our events. Browse through 
            photos and relive the amazing moments from our college community.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="large" text="Loading events..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadEvents}
              className="flex items-center gap-2 mx-auto px-6 py-3 bg-college-primary text-white rounded-xl hover:bg-college-primary/90 transition-colors font-medium"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          </motion.div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Search and Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 mb-8"
            >
              <div className="p-8">
                <div className="space-y-6">
                  {/* Search Bar */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Search className="w-5 h-5 text-college-primary" />
                      <span className="font-semibold text-gray-700">Search Events</span>
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
                      Showing {filtered.length} of {allEvents.length} events
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
              </div>
            </motion.div>

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
                  <h2 className="text-3xl font-bold text-gray-600 mb-4 font-serif">No events found</h2>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    We couldn't find any events matching your criteria. Try adjusting your search or filters.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetFilters}
                    className="px-8 py-3 bg-college-primary text-white rounded-xl hover:bg-college-primary/90 transition-colors font-medium shadow-lg"
                  >
                    Show All Events
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
                      key={event.id}
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

            {/* Load More Indicator */}
            {filtered.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-16"
              >
                <div className="inline-flex items-center gap-4 text-sm text-gray-500">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  <span className="font-medium">You've reached the end</span>
                  <div className="w-16 h-px bg-gradient-to-l from-transparent via-gray-300 to-transparent"></div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default GalleryPage;

