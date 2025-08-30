import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Search, Filter, Plus, RefreshCw, AlertTriangle } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { getAllEvents } from '../services/eventServiceClient';

export default function CalendarPage() {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ref to keep track of active tooltips
  const activeTooltips = React.useRef([]);

  const categories = ['all', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Conference', 'Competition'];

  useEffect(() => {
    loadEvents();
    
    // Add global cleanup for page unload
    const handleBeforeUnload = () => {
      cleanupAllTooltips();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup function to remove any remaining tooltips when component unmounts
    return () => {
      cleanupAllTooltips();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Clean up tooltips when location changes (navigation)
  useEffect(() => {
    cleanupAllTooltips();
  }, [location]);

  // Periodic cleanup of orphaned tooltips
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      // Remove any tooltips that might have been orphaned
      const orphanedTooltips = document.querySelectorAll('.fc-tooltip');
      orphanedTooltips.forEach(tooltip => {
        if (tooltip && tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(cleanupInterval);
  }, []);

  // Function to clean up all tooltips
  const cleanupAllTooltips = () => {
    activeTooltips.current.forEach(tooltip => {
      if (tooltip && tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
    });
    activeTooltips.current = [];
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllEvents();
      
      // Handle array response directly
      const events = Array.isArray(response) ? response : [];
      
      // Map events for FullCalendar
      const mapped = events.map(e => ({
        id: e._id || e.id,
        title: e.title,
        date: e.date,
        start: e.date, // Ensure FullCalendar recognizes the date
        category: e.category,
        extendedProps: {
          time: e.time,
          location: typeof e.location === 'string' ? e.location : e.location?.address,
          category: e.category,
          description: e.description,
          shortDescription: e.shortDescription,
          imageUrl: e.images?.[0]?.url || e.imageUrl,
          venue: e.venue || (typeof e.location === 'string' ? e.location : e.location?.address)
        },
        // Add time to title if available
        displayTitle: e.time ? `${e.time} - ${e.title}` : e.title,
        // Ensure venue is available
        venue: e.venue || (typeof e.location === 'object' && e.location?.address) || e.location || ''
      }));
      
      setAllEvents(mapped);
      setFilteredEvents(mapped);
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = query => {
    let filtered = allEvents;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }
    
    if (query) {
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.extendedProps.description?.toLowerCase().includes(query.toLowerCase()) ||
        e.extendedProps.shortDescription?.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setFilteredEvents(filtered);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    let filtered = allEvents;
    
    if (category !== 'all') {
      filtered = allEvents.filter(e => e.category === category);
    }
    
    setFilteredEvents(filtered);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Cultural: '#8B5CF6',
      Sports: '#3B82F6',
      Workshop: '#10B981',
      Seminar: '#F59E0B',
      Conference: '#6366F1',
      Competition: '#EF4444',
    };
    return colors[category] || '#6B7280';
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
              onClick={loadEvents}
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
                      onClick={loadEvents}
                      className="p-2 text-gray-600 hover:text-college-primary transition-colors rounded-lg hover:bg-gray-100"
                      title="Refresh calendar"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="calendar-container">
                  <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={filteredEvents.map(event => ({
                      ...event,
                      title: event.displayTitle || event.title,
                      backgroundColor: getCategoryColor(event.category),
                      borderColor: getCategoryColor(event.category),
                      textColor: '#ffffff'
                    }))}
                    eventClick={info => {
                      // Clean up any existing tooltips before navigation
                      cleanupAllTooltips();
                      navigate(`/events/${info.event.id}`);
                    }}
                    height={600}
                    headerToolbar={{
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth'
                    }}
                    eventDisplay="block"
                    dayMaxEvents={3}
                    moreLinkText="more events"
                    eventClassNames="cursor-pointer"
                    eventContent={(arg) => {
                      return {
                        html: `
                          <div class="fc-event-main-frame">
                            <div class="fc-event-title-container">
                              <div class="fc-event-title fc-sticky">
                                <strong>${arg.event.title}</strong>
                                ${arg.event.extendedProps.time ? `<br><small>⏰ ${arg.event.extendedProps.time}</small>` : ''}
                                ${arg.event.venue || arg.event.extendedProps.venue ? `<br><small>📍 ${arg.event.venue || arg.event.extendedProps.venue}</small>` : ''}
                              </div>
                            </div>
                          </div>
                        `
                      };
                    }}
                    eventMouseEnter={(info) => {
                      info.el.style.transform = 'scale(1.02)';
                      info.el.style.transition = 'transform 0.2s ease';
                      
                      // Add tooltip with more details
                      const tooltip = document.createElement('div');
                      tooltip.className = 'fc-tooltip';
                      tooltip.innerHTML = `
                        <div class="bg-gray-900 text-white p-3 rounded-lg shadow-lg max-w-sm">
                          <h4 class="font-bold mb-2">${info.event.title}</h4>
                          ${info.event.extendedProps.time ? `<p class="text-sm mb-1">⏰ ${info.event.extendedProps.time}</p>` : ''}
                          ${info.event.venue || info.event.extendedProps.venue ? `<p class="text-sm mb-1">📍 ${info.event.venue || info.event.extendedProps.venue}</p>` : ''}
                          ${info.event.extendedProps.shortDescription ? `<p class="text-sm text-gray-300">${info.event.extendedProps.shortDescription}</p>` : ''}
                          <p class="text-xs text-gray-400 mt-2">Click to view details</p>
                        </div>
                      `;
                      tooltip.style.position = 'absolute';
                      tooltip.style.zIndex = '1000';
                      tooltip.style.pointerEvents = 'none';
                      document.body.appendChild(tooltip);
                      
                      // Track this tooltip
                      activeTooltips.current.push(tooltip);
                      
                      const updateTooltipPosition = (e) => {
                        tooltip.style.left = (e.pageX + 10) + 'px';
                        tooltip.style.top = (e.pageY + 10) + 'px';
                      };
                      
                      info.el.addEventListener('mousemove', updateTooltipPosition);
                      info.el.tooltip = tooltip;
                    }}
                    eventMouseLeave={(info) => {
                      info.el.style.transform = 'scale(1)';
                      if (info.el.tooltip) {
                        // Remove from tracking array
                        const index = activeTooltips.current.indexOf(info.el.tooltip);
                        if (index > -1) {
                          activeTooltips.current.splice(index, 1);
                        }
                        // Remove from DOM
                        if (info.el.tooltip.parentNode) {
                          document.body.removeChild(info.el.tooltip);
                        }
                        info.el.tooltip = null;
                      }
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
