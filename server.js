const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
// console.log(process.env);

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  global.console.log(`App Running on port ${port}...`);
});
