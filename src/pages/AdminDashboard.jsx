import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Users, 
  Trophy, 
  TrendingUp,
  LogOut,
  Settings,
  BarChart3,
  Eye,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import AdminEventForm from '../components/AdminEventForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  getAllEvents, 
  deleteEvent, 
  createEvent, 
  updateEvent,
  getUpcomingEvents,
  getPastEvents
} from '../services/eventServiceClient';
import { logout } from '../utils/auth';

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading events data...');
      
      const [allEvents, upcoming, past] = await Promise.all([
        getAllEvents(),
        getUpcomingEvents(),
        getPastEvents()
      ]);
      
      console.log('All events loaded:', allEvents);
      console.log('Upcoming events loaded:', upcoming);
      console.log('Past events loaded:', past);
      
      // Ensure we have arrays and add ID fields
      const processEvents = (events) => {
        return Array.isArray(events) ? events.map(event => ({
          ...event,
          id: event._id || event.id
        })) : [];
      };
      
      setEvents(processEvents(allEvents));
      setUpcomingEvents(processEvents(upcoming));
      setPastEvents(processEvents(past));
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load events. Please try again.');
      // Set empty arrays on error
      setEvents([]);
      setUpcomingEvents([]);
      setPastEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData, imageFiles) => {
    try {
      setSubmitting(true);
      console.log('Creating event with data:', eventData);
      console.log('Image files:', imageFiles);
      
      const newEvent = await createEvent(eventData, imageFiles);
      
      // Ensure the event has proper ID field
      const eventWithId = {
        ...newEvent,
        id: newEvent._id || newEvent.id
      };
      
      setEvents(prev => [eventWithId, ...prev]);
      
      // Update other lists if needed
      const today = new Date().toISOString().split('T')[0];
      if (eventWithId.date >= today) {
        setUpcomingEvents(prev => [...prev, eventWithId].sort((a, b) => new Date(a.date) - new Date(b.date)));
      } else {
        setPastEvents(prev => [eventWithId, ...prev]);
      }
      
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateEvent = async (eventData, imageFiles) => {
    try {
      setSubmitting(true);
      console.log('Updating event with data:', eventData);
      console.log('Image files:', imageFiles);
      
      const updatedEvent = await updateEvent(editing.id, eventData, imageFiles);
      
      setEvents(prev => prev.map(e => e.id === editing.id ? updatedEvent : e));
      setUpcomingEvents(prev => prev.map(e => e.id === editing.id ? updatedEvent : e));
      setPastEvents(prev => prev.map(e => e.id === editing.id ? updatedEvent : e));
      
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Failed to update event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      setEvents(prev => prev.filter(e => e.id !== eventId));
      setUpcomingEvents(prev => prev.filter(e => e.id !== eventId));
      setPastEvents(prev => prev.filter(e => e.id !== eventId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const stats = [
    {
      title: 'Total Events',
      value: Array.isArray(events) ? events.length : 0,
      icon: Calendar,
      color: 'from-college-primary to-college-primary/80',
      change: '+12%',
      description: 'All events'
    },
    {
      title: 'Upcoming Events',
      value: Array.isArray(upcomingEvents) ? upcomingEvents.length : 0,
      icon: TrendingUp,
      color: 'from-college-secondary to-orange-400',
      change: '+8%',
      description: 'Future events'
    },
    {
      title: 'Past Events',
      value: Array.isArray(pastEvents) ? pastEvents.length : 0,
      icon: Trophy,
      color: 'from-blue-500 to-blue-600',
      change: '+23%',
      description: 'Completed events'
    },
    {
      title: 'Success Rate',
      value: '98%',
      icon: BarChart3,
      color: 'from-green-500 to-green-600',
      change: '+2%',
      description: 'Event completion'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-college-accent/20 via-white to-college-accent/10 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-college-accent/20 via-white to-college-accent/10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200"
      >
        <div className="container">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-12 h-12 bg-gradient-to-br from-college-primary to-college-primary/80 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Settings className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-serif">Admin Dashboard</h1>
                <p className="text-gray-600">Manage your events and content</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadAllData}
                className="p-2 text-gray-600 hover:text-college-primary transition-colors rounded-lg hover:bg-gray-100"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </motion.div>

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

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 font-medium">{stat.title}</div>
              <div className="text-xs text-gray-500">{stat.description}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 font-serif">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setEditing(null); setShowForm(true); }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-college-primary text-white rounded-xl hover:bg-college-primary/90 transition-colors font-medium shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add New Event
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/admin/carousel')}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-college-secondary text-gray-800 rounded-xl hover:bg-college-secondary/90 transition-colors font-medium shadow-lg"
                >
                  <Eye className="w-5 h-5" />
                  Manage Carousel
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Recent Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 font-serif">Recent Events</h2>
                  <button 
                    onClick={() => navigate('/gallery')}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View All
                  </button>
                </div>
              </div>
              <div className="p-0">
                {!Array.isArray(events) || events.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No events yet</p>
                    <p className="text-gray-400 text-sm">Create your first event to get started</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {events.slice(0, 5).map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                        className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-college-primary/10 to-college-primary/20 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-college-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                              {event.location && event.location.address && <span>• {event.location.address}, {event.location.city}</span>}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                event.category === 'Cultural' ? 'bg-purple-100 text-purple-800' :
                                event.category === 'Sports' ? 'bg-blue-100 text-blue-800' :
                                event.category === 'Workshop' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {event.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { setEditing(event); setShowForm(true); }}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit event"
                          >
                            <Edit className="w-4 h-4 text-blue-600" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setDeleteConfirm(event)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete event"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* All Events Table - Only show if there are events */}
        {Array.isArray(events) && events.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 mt-8"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 font-serif">All Events</h2>
                <div className="text-sm text-gray-600 font-medium">{events.length} total events</div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">Event</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Location</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Category</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <motion.tr
                      key={event.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={event.images && event.images.length > 0 
                              ? event.images[0].url 
                              : 'https://via.placeholder.com/64x64?text=No+Image'}
                            alt={event.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <div className="font-semibold text-gray-900">{event.title}</div>
                            <div className="text-sm text-gray-600 truncate max-w-xs">
                              {event.shortDescription || event.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700 font-medium">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="p-4 text-gray-700">
                        {event.location && event.location.address 
                          ? `${event.location.address}, ${event.location.city}` 
                          : '-'}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          event.category === 'Cultural' ? 'bg-purple-100 text-purple-800' :
                          event.category === 'Sports' ? 'bg-blue-100 text-blue-800' :
                          event.category === 'Workshop' ? 'bg-green-100 text-green-800' :
                          event.category === 'Seminar' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {event.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { setEditing(event); setShowForm(true); }}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit event"
                          >
                            <Edit className="w-4 h-4 text-blue-600" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setDeleteConfirm(event)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete event"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {/* Event Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <AdminEventForm
                initialData={editing}
                onSubmit={editing ? handleUpdateEvent : handleCreateEvent}
                onCancel={() => { 
                  setShowForm(false); 
                  setEditing(null); 
                }}
                isLoading={submitting}
              />
            </div>
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Event</h3>
                <p className="text-gray-600">
                  Are you sure you want to delete "<strong>{deleteConfirm.title}</strong>"? 
                  This action cannot be undone.
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
                  onClick={() => handleDeleteEvent(deleteConfirm.id)}
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
}
