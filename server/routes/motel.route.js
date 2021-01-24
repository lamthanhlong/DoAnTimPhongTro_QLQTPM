const express = require('express');
const router = express.Router();
const schema = require('../schemas/motel.json');
const validate = require('../utils/validate');
const motelcontroller = require('../controller/motel.controller');
const { protect, authorize } = require('../utils/auth');
router.get('/', motelcontroller.fetchPaging);

router.get('/local', motelcontroller.getLocals);

router.get(
  '/user/:id',
  protect,
  motelcontroller.ownerFetchMotels
);

router.get(
  '/rating_code/:id',
  protect,
  motelcontroller.getRatingCode
);

router.get('/:id', motelcontroller.fetch);

router.put(
  '/:id/verify',
  protect,
  authorize('ADMIN'),
  motelcontroller.verifyMotel
);

router.post('/store', protect, validate(schema), motelcontroller.store);

router.put(
  '/update/:id',
  protect,
  motelcontroller.update
);

//router.delete('/:id', protect, motelcontroller.delete);

module.exports = router;
