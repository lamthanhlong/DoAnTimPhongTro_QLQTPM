const express = require('express');
const router = express.Router();
const model = require('../models/user.model');
const validate = require('../utils/validate');
const schema = require('../schemas/user.json');
const bcrypt = require('bcryptjs');

//Re - route to other resources
const authRouter = require('./auth.route');

const { protect, authorize, sendTokenResponse } = require('../utils/auth');
router.get('/', async (req, res) => {
  var data = await model.GetQuery(req.query);
  res.json(data);
});
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  var data = await model.Single(id);
  res.json(data);
});
router.post('/', validate(schema), async function (req, res) {
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
router.put('/:id', async function (req, res) {
  const object = req.body;
  delete object._id;
  delete object.modified_date;
  const id = req.params.id;
  if (object.password) {
    object.password = bcrypt.hashSync(object.password, 10);
  }
  const update = await model.Update(id, object);
  if (update == 0) return res.status(400).end();
  object._id = id;
  delete object.password;
  res.json(object);
}),
  router.delete('/:id', async function (req, res) {
    const id = req.params.id;
    const check = await model.Delete(id);
    //if (!check) {
    //  return res.status(400).end();
    //}
    res.json({ success: true });
  });
router.put('/:id/verify', async function (req, res) {
  const user = await model.Single(req.params.id);
  if (user.length === 0) {
    res.status(400).json({ err_msg: 'User not found!!' });
  }
  await model.Update(req.params.id, { is_verified: true });
  const update = await model.Single(req.params.id);
  res.status(200).json({ success: true });
});
module.exports = router;
