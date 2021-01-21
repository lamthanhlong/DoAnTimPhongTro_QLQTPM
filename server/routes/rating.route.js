const express = require('express');
const router = express.Router();
const model = require('../models/rating.model');
const motel = require('../models/motel.model');
const validate = require('../utils/validate');
let schema = require('../schemas/rating.json');
const userModel = require('../models/user.model');
const { protect, authorize } = require('../utils/auth');

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

router.post('/', validate(schema), protect, async function (req, res) {
  const object = req.body;

  if (
    (await motel.ValidRatingCode(object.motel_id, object.rating_code)) === false
  ) {
    res.status(422).json({ message: 'Invalid rating code!' });
  }
  delete object.rating_code;

  const checkDup = await model.FindRating(object);
  //if (checkDup.length > 0) return res.status(400).json({message: "You had already rating for this motel"});
  var status = 500;
  if (checkDup.length > 0) {
    if (
      (await model.Update(checkDup[0]._id, {
        rating: object.rating,
        comment: object.comment,
      })) <= 0
    ) {
      return res.status(500).json({ message: 'Update raitng fail!' });
    }
    const motel_update_rating = await model.UpdateMotelRatings(object.motel_id);
    if (motel_update_rating <= 0) {
      return res.status(500).json({ message: "Can't update ratings of motel" });
    }
    status = 200;
    object._id = checkDup[0]._id;
  } else {
    const id = await model.Add(object);
    const motel_update_rating = await model.UpdateMotelRatings(object.motel_id);
    if (motel_update_rating <= 0) {
      return res.status(500).json({ message: "Can't update ratings of motel" });
    }
    status = 201;
    object._id = id;
  }

  const user = await userModel.Single(object.user_id);
  object.Users = user;
  const ratings = await model.GetAllRatingByMotelId(object.motel_id);
  return res.status(status).json(ratings);
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
