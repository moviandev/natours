const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than  10 characters']
      // validate: [validator.isAlpha, 'Tour name must have only characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price {{VALUE}} should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary']
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover Image']
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secreteTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      // Longitude and Latitute
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          ennum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: String
      }
    ],
    // Child Referencing
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

toursSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// Document Middleware, runs before save() and create()
toursSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// An way to implement embedding into guides doccuments
// This middleware will return to us all the documents instead just the IDs

// toursSchema.pre('save', async function(next) {
// This map will return to us a Promise and the we need to await that promise (made in the next line) to see our results
//   const guidesPromise = this.guides.map(async id => await User.findById(id));

// Storing the data result into guides
//   this.guides = await Promise.all(guidesPromise);

// Calling the next middleware
//   next();
// });

// Query Middleware
toursSchema.pre(/^find/, function(next) {
  this.find({ secreteTour: { $ne: true } });

  this.start = Date.now();
  next();
});

toursSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secreteTour: { $ne: true } } });
  next();
});

// toursSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;
