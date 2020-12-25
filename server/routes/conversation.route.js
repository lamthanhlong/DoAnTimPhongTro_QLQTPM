const express = require('express');
const router = express.Router();
const model = require('../models/conversation.model');
const validate = require('../utils/validate');
const schema = require('../schemas/conversation.json');

router.get('/', async (req, res) => {
  var data = await model.GetAll();
  res.json(data);
});
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  var data = await model.Single(id);
  res.json(data);
});
router.get('/paginate', async (req, res) => {
  var data = model.GetPaginate(0, 2);
  res.json(data);
});
router.post('/', async function (req, res) {
  // const object = req.body;
  // const checkDup = await model.FindConversation(object);
  // if (checkDup) return res.status(400).end();
  // const id = await model.Add(object);
  // object._id = id;
  // res.status(201).json(object);
  const obj = req.body;
  const data = await model.Append(obj.sender, obj.msg, obj.receiver);
  res.status(200).json(data);
});
router.put('/:id', async function (req, res) {
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
  if (!check) {
    return res.status(400).end();
  }
  res.json({ success: true });
});

module.exports = router;
