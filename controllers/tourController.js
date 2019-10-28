const Tour = require('../models/tourModel');

// GET Para mostrar todos os tours
exports.getAllTours = async (req, res) => {
  try {
    // FIltering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced Query
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, m => `$${m}`);

    let query = Tour.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else query = query.sort('-createdAt');

    // Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else query = query.select('-__v');

    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    // EXECUTE query
    const tour = await query;

    res.status(200).json({
      status: 'success',
      results: tour.length,
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'Not Found',
      data: err
    });
  }
};

// GET Para mostrar apenas um tour
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'Not found'
    });
  }
};

// POST para adicionar um novo tour
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      data: {
        data: err.message
      }
    });
  }
};

// Update tour
exports.updateTour = async (req, res) => {
  try {
    const updateTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        updateTour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'Not Found',
      data: err.message
    });
  }
};

// Delete tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Deleted',
      data: null
    });
  } catch (err) {
    res.status(500).json({
      status: 'Error',
      message: err.message
    });
  }
};
