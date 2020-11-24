const express = require('express');
const router = express.Router();
const test = require('../models/test.model');
const {
  getAll,
  getPaginate,
  GetAddress,
} = require('../controllers/test.controller.js');

/* router.get('/', async (req, res, next) => {
  test
    .getAll()
    .then((data) => {
      res.send(data);
    })
    .catch(next);
}); */

router.get('/', GetAddress);
//router.get('/paginate', getPaginate);

//router.route('/').get(getAll);
router.route('/paginate').get(getPaginate);

module.exports = router;
