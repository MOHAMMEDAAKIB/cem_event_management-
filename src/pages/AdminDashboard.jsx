import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  BarChart3
} from 'lucide-react';
import EventForm from '../components/EventForm';
import { events as dummyEvents } from '../utils/dummyData';
import { logout } from '../utils/auth';

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Using dummy data instead of API calls
    setEvents(dummyEvents);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    // Remove from state (in real app, this would be an API call)
    setEvents(prev => prev.filter(event => event._id !== id));
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const stats = [
    {
      title: 'Total Events',
      value: events.length,
      icon: Calendar,
      color: 'from-primary-green to-primary-green-light',
      change: '+12%'
    },
    {
      title: 'Active Events',
      value: events.filter(e => new Date(e.date) > new Date()).length,
      icon: TrendingUp,
      color: 'from-secondary-yellow to-secondary-yellow-light',
      change: '+8%'
    },
    {
      title: 'Total Participants',
      value: '2.4K',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+23%'
    },
    {
      title: 'Success Rate',
      value: '98%',
      icon: Trophy,
      color: 'from-purple-500 to-purple-600',
      change: '+2%'
    }
  ];

  const recentEvents = events.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-green to-primary-green-light rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your events and content</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-outline btn-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container section-padding">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card hover:transform hover:scale-105 transition-all">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions and Recent Events */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-header">
                <h2 className="heading-3 mb-0">Quick Actions</h2>
              </div>
              <div className="card-body space-y-4">
                <button
                  onClick={() => { setEditing(null); setShowForm(true); }}
                  className="btn btn-primary w-full"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Event
                </button>
                <button className="btn btn-outline w-full">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Analytics
                </button>
                <button className="btn btn-secondary w-full">
                  <Users className="w-5 h-5 mr-2" />
                  Manage Users
                </button>
              </div>
            </div>
          </div>

          {/* Recent Events */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="heading-3 mb-0">Recent Events</h2>
                  <button className="btn btn-outline btn-sm">View All</button>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="space-y-1">
                  {recentEvents.map((event, index) => (
                    <div key={event._id} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(event.date).toLocaleDateString()} • {event.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditing(event); setShowForm(true); }}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Edit event"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete event"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Events Table */}
        <div className="card mt-8">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h2 className="heading-3 mb-0">All Events</h2>
              <div className="text-sm text-gray-600">{events.length} total events</div>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
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
                    <tr key={event._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-600 truncate max-w-xs">{event.description}</div>
                      </td>
                      <td className="p-4 text-gray-700">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-gray-700">{event.location}</td>
                      <td className="p-4">
                        <span className={`badge ${
                          event.category === 'Sports' ? 'badge-primary' :
                          event.category === 'Cultural' ? 'badge-secondary' :
                          'badge-success'
                        }`}>
                          {event.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => { setEditing(event); setShowForm(true); }}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            title="Edit event"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(event._id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete event"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Event Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <EventForm
              event={editing}
              onClose={() => { 
                setShowForm(false); 
                setEditing(null); 
              }}
              onSave={(savedEvent) => {
                if (editing) {
                  setEvents(prev => prev.map(e => e._id === editing._id ? savedEvent : e));
                } else {
                  setEvents(prev => [...prev, { ...savedEvent, _id: Date.now().toString() }]);
                }
                setShowForm(false);
                setEditing(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
