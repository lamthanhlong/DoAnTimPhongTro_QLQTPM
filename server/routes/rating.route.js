const e = require('express');
const express = require('express');
const router = express.Router();
const model = require('../models/rating.model');
const motel = require('../models/motel.model');
const validate = require('../utils/validate');
let schema = require('../schemas/rating.json');
const userModel = require('../models/user.model');

router.get('/', async (req, res) => {
  var data = await model.GetAll();
  res.json(data);
});
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  var data = await model.Single(id);
  res.json(data);
});
router.get('/motel/:id', async function (req, res) {
  const object = await model.GetAllRatingByMotelId(req.params.id, req.query);
  res.json(object);
});
router.post('/', validate(schema), async function (req, res) {
  const object = req.body;
  //const checkDup = await model.FindRating(object);
  //if (checkDup.length > 0) return res.status(400).end();
  const id = await model.Add(object);
  const ratings = await model.GetAllRatingByMotelId(object.motel_id);
  if (ratings.length > 0) {
    let avg = 0;
    for (i in ratings) {
      avg += ratings[i].rating;
    }
    avg = avg / ratings.length;
    const motel_update_rating = motel.Update(object.motel_id, { rating: avg });
  }
  const user = await userModel.Single(object.user_id);
  object._id = id;
  object.Users = user;
  res.status(201).json(object);
});
/*router.put('/:id', async function (req, res) {
  const object = req.body;
  const id = req.params.id;
  const update = await model.Update(id, object);
  if (update == 0) return res.status(400).end();
  const newObj = await model.Single(id);
  res.json(newObj);
});
router.delete('/:id', async function (req, res) {
  const id = req.params.id;
  const check = await model.Delete(id);
  res.json({ success: true });
});*/

module.exports = router;
