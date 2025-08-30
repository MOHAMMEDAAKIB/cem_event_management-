import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventCard = ({ event, onClick, showViewMore = true }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.getFullYear(),
      fullDate: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  };

  const getCategoryColor = (category) => {
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

  const formattedDate = formatDate(event.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden h-64">
        <motion.img
          src={event.images?.[0]?.url || event.imageUrl || 'https://via.placeholder.com/800x400/1B4D3E/FFFFFF?text=Event+Image'}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          whileHover={{ scale: 1.05 }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/800x400/1B4D3E/FFFFFF?text=Event+Image';
          }}
        />
        
        {/* Date Badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-college-primary leading-none">
              {formattedDate.day}
            </div>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              {formattedDate.month}
            </div>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(event.category)}`}>
            {event.category}
          </span>
        </div>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* View Details Button on Image Hover */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            initial={{ y: 20 }}
            whileHover={{ y: 0 }}
            className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl px-4 py-2 font-medium flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
            onClick={onClick}
          >
            <Eye className="w-4 h-4" />
            Quick View
          </motion.button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-college-primary transition-colors">
          {event.title}
        </h3>

        {/* Short Description */}
        {event.shortDescription && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {event.shortDescription}
          </p>
        )}

        {/* Event Details */}
        <div className="space-y-2 mb-6">
          {/* Date and Time */}
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="w-4 h-4 mr-2 text-college-primary flex-shrink-0" />
            <span>{formattedDate.fullDate}</span>
            {event.time && (
              <>
                <Clock className="w-4 h-4 ml-4 mr-2 text-college-primary flex-shrink-0" />
                <span>{event.time}</span>
              </>
            )}
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-2 text-college-primary flex-shrink-0" />
              <span className="truncate">
                {typeof event.location === 'string' 
                  ? event.location 
                  : `${event.location.address || ''}, ${event.location.city || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, '')
                }
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {showViewMore && (
          <Link to={`/events/${event._id || event.id}`}>
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-college-primary to-college-primary/90 text-white rounded-xl px-6 py-3 font-semibold flex items-center justify-center gap-2 hover:from-college-primary/90 hover:to-college-primary transition-all shadow-lg hover:shadow-xl"
            >
              View More
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </Link>
        )}
      </div>

      {/* Bottom Border Accent */}
      <div className="h-1 bg-gradient-to-r from-college-primary via-college-secondary to-college-primary opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

export default EventCard;
