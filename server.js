/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const DB_LOCAL = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(con => global.console.log('DB_LOCAL connection successful'))
  .catch(err => global.console.log('error try again'));

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  global.console.log(`App Running on port ${port}...`);
});
