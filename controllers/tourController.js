const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next) => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: 'Not found',
      message: 'Page not found, try again...'
    });
  }
  next();
};

// Checking if the two body parameters match.
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'Bad Request',
      message: 'Error please try again!'
    });
  }
  next();
};

// GET Para mostrar todos os tours
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

// GET Para mostrar apenas um tour
exports.getTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find(el => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

// POST para adicionar um novo tour
exports.createTour = (req, res) => {
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

// Update tour
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tours: '<Updated tour here...>'
    }
  });
};

// Delete tour
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};
