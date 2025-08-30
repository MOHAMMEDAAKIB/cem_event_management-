import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    maxlength: [800, 'Description cannot be more than 800 characters']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [150, 'Short description cannot be more than 150 characters']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Event address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
    }
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: ['Cultural', 'Sports', 'Workshop', 'Seminar', 'Conference', 'Competition', 'Academic', 'Technical', 'Social', 'Other'],
    default: 'Cultural'
  },
  organizer: {
    name: {
      type: String,
      required: [true, 'Organizer name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Organizer email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      trim: true
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      trim: true
    }
  }],
  capacity: {
    type: Number,
    min: 1,
    default: 100
  },
  registeredCount: {
    type: Number,
    default: 0,
    min: 0
  },
  registrationRequired: {
    type: Boolean,
    default: false
  },
  registrationDeadline: {
    type: Date
  },
  price: {
    type: Number,
    min: 0,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'published'
  },
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for days until event
eventSchema.virtual('daysUntilEvent').get(function() {
  const today = new Date();
  const eventDate = new Date(this.date);
  const diffTime = eventDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for event status based on date
eventSchema.virtual('eventStatus').get(function() {
  const today = new Date();
  const eventDate = new Date(this.date);
  
  if (this.status === 'cancelled') return 'cancelled';
  if (eventDate < today) return 'past';
  if (eventDate.toDateString() === today.toDateString()) return 'today';
  return 'upcoming';
});

// Index for better query performance
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ featured: 1 });
eventSchema.index({ 'location.city': 1 });

// Pre-save middleware to validate registration deadline
eventSchema.pre('save', function(next) {
  if (this.registrationRequired && this.registrationDeadline) {
    if (this.registrationDeadline >= this.date) {
      return next(new Error('Registration deadline must be before the event date'));
    }
  }
  next();
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
