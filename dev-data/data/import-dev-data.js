/* eslint-disable no-unused-vars */
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

// SETTING UP DOTENV
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const DB_LOCAL = process.env.DATABASE_LOCAL;

// SETTING UP A CONNECTION
mongoose
  .connect(DB_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(con => global.console.log('DB_LOCAL connection successful'));
// READ JSON FILE
// READING AND PARSING DATA TO SEND TO DB
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

// IMPORT DATA INTO DB
// CREATING METHOD TO IMPORT
const importData = async () => {
  try {
    // CREATING DOCUMENTS
    await Tour.create(tours);
    console.log('TUDO OK');
    // KILLING SERVER
    process.exit();
  } catch (err) {
    console.log(err.message);
  }
};

// DELETE ALL DATA FORM COLLECTION FROM
// CREATING METHOD TO DELETE ALL DATA OF DB
const deleteData = async () => {
  try {
    // DELETING ALL DATA THAT IS IN DB
    await Tour.deleteMany();
    console.log('deletado');
    // KILLING SERVER
    process.exit();
  } catch (err) {
    console.log(err.message);
  }
};

// SETTING TERMINAL COMMAND TO IMPORT OR DELETE DATA
// PROCESS.ARGV IS A NODE BUILT IN COMMAND THAT RETURNS AN ARRAY TO US AND ITS THIRD POSITION HAS OUR TAG
/* 
  PROCESS.ARGV [
    '/opt/node-v12.13.0-linux-x64/bin/node',
    '/home/matheus/projects/natours/dev-data/data/import-dev-data.js',
    '--import'
  ]
*/
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log('PROCESS.ARGV', process.argv);
