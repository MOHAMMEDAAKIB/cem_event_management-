import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search, Filter, Plus, RefreshCw, AlertTriangle } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAllEvents } from '../services/eventServiceClient';
import { getCategoryColor as getEventCategoryColor, searchEvents, filterEventsByCategory, formatEventForCalendar } from '../utils/eventUtils';

export default function CalendarPage() {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const categories = ['all', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Conference', 'Competition'];

  useEffect(() => {
    loadEvents();
    
    // Add event listener for when events are updated
    const handleEventsUpdated = () => {
      console.log('Events updated, refreshing calendar...');
      loadEvents(true); // Pass true to indicate this is a refresh
    };

    // Listen for custom events from admin dashboard
    window.addEventListener('eventsUpdated', handleEventsUpdated);
    
    // Also listen for storage changes (if events are updated in another tab)
    window.addEventListener('storage', (e) => {
      if (e.key === 'eventsUpdated') {
        handleEventsUpdated();
      }
    });

    // Check for updates every 30 seconds when the tab is active
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadEvents(true);
      }
    }, 30000);

    return () => {
      window.removeEventListener('eventsUpdated', handleEventsUpdated);
      window.removeEventListener('storage', handleEventsUpdated);
      clearInterval(interval);
    };
  }, []);

  const loadEvents = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      console.log('Loading events for calendar...');
      
      const events = await getAllEvents();
      console.log('Events loaded:', events);
      
      // Handle different response structures
      const eventsList = Array.isArray(events) ? events : 
                        events?.data?.events || events?.data || 
                        events?.events || [];
      
      console.log('Events list:', eventsList);
      
      // Map events for FullCalendar using the utility function
      const mapped = eventsList.map(e => formatEventForCalendar(e));
      
      console.log('Mapped events for calendar:', mapped);
      setAllEvents(mapped);
      setFilteredEvents(mapped);
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleSearch = query => {
    let filtered = allEvents;
    
    // Apply category filter first
    if (selectedCategory !== 'all') {
      filtered = filterEventsByCategory(filtered, selectedCategory);
    }
    
    // Then apply search filter
    if (query) {
      filtered = searchEvents(filtered, query);
    }
    
    setFilteredEvents(filtered);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    let filtered = filterEventsByCategory(allEvents, category);
    setFilteredEvents(filtered);
  };

  const getCategoryColor = (category) => {
    return getEventCategoryColor(category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-college-accent/30 via-white to-college-accent/20">
      <div className="container section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-br from-college-primary to-college-primary/80 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Calendar className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="heading-1 text-college-primary mb-0 font-serif">Event Calendar</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
            Discover and plan your participation in upcoming college events. 
            Stay informed and never miss an important event.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="large" text="Loading calendar..." />
          </div>
        )}

        {/* Refresh Notification */}
        <AnimatePresence>
          {isRefreshing && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 bg-college-primary text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50"
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
              Updating calendar...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 flex items-center gap-3"
          >
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
            <button
              onClick={() => loadEvents(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
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
                <div className="flex flex-col lg:flex-row gap-6 items-center">
                  {/* Search Bar */}
                  <div className="flex-1 w-full lg:w-1/3">
                    <SearchBar onSearch={handleSearch} placeholder="Search events..." />
                  </div>

                  {/* Category Filter */}
                  <div className="w-full lg:w-auto">
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
                          onClick={() => handleCategoryFilter(category)}
                          className={`px-4 py-2 rounded-xl font-medium transition-all ${
                            selectedCategory === category
                              ? 'bg-college-primary text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category === 'all' ? 'All Events' : category}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Calendar Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 font-serif">Calendar View</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-3 h-3 bg-college-primary rounded-full"></div>
                      {filteredEvents.length} Events
                    </div>
                    <button
                      onClick={() => loadEvents(true)}
                      className="p-2 text-gray-600 hover:text-college-primary transition-colors rounded-lg hover:bg-gray-100"
                      title="Refresh calendar"
                      disabled={isRefreshing}
                    >
                      <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="calendar-container">
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={filteredEvents}
                    eventClick={info => navigate(`/events/${info.event.extendedProps.originalId || info.event.id}`)}
                    height={600}
                    headerToolbar={{
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    eventDisplay="block"
                    dayMaxEvents={3}
                    moreLinkText="more events"
                    eventClassNames="cursor-pointer"
                    displayEventTime={true}
                    eventTimeFormat={{
                      hour: 'numeric',
                      minute: '2-digit',
                      meridiem: 'short'
                    }}
                    slotLabelFormat={{
                      hour: 'numeric',
                      minute: '2-digit',
                      meridiem: 'short'
                    }}
                    eventDidMount={(info) => {
                      // Add custom styling or tooltips here
                      const timeText = info.event.extendedProps.time 
                        ? `Time: ${info.event.extendedProps.time}`
                        : 'All day event';
                      info.el.setAttribute('title', 
                        `${info.event.title}\n${timeText}\nLocation: ${info.event.extendedProps.location}`
                      );
                    }}
                    eventMouseEnter={(info) => {
                      info.el.style.transform = 'scale(1.02)';
                      info.el.style.transition = 'transform 0.2s ease';
                    }}
                    eventMouseLeave={(info) => {
                      info.el.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
            >
              {categories.slice(1).map((category, index) => {
                const count = allEvents.filter(e => e.category === category).length;
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all"
                  >
                    <div className="text-3xl font-bold text-college-primary mb-2">{count}</div>
                    <div className="text-sm text-gray-600 font-medium">{category} Events</div>
                    <div 
                      className="w-8 h-1 mx-auto mt-3 rounded-full"
                      style={{ backgroundColor: getCategoryColor(category) }}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
