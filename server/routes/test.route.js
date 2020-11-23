const express = require('express');
const router = express.Router({ mergeParams: true });
const test = require('../models/test.model');
const {
  getAll,
  getPaginate,
  getAllUsingMongoose,
} = require('../controllers/test.controller.js');

/* router.get('/', async (req, res, next) => {
  test
    .getAll()
    .then((data) => {
      res.send(data);
    })
    .catch(next);
}); */

//router.get('/', getAll);
//router.get('/paginate', getPaginate);

router.route('/').get(getAll);
router.route('/paginate').get(getPaginate);

module.exports = router;
