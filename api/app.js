'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const sequelize = require('./models').sequelize;
const cors = require('cors');

// variable to enable global error logging
const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// Test Database
sequelize
  .authenticate()
  .then(console.log('database connected...'))
  .catch((err) => console.log(`Error: ${err}`));

// Sync Database
sequelize
  .sync()
  .then(console.log('Syncing Database'))
  .catch((err) => console.log(`Error: ${err}`));

// Create the Express app
const app = express();

// Setup morgan which gives us http request logging
app.use(morgan('dev'));

// Cors Setup
app.use(cors());

// Allow Access to req.body
app.use(express.json());

// TODO setup your api routes here
app.use('/api', require('./routes/api'));

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
