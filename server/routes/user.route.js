const express = require("express");
const router = express.Router();
const model = require('../models/user.model');
const validate = require('../utils/validate');
const schema = require('../schemas/user.json');


router.get('/', async (req, res) => {
    var data = await model.GetAll()
    res.json(data);
});
router.get('/paginate', async (req, res) => {
    var data = model.GetPaginate(0, 2)
    res.json(data);
});
router.post('/', validate(schema), async function (req, res) {
    const object = req.body;
    const id = await model.Add(object);
    object._id = id;
    res.status(201).json(object);
});

module.exports = router;