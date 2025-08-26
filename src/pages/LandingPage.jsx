import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Star, Users, Trophy, Camera } from 'lucide-react';
import { gsap } from 'gsap';

// Import images
import statsImage from './assets/Schedule-amico.png';
import image1 from '../images/GA0189_01.jpg';
import image2 from '../images/GA0192_01.jpg';
import image3 from '../images/NEWY62.jpg';

const LandingPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
