const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const fileupload = require('express-fileupload');
const connectDB = require('./configs/db');
const app = express();

//Route files
const test = require('./routes/test.route');

//Mount routers
app.use('/api/v1/test', test);

// Load env vars
dotenv.config({ path: './configs/config.env' });

//Connect to database
connectDB();

//Setting port
const PORT = process.env.PORT || 3000;

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

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
app.use((req, res, next) => {});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
