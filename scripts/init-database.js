import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from '../src/models/Event.js';
import Carousel from '../src/models/Carousel.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cem_events');
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const sampleCarouselItems = [
  {
    description: "Annual Tech Conference 2025 - Embracing Innovation and Digital Transformation",
    imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    order: 1
  },
  {
    description: "Cultural Night Celebration - Showcasing Diverse Talents and Traditions",
    imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    order: 2
  },
  {
    description: "Sports Day Highlights - Athletic Excellence and Team Spirit",
    imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    order: 3
  }
];

const sampleEvents = [
  {
    title: "Annual Tech Symposium 2025",
    description: "Join us for the most exciting technology event of the year featuring keynotes from industry leaders, workshops on emerging technologies, and networking opportunities with fellow tech enthusiasts.",
    date: new Date("2025-09-15"),
    time: "09:00 AM",
    location: {
      address: "Main Auditorium, College Campus",
      city: "New York",
      state: "NY",
      zipCode: "10001"
    },
    category: "Technical",
    organizer: {
      name: "Tech Club",
      email: "tech@college.edu",
      phone: "+1-555-0123"
    },
    capacity: 500,
    registrationRequired: true,
    registrationDeadline: new Date("2025-09-10"),
    price: 0,
    status: "published",
    featured: true,
    tags: ["technology", "symposium", "networking", "workshops"]
  },
  {
    title: "Cultural Night 2025",
    description: "Experience the rich diversity of our campus community through performances, food, and celebrations from cultures around the world.",
    date: new Date("2025-10-20"),
    time: "06:00 PM",
    location: {
      address: "Student Center Hall",
      city: "New York",
      state: "NY",
      zipCode: "10001"
    },
    category: "Cultural",
    organizer: {
      name: "International Student Association",
      email: "isa@college.edu",
      phone: "+1-555-0124"
    },
    capacity: 300,
    registrationRequired: false,
    price: 0,
    status: "published",
    featured: true,
    tags: ["culture", "diversity", "performance", "food"]
  },
  {
    title: "Spring Sports Tournament",
    description: "Annual inter-departmental sports competition featuring basketball, volleyball, cricket, and athletics. Come support your department!",
    date: new Date("2025-11-05"),
    time: "08:00 AM",
    location: {
      address: "Sports Complex",
      city: "New York",
      state: "NY",
      zipCode: "10001"
    },
    category: "Sports",
    organizer: {
      name: "Sports Committee",
      email: "sports@college.edu",
      phone: "+1-555-0125"
    },
    capacity: 1000,
    registrationRequired: true,
    registrationDeadline: new Date("2025-10-30"),
    price: 0,
    status: "published",
    featured: false,
    tags: ["sports", "tournament", "competition", "departments"]
  },
  {
    title: "Academic Excellence Awards",
    description: "Celebrating outstanding academic achievements of our students and faculty members. Join us for this prestigious ceremony.",
    date: new Date("2025-12-10"),
    time: "10:00 AM",
    location: {
      address: "Grand Auditorium",
      city: "New York",
      state: "NY",
      zipCode: "10001"
    },
    category: "Academic",
    organizer: {
      name: "Academic Affairs",
      email: "academic@college.edu",
      phone: "+1-555-0126"
    },
    capacity: 400,
    registrationRequired: true,
    registrationDeadline: new Date("2025-12-05"),
    price: 0,
    status: "published",
    featured: true,
    tags: ["academic", "awards", "excellence", "ceremony"]
  },
  {
    title: "Social Impact Workshop",
    description: "Learn about creating positive social change in your community. Workshop includes guest speakers from local NGOs and hands-on activities.",
    date: new Date("2025-08-30"),
    time: "02:00 PM",
    location: {
      address: "Conference Room A",
      city: "New York",
      state: "NY",
      zipCode: "10001"
    },
    category: "Social",
    organizer: {
      name: "Community Service Club",
      email: "service@college.edu",
      phone: "+1-555-0127"
    },
    capacity: 50,
    registrationRequired: true,
    registrationDeadline: new Date("2025-08-25"),
    price: 0,
    status: "completed",
    featured: false,
    tags: ["social", "workshop", "community", "impact"]
  }
];

const initializeDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Event.deleteMany({});
    await Carousel.deleteMany({});
    console.log('🗑️ Cleared existing data');
    
    // Insert sample events
    const createdEvents = await Event.insertMany(sampleEvents);
    console.log(`✅ Created ${createdEvents.length} sample events`);
    
    // Insert sample carousel items
    const createdCarouselItems = await Carousel.insertMany(sampleCarouselItems);
    console.log(`✅ Created ${createdCarouselItems.length} sample carousel items`);
    
    // Display summary
    console.log('\n📊 Database Summary:');
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ 
      date: { $gte: new Date() }, 
      status: 'published' 
    });
    const featuredEvents = await Event.countDocuments({ featured: true });
    const totalCarouselItems = await Carousel.countDocuments();
    
    console.log(`   Total Events: ${totalEvents}`);
    console.log(`   Upcoming Events: ${upcomingEvents}`);
    console.log(`   Featured Events: ${featuredEvents}`);
    console.log(`   Carousel Items: ${totalCarouselItems}`);
    
    console.log('\n🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  }
};

// Run initialization
initializeDatabase();
