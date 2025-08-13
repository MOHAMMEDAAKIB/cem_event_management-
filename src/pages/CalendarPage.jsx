import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search, Filter, Plus } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { events } from '../utils/dummyData';

export default function CalendarPage() {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const categories = ['all', 'Sports', 'Workshop', 'Seminar', 'Cultural'];

  useEffect(() => {
    // Map events for FullCalendar
    const mapped = events.map(e => ({
      id: e._id,
      title: e.title,
      date: e.date,
      category: e.category,
      extendedProps: {
        time: e.time,
        location: e.location,
        category: e.category
      }
    }));
    setAllEvents(mapped);
    setFilteredEvents(mapped);
  }, []);

  const handleSearch = query => {
    let filtered = allEvents;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }
    
    if (query) {
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(query.toLowerCase())
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
      Sports: '#3B82F6',
      Workshop: '#8B5CF6',
      Seminar: '#1E8449',
      Cultural: '#F97316',
    };
    return colors[category] || '#1E8449';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container section-padding">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-green to-primary-green-light rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="heading-1 text-primary mb-0">Event Calendar</h1>
          </div>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Discover and plan your participation in upcoming college events. 
            Stay informed and never miss an important event.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Search Bar */}
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="w-4 h-4 text-primary-green" />
                  <span className="font-medium text-gray-700">Search Events</span>
                </div>
                <SearchBar onSearch={handleSearch} />
              </div>

              {/* Category Filter */}
              <div className="w-full lg:w-auto">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4 text-primary-green" />
                  <span className="font-medium text-gray-700">Filter by Category</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryFilter(category)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-primary-green text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category === 'all' ? 'All Events' : category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h2 className="heading-3 mb-0">Calendar View</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <div className="w-3 h-3 bg-primary-green rounded-full"></div>
                  {filteredEvents.length} Events
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="calendar-container">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={filteredEvents.map(event => ({
                  ...event,
                  backgroundColor: getCategoryColor(event.category),
                  borderColor: getCategoryColor(event.category),
                }))}
                eventClick={info => navigate(`/events/${info.event.id}`)}
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
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          {categories.slice(1).map((category) => {
            const count = allEvents.filter(e => e.category === category).length;
            return (
              <div key={category} className="card text-center hover:transform hover:scale-105 transition-all">
                <div className="card-body">
                  <div className="text-2xl font-bold text-primary-green mb-2">{count}</div>
                  <div className="text-sm text-muted">{category} Events</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
