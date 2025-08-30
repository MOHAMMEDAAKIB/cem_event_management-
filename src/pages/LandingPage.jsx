import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, Star, Users, Trophy, Camera, MapPin, Clock } from 'lucide-react';
import { gsap } from 'gsap';
import { getUpcomingEvents } from '../services/eventServiceClient';

// Import images
import statsImage from './assets/Schedule-amico.png';
import image1 from '../images/GA0189_01.jpg';
import image2 from '../images/GA0192_01.jpg';
import image3 from '../images/NEWY62.jpg';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const images = [image1, image2, image3];
  
  // GSAP refs
  const heroSectionRef = useRef(null);
  const imageRefs = useRef([]);
  const overlayRef = useRef(null);
  const dotsRef = useRef([]);
  const contentRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Fetch upcoming events
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setIsLoadingEvents(true);
        const events = await getUpcomingEvents({ limit: 6 });
        setUpcomingEvents(events);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
        setUpcomingEvents([]);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup - set images for floating animation
      imageRefs.current.forEach((img, index) => {
        if (img) {
          gsap.set(img, {
            scale: 1.1,
            transformOrigin: "center center"
          });
          
          // Floating animation for each image
          gsap.to(img, {
            y: index % 2 === 0 ? -15 : -25,
            x: index % 2 === 0 ? 10 : -10,
            scale: 1.05,
            duration: 6 + index * 0.5,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * 0.3
          });
        }
      });

      // Overlay gradient animation
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          background: "linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)",
          duration: 8,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true
        });
      }

      // Dots animation
      dotsRef.current.forEach((dot, index) => {
        if (dot) {
          gsap.to(dot, {
            scale: 1.1,
            duration: 2 + index * 0.3,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * 0.2
          });
        }
      });

      // Content entrance animation
      if (contentRef.current) {
        gsap.from(contentRef.current.children, {
          y: 100,
          opacity: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
          delay: 1
        });
      }

    }, heroSectionRef);

    return () => ctx.revert();
  }, []);

  // Handle image transition animations
  useEffect(() => {
    imageRefs.current.forEach((img, index) => {
      if (img) {
        if (index === currentImageIndex) {
          gsap.to(img, {
            opacity: 1,
            duration: 1,
            ease: "power2.inOut"
          });
        } else {
          gsap.to(img, {
            opacity: 0,
            duration: 1,
            ease: "power2.inOut"
          });
        }
      }
    });
  }, [currentImageIndex]);

  const goToSlide = (index) => {
    setCurrentImageIndex(index);
    
    // Add a little bounce animation to the clicked dot
    if (dotsRef.current[index]) {
      gsap.to(dotsRef.current[index], {
        scale: 1.5,
        duration: 0.3,
        ease: "back.out(1.7)",
        yoyo: true,
        repeat: 1
      });
    }
  };

  const features = [
    {
      icon: Calendar,
      title: 'Event Calendar',
      description: 'View and manage all upcoming events in one place'
    },
    {
      icon: Camera,
      title: 'Photo Gallery',
      description: 'Browse through beautiful moments from past events'
    },
    {
      icon: Users,
      title: 'Easy Management',
      description: 'Streamlined admin dashboard for event organization'
    }
  ];

  const stats = [
    { number: '500+', label: 'Events Organized' },
    { number: '10K+', label: 'Students Participated' },
    { number: '50+', label: 'Categories' },
    { number: '99%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Full Width Hero Image Section - 80% of screen height */}
      <section 
        ref={heroSectionRef}
        className="relative w-full overflow-hidden" 
        style={{ height: '80vh', marginTop: '50px' }}
      >
        {/* Image Container with Proper Padding */}
        <div className="relative w-full h-full px-6 sm:px-8 lg:px-12">
          <div className="relative w-full h-full max-w-8xl mx-auto rounded-3xl overflow-hidden shadow-2xl">
            {images.map((image, index) => (
              <img
                key={index}
                ref={el => imageRefs.current[index] = el}
                src={image}
                alt={`Event ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out"
                style={{
                  opacity: index === currentImageIndex ? 1 : 0,
                  filter: 'brightness(1.1) contrast(1.1) saturate(1.1)',
                  transform: index === currentImageIndex ? 'scale(1)' : 'scale(1.05)',
                }}
              />
            ))}
          
          {/* Animated Carousel Overlay */}
          <div 
            ref={overlayRef}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
          />
          
          {/* Animated Carousel Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                ref={el => dotsRef.current[index] = el}
                onClick={() => goToSlide(index)}
                className={`relative w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 ${
                  index === currentImageIndex
                    ? 'bg-white shadow-lg'
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                style={{
                  boxShadow: index === currentImageIndex ? '0 0 20px rgba(255, 255, 255, 0.8)' : 'none'
                }}
              />
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* Content Section Below Image */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div ref={contentRef} className="grid pt-16 sm:pt-20 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Hero Content - Left Side */}
            <div className="slide-up px-4 sm:px-0">
              <div className="flex items-center gap-2 mb-6">
                <div className="badge badge-primary">
                  <Star className="w-3 h-3 mr-1" />
                  Professional Event Management
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight">
                Jaffna College of Education
                <span className="block text-secondary-yellow-dark">Event Highlights</span>
              </h1>
              
              <p className="text-lg text-muted mb-8 leading-relaxed max-w-xl">
                Seamlessly organize, manage, and showcase your college events with our 
                modern platform. Create memorable experiences that bring your community together.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  to="/calendar" 
                  className="btn pl-4 btn-primary btn-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  onMouseEnter={(e) => {
                    gsap.to(e.target, { scale: 1.05, duration: 0.3, ease: "power2.out" });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.target, { scale: 1, duration: 0.3, ease: "power2.out" });
                  }}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Explore Events
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link 
                  to="/gallery" 
                  className="btn btn-outline btn-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  onMouseEnter={(e) => {
                    gsap.to(e.target, { scale: 1.05, duration: 0.3, ease: "power2.out" });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.target, { scale: 1, duration: 0.3, ease: "power2.out" });
                  }}
                >
                  <Camera className="w-5 h-5 mr-2" />
                  View Gallery
                </Link>
              </div>
            </div>

            {/* Stats - Right Side */}
            <div className="slide-up p-6 sm:p-8 lg:p-10 flex items-center justify-center">
              <div className="w-full max-w-md mx-auto">
                <img 
                  src={statsImage} 
                  alt="Statistics" 
                  className="w-full h-auto transform transition-transform duration-300 drop-shadow-lg"
                  style={{
                    filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1))',
                    maxHeight: '400px',
                    objectFit: 'contain'
                  }}
                  ref={el => {
                    if (el) {
                      gsap.to(el, {
                        y: -10,
                        duration: 3,
                        ease: "power2.inOut",
                        repeat: -1,
                        yoyo: true
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12 px-4">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onMouseEnter={(e) => {
                  gsap.to(e.target, {
                    y: -10,
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.target, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                  });
                }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-primary-green mb-2">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-muted font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="section-padding bg-white">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
              Upcoming Events
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Don't miss out on these exciting upcoming events at Jaffna College of Education
            </p>
          </div>

          {isLoadingEvents ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green"></div>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {upcomingEvents.map((event, index) => (
                <div 
                  key={event._id || event.id} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => {
                    const eventId = event._id || event.id;
                    if (eventId) {
                      navigate(`/events/${eventId}`);
                    }
                  }}
                  onMouseEnter={(e) => {
                    gsap.to(e.target, {
                      y: -10,
                      scale: 1.05,
                      duration: 0.3,
                      ease: "power2.out"
                    });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.target, {
                      y: 0,
                      scale: 1,
                      duration: 0.3,
                      ease: "power2.out"
                    });
                  }}
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.images?.[0]?.url || event.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.category === 'Cultural' ? 'bg-purple-100 text-purple-800' :
                        event.category === 'Sports' ? 'bg-blue-100 text-blue-800' :
                        event.category === 'Workshop' ? 'bg-green-100 text-green-800' :
                        event.category === 'Academic' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.category}
                      </span>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-primary-green" />
                        <span>
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      {event.time && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-primary-green" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      
                      {event.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-primary-green" />
                          <span className="line-clamp-1">
                            {typeof event.location === 'string' 
                              ? event.location 
                              : `${event.location.address || ''}, ${event.location.city || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, '')
                            }
                          </span>
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/events/${event._id || event.id}`}
                      className="inline-flex items-center text-primary-green hover:text-primary-green-dark font-medium transition-colors duration-200"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Upcoming Events</h3>
              <p className="text-gray-500">Check back soon for new events!</p>
            </div>
          )}

          {upcomingEvents.length > 0 && (
            <div className="text-center mt-12">
              <Link 
                to="/calendar" 
                className="btn btn-outline btn-lg transform transition-all duration-300 hover:scale-105"
                onMouseEnter={(e) => {
                  gsap.to(e.target, { scale: 1.05, duration: 0.3, ease: "power2.out" });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.target, { scale: 1, duration: 0.3, ease: "power2.out" });
                }}
              >
                View All Events
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding-sm bg-gray-50">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Experience the future of event management with our comprehensive 
              and user-friendly platform designed for modern colleges.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-4">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card text-center hover:transform hover:scale-105 transition-all duration-300 p-6 lg:p-8"
                onMouseEnter={(e) => {
                  gsap.to(e.target, {
                    y: -15,
                    scale: 1.05,
                    rotationY: 5,
                    duration: 0.4,
                    ease: "power2.out"
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.target, {
                    y: 0,
                    scale: 1,
                    rotationY: 0,
                    duration: 0.4,
                    ease: "power2.out"
                  });
                }}
              >
                <div className="card-body">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-green to-primary-green-light rounded-xl flex items-center justify-center transform transition-transform duration-300 hover:rotate-12">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-green to-primary-green-light">
        <div className="container text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-white px-4">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Transform Your Events?
            </h2>
            <p className="text-lg sm:text-xl mb-8 opacity-90 leading-relaxed">
              Join hundreds of colleges already using our platform to create 
              exceptional event experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/admin/login" 
                className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-green btn-lg transform transition-all duration-300"
                onMouseEnter={(e) => {
                  gsap.to(e.target, {
                    scale: 1.05,
                    y: -3,
                    duration: 0.3,
                    ease: "power2.out"
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.target, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                  });
                }}
              >
                Admin Access
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
