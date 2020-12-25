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
  authorize('ADMIN', 'MOTEL_OWNER'),
  motelcontroller.ownerFetchMotels
);

router.get('/:id', motelcontroller.fetch);

router.post('/store', validate(schema), motelcontroller.store);

router.put(
  '/update/:id',
  protect,
  authorize('ADMIN', 'MOTEL_OWNER'),
  motelcontroller.update
);

module.exports = router;
