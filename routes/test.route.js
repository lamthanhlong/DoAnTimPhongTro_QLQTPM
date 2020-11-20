const express = require("express");
const router = express.Router();
const test = require('../models/test.model');


router.get('/', async (req, res, next) => {
    test.GetAll().then((data)=>{
        res.send(data);
    }).catch(next);
});
router.get('/paginate', async (req, res, next) => {
    test.GetPaginate(0, 2).then((data)=>{
        res.send(data);
    }).catch(next);
});

module.exports = router;