const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const fileupload = require('express-fileupload');
const connectDB = require('./configs/db');
const app = express();

// Load env vars
dotenv.config({ path: './configs/config.env' });

//Route files
const test = require('./routes/test.route');

app.get('/ok', (req, res) => {
  res.status(200);
  res.send('hello world');
});

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Connect to database Mongoose
connectDB();

//Mount routers
app.use('/api/v1/test', test);

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
app.use((req, res, next) => {});

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
