import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, Filter, Camera, Eye } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { pastEvents } from '../utils/dummyData';

const GalleryPage = () => {
  const [filtered, setFiltered] = useState(pastEvents);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const years = ['all', ...new Set(pastEvents.map(event => 
    new Date(event.date).getFullYear()
  ))].sort((a, b) => b - a);

  const categories = ['all', 'Sports', 'Workshop', 'Seminar', 'Cultural'];

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
    let filtered = pastEvents;
    
    if (year !== 'all') {
      filtered = filtered.filter(e => new Date(e.date).getFullYear() === parseInt(year));
    }
    
    if (category !== 'all') {
      filtered = filtered.filter(e => e.category === category);
    }
    
    if (query) {
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setFiltered(filtered);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Sports: 'badge-primary',
      Workshop: 'badge-secondary',
      Seminar: 'badge-success',
      Cultural: 'badge-warning',
    };
    return colors[category] || 'badge-primary';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container section-padding">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-green to-primary-green-light rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <h1 className="heading-1 text-primary mb-0">Event Gallery</h1>
          </div>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Explore the wonderful memories from our past events. Browse through 
            photos and relive the amazing moments from our college community.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="space-y-6">
              {/* Search Bar */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Search className="w-4 h-4 text-primary-green" />
                  <span className="font-medium text-gray-700">Search Events</span>
                </div>
                <SearchBar 
                  onSearch={handleSearch} 
                  placeholder="Search by event name..."
                />
              </div>

              {/* Filters */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Year Filter */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-primary-green" />
                    <span className="font-medium text-gray-700">Filter by Year</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => handleYearChange(year)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedYear === year
                            ? 'bg-primary-green text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {year === 'all' ? 'All Years' : year}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-primary-green" />
                    <span className="font-medium text-gray-700">Filter by Category</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedCategory === category
                            ? 'bg-secondary-yellow text-gray-800 shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category === 'all' ? 'All Categories' : category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-muted">
                  Showing {filtered.length} of {pastEvents.length} events
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Click any event to view details</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="heading-3 text-gray-600 mb-2">No events found</h2>
            <p className="text-muted">
              Try adjusting your search criteria or browse all events.
            </p>
            <button
              onClick={() => {
                setSelectedYear('all');
                setSelectedCategory('all');
                setFiltered(pastEvents);
              }}
              className="btn btn-outline mt-4"
            >
              Show All Events
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(event => (
              <div key={event._id} className="card hover:transform hover:scale-105 transition-all group">
                <Link to={`/events/${event._id}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={event.images[0]}
                      alt={event.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className={`absolute top-4 right-4 ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">View Details</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-green transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    {event.images.length > 1 && (
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <Camera className="w-4 h-4" />
                        <span>{event.images.length} photos</span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button (if needed for pagination) */}
        {filtered.length > 0 && (
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-4 text-sm text-muted">
              <div className="w-16 h-px bg-gray-300"></div>
              <span>End of results</span>
              <div className="w-16 h-px bg-gray-300"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;

