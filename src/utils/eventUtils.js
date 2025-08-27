/**
 * Format event for FullCalendar display
 * @param {Object} event - Event object from API
 * @returns {Object} FullCalendar event object
 */
export const formatEventForCalendar = (event) => {
  // Create proper start date/time for FullCalendar
  let startDateTime = event.date;
  
  // If time is provided, combine date and time
  if (event.time) {
    // Ensure date is in YYYY-MM-DD format and time is in HH:MM format
    const dateStr = event.date.includes('T') ? event.date.split('T')[0] : event.date;
    const timeStr = event.time.length === 5 ? event.time : `${event.time}:00`.substring(0, 5);
    startDateTime = `${dateStr}T${timeStr}:00`;
  } else {
    // For all-day events, just use the date
    startDateTime = event.date.includes('T') ? event.date.split('T')[0] : event.date;
  }
  
  return {
    id: event._id || event.id,
    title: event.title,
    start: startDateTime,
    allDay: !event.time,
    backgroundColor: getCategoryColor(event.category),
    borderColor: getCategoryColor(event.category),
    textColor: '#ffffff',
    extendedProps: {
      originalId: event._id || event.id, // Store original ID for navigation
      time: event.time,
      location: typeof event.location === 'string' ? event.location : 
               event.location?.address || event.location?.city || 'TBD',
      category: event.category,
      description: event.description,
      shortDescription: event.shortDescription,
      imageUrl: event.images?.[0]?.url || event.imageUrl,
      organizer: event.organizer
    }
  };
};

/**
 * Utility functions for event management
 */

/**
 * Trigger calendar refresh across the application
 * This function dispatches custom events and updates localStorage
 * to notify all components that events have been updated
 */
export const triggerCalendarRefresh = () => {
  // Dispatch custom event for same-tab components
  window.dispatchEvent(new CustomEvent('eventsUpdated', {
    detail: { timestamp: Date.now() }
  }));
  
  // Update localStorage to trigger refresh in other tabs
  localStorage.setItem('eventsUpdated', Date.now().toString());
  // Remove immediately to avoid storage buildup
  setTimeout(() => {
    localStorage.removeItem('eventsUpdated');
  }, 100);
  
  console.log('Calendar refresh triggered');
};

/**
 * Format event date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatEventDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format event time for display
 * @param {string} timeString - Time string (HH:MM format)
 * @returns {string} Formatted time
 */
export const formatEventTime = (timeString) => {
  if (!timeString) return '';
  
  try {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};

/**
 * Get category color for UI display
 * @param {string} category - Event category
 * @returns {string} CSS color class or hex color
 */
export const getCategoryColor = (category) => {
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

/**
 * Check if an event date is in the future
 * @param {string} eventDate - Event date string
 * @returns {boolean} True if event is upcoming
 */
export const isUpcomingEvent = (eventDate) => {
  const today = new Date();
  const event = new Date(eventDate);
  return event >= today;
};

/**
 * Sort events by date
 * @param {Array} events - Array of events
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted events array
 */
export const sortEventsByDate = (events, order = 'asc') => {
  return events.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    if (order === 'desc') {
      return dateB - dateA;
    }
    return dateA - dateB;
  });
};

/**
 * Filter events by category
 * @param {Array} events - Array of events
 * @param {string} category - Category to filter by ('all' for no filter)
 * @returns {Array} Filtered events array
 */
export const filterEventsByCategory = (events, category) => {
  if (category === 'all') return events;
  return events.filter(event => event.category === category);
};

/**
 * Search events by title, description, or location
 * @param {Array} events - Array of events
 * @param {string} query - Search query
 * @returns {Array} Filtered events array
 */
export const searchEvents = (events, query) => {
  if (!query || query.trim() === '') return events;
  
  const searchTerm = query.toLowerCase().trim();
  
  return events.filter(event => {
    const title = event.title?.toLowerCase() || '';
    const description = event.description?.toLowerCase() || '';
    const shortDescription = event.shortDescription?.toLowerCase() || '';
    const location = typeof event.location === 'string' 
      ? event.location.toLowerCase() 
      : (event.location?.address?.toLowerCase() || '');
    
    return title.includes(searchTerm) ||
           description.includes(searchTerm) ||
           shortDescription.includes(searchTerm) ||
           location.includes(searchTerm);
  });
};
