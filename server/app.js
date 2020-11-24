const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const fileupload = require('express-fileupload');
const connectDB = require('./configs/db');
const errorHandler = require('./middleware/error');
const app = express();

// Load env vars
dotenv.config({ path: './configs/config.env' });

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Mount routers
app.use('/api/v1/test', require('./routes/test.route'));

//Connect to database Mongoose
connectDB();

//Setting port
const PORT = process.env.PORT || 3000;

//Body parser
app.use(express.json());

//Start Server
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// error handler
app.use(errorHandler);

app.use(function (req, res, next) {
  res.status(404).send({
    success: false,
    error_message: 'Endpoint not found!',
  });
});
/*
app.use(function (err, req, res, next) {
  res.status(500).send({
    success: false,
    error: 'Something broke',
  });
});
 */
//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
