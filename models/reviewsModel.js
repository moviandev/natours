const mongoose = require('mongoose');
const Tour = require('./tourModel');

// Parent referencing is to not polute our DB
// Always when we desing an app we have to think it as a thing that will be huge

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty']
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating cannot be more than 5'],
      defeault: 4.5
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to an user']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    // we need these two options as true cause when we use a virtual a field that not stored into data base it will do appear to us
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'name email photo'
  });

  next();
});

reviewSchema.statics.calcAvarageRatings = async function(tourId) {
  // this points to the current docuument so I can use the aggregation pipeline
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  console.log(stats);

  // Saving to the current tour
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRatings,
    ratingsAverage: stats[0].avgRating
  });
};

// We should use post instead pre because the document is already saved in the database
reviewSchema.post('save', function() {
  // this points to the current review (current document thats being saved)
  // this.constructor points to the current model
  this.constructor.calcAvarageRatings(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
