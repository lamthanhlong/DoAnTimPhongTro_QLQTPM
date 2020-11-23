const path = require('path');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const test = require('../models/test.model');
//@desc Get all users
//@route GET /api/v1/test
//@access Public
exports.getAll = asyncHandler(async (req, res, next) => {
  test
    .GetAll()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(next);
});

//@desc Get users with paginate
//@route GET /api/v1/test
//@access Public
exports.getPaginate = asyncHandler((req, res, next) => {
  test
    .GetPaginate(0, 2)
    .then((data) => {
      res.send(data);
    })
    .catch(next);
});
