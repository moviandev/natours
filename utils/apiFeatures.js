class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Receives an incoming request object
    const queryObj = { ...this.queryString };
    // Exclude some fields
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced Query
    // Parse for mongoose recognize the string passed by the request
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, m => `$${m}`);

    // Parse the request object to JSON
    this.query = this.query.find(JSON.parse(queryStr));

    // Returns the object
    return this;
  }

  sort() {
    // check if it has a query.sort
    if (this.queryString.sort) {
      // when passing a request through the URL it have to be separate by commas here we get rid of all commas
      const sortBy = this.queryString.sort.split(',').join(' ');
      // Storing data passed by the URL
      this.query = this.query.sort(sortBy);
      // A default sorting
    } else this.query = this.query.sort('-createdAt');

    // Returns the object
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else this.query = this.query.select('-__v');

    return this;
  }

  paginate() {
    // Concatenating the req.query to a number
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 100;
    // Doing the pagination
    const skip = (page - 1) * limit;

    // Storing the data
    this.query = this.query.skip(skip).limit(limit);

    // Returns the object
    return this;
  }
}

module.exports = APIFeatures;
