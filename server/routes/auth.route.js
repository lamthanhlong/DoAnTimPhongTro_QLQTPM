const express = require('express');
const model = require('../models/user.model');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validate = require('../utils/validate');
const schema = require('../schemas/user.json');
const { getSignedJwtToken } = require('../models/user.model');
const { protect, authorize, sendTokenResponse } = require('../utils/auth');
router.get('/me', protect, async (req, res) => {
  const user = await model.Single(req.accessTokenPayload.id);
  if (user.length == 0)
    return res.status(404).json({ err_msg: 'User not found!!!' });
  return res.status(200).json(user[0]);
});
router.post('/me', protect, async (req, res) => {
  const user = req.body;
  const id = req.accessTokenPayload.id;
  delete user._id;
  delete user.phone;
  if (user.password) {
    user.password = bcrypt.hashSync(user.password, 10);
  }
  const edit = await model.Update(id, user);
  user._id = id;
  return res.status(200).json(user);
});
router.post('/login', async function (req, res) {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ err_msg: 'Please input phone & password' });
  }
  let user = await model.FindByPhone(phone);

  if (user.length == 0) {
    return res.status(404).json({ err_msg: 'User not found' });
  }

  user = user[0];
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(404).end();
  }
  const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    'BEST_SOLUTION',
    {
      expiresIn: 20 * 24 * 60 * 60000,
    }
  );
  res.status(200).json({ user, token: accessToken });
});
router.post('/register', validate(schema), async function (req, res) {
  let object = req.body;
  const valid = await model.FindByPhone(object.phone);
  if (!object.role) object.role = 'MOTEL_OWNER';
  if (valid.length > 0)
    return res.status(400).json({ err_msg: 'user has already signed up' });
  const hash = bcrypt.hashSync(object.password, 10);
  object.password = hash;
  const id = await model.Add(object);
  object._id = id;
  sendTokenResponse(object, 201, res);
});
module.exports = router;
