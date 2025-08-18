import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Star, Users, Trophy, Camera } from 'lucide-react';

// Import images
import statsImage from './assets/Schedule-amico.png';
import image1 from '../images/GA0189_01.jpg';
import image2 from '../images/GA0192_01.jpg';
import image3 from '../images/NEWY62.jpg';

const LandingPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [image1, image2, image3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = (index) => {
    setCurrentImageIndex(index);
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
      {/* Full Width Hero Image Section */}
      <section className="relative w-full h-screen" style={{ height: '75vh' }}>
        <div className="relative w-full h-full overflow-hidden">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Event ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          
          {/* Carousel Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Carousel Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? 'bg-white scale-125 shadow-lg'
                    : 'bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Content Section Below Image */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
        <div className="container">
          <div className="grid pt-20 lg:grid-cols-2 gap-10 items-center">
            {/* Hero Content - Left Side */}
            <div className="slide-up">
              <div className="flex items-center gap-2 mb-6">
                <div className="badge badge-primary">
                  <Star className="w-3 h-3 mr-1" />
                  Professional Event Management
                </div>
              </div>
              
              <h1 className="heading-1 text-primary">
                Jaffna College of Education
                <span className="block text-secondary-yellow-dark">Event Highlights</span>
              </h1>
              
              <p className="text-lg text-muted mb-8 leading-relaxed">
                Seamlessly organize, manage, and showcase your college events with our 
                modern platform. Create memorable experiences that bring your community together.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/calendar" className="btn pl-4 btn-primary btn-lg">
                  <Calendar className="w-5 h-5 mr-2" />
                  Explore Events
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/gallery" className="btn btn-outline btn-lg">
                  <Camera className="w-5 h-5 mr-2" />
                  View Gallery
                </Link>
              </div>
            </div>

            {/* Stats - Right Side */}
            <div className="slide-up p-10">
              <img src={statsImage} alt="Statistics" className="w-full h-auto" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-primary-green mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding-sm bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-primary">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Experience the future of event management with our comprehensive 
              and user-friendly platform designed for modern colleges.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:transform hover:scale-105 transition-all">
                <div className="card-body">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-green to-primary-green-light rounded-xl flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="heading-3 mb-2">{feature.title}</h3>
                  <p className="text-muted">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-green to-primary-green-light">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Events?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of colleges already using our platform to create 
              exceptional event experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              
              <Link to="/admin/login" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-green btn-lg">
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
