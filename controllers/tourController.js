const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  console.log(`Tour ID: ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Not found',
      message: `Invalid ID: ${val}`
    });
  }
  next();
};

// Checking if the two body parameters match.
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'You cannot create a post without name and price'
    });
  }
  next();
};

// GET Para mostrar todos os tours
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
};

// GET Para mostrar apenas um tours
exports.getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};
// POST para adicionar um novo tours
exports.createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
};
// Update tours
exports.updateTour = (req, res) => {
  // if (id > tours.length) {
  res.status(200).json({
    status: 'success',
    data: {
      tours: '<Updated tour here...>'
    }
  });
};
// Delete tours
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};
