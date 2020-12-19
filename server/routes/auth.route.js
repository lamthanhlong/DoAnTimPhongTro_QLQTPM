const express = require('express');
const model = require('../models/user.model');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');

router.post('/login', async function (req, res) {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ err_msg: 'Please input phone & password' });
  }
  let user = await model.FindByPhone(phone);
  if (user.length == 0) {
    res.status(404).json({ err_msg: 'User not found' });
  }
  user = user[0];
  if (!bcrypt.compareSync(password, user.password)) {
    res.status(404).end();
  }
  const accessToken = jwt.sign(
    {
      _id: user._id,
      role: user.role,
    },
    'BEST_SOLUTION',
    {
      expiresIn: 10 * 6000,
    }
  );
  res.status(200).json({ token: accessToken });
});

module.exports = router;
