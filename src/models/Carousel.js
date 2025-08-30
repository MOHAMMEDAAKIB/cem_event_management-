import mongoose from 'mongoose';

const carouselSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // This adds createdAt and updatedAt fields automatically
});

// Index for efficient sorting by order
carouselSchema.index({ order: 1, isActive: 1 });

// Method to get active carousel items sorted by order
carouselSchema.statics.getActiveItems = function() {
  return this.find({ isActive: true }).sort({ order: 1 });
};

const Carousel = mongoose.model('Carousel', carouselSchema);

export default Carousel;