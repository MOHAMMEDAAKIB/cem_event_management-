import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowLeft, 
  Share2,
  Download,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { events, pastEvents } from '../utils/dummyData';

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const allEvents = [...events, ...pastEvents];
      const foundEvent = allEvents.find(e => e._id === id);
      setEvent(foundEvent);
      setLoading(false);
    }, 500);
  }, [id]);

  const nextImage = () => {
    if (event?.images) {
      setCurrentImageIndex((prev) => 
        prev === event.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (event?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? event.images.length - 1 : prev - 1
      );
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/calendar')}
            className="btn btn-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Calendar
          </button>
        </div>
      </div>
    );
  }

  const isUpcoming = new Date(event.date) > new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container section-padding">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="card">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                    {isUpcoming && (
                      <span className="badge badge-success">
                        <Star className="w-3 h-3 mr-1" />
                        Upcoming
                      </span>
                    )}
                  </div>
                  <button className="btn btn-outline btn-sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                </div>
                
                <h1 className="heading-1 text-primary mb-4">{event.title}</h1>
                
                <div className="grid md:grid-cols-3 gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-green" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  
                  {event.time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary-green" />
                      <span>{event.time}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-green" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card">
              <div className="card-header">
                <h2 className="heading-3 mb-0">About This Event</h2>
              </div>
              <div className="card-body">
                <p className="text-gray-700 leading-relaxed">{event.description}</p>
              </div>
            </div>

            {/* Image Gallery */}
            {event.images && event.images.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h2 className="heading-3 mb-0">Event Gallery</h2>
                </div>
                <div className="card-body p-0">
                  <div className="relative">
                    <img
                      src={event.images[currentImageIndex]}
                      alt={`${event.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-96 object-cover"
                    />
                    
                    {event.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                          {event.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-3 h-3 rounded-full transition-all ${
                                index === currentImageIndex
                                  ? 'bg-white scale-110'
                                  : 'bg-white bg-opacity-60 hover:bg-opacity-80'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {event.images.length > 1 && (
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Image {currentImageIndex + 1} of {event.images.length}
                        </span>
                        <button className="btn btn-outline btn-sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Status */}
            <div className="card">
              <div className="card-header">
                <h3 className="heading-3 mb-0">Event Status</h3>
              </div>
              <div className="card-body">
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    isUpcoming ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Calendar className={`w-8 h-8 ${
                      isUpcoming ? 'text-green-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className={`text-lg font-semibold mb-2 ${
                    isUpcoming ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {isUpcoming ? 'Upcoming Event' : 'Past Event'}
                  </div>
                  <p className="text-sm text-gray-600">
                    {isUpcoming ? 
                      'Save this event to your calendar' : 
                      'This event has already concluded'
                    }
                  </p>
                </div>
                
                {isUpcoming && (
                  <button className="btn btn-primary w-full mt-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    Add to Calendar
                  </button>
                )}
              </div>
            </div>

            {/* Participants */}
            {event.participants && event.participants.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary-green" />
                    <h3 className="heading-3 mb-0">Participants</h3>
                  </div>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    {event.participants.map((participant, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <img
                          src={participant.avatar}
                          alt={participant.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="font-medium text-gray-700">
                          {participant.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                    <span className="text-sm text-gray-600">
                      {event.participants.length} participants
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h3 className="heading-3 mb-0">Quick Actions</h3>
              </div>
              <div className="card-body space-y-3">
                <button className="btn btn-outline w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Event
                </button>
                {event.images && event.images.length > 0 && (
                  <button className="btn btn-secondary w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Photos
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
