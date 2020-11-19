const express = require('express');
const app = express();
const db = require('./utils/db');
 
app.get('/', async function (req, res) {
    var x = await db.deleteMany("Users", {name: "Hulk"}, {name: "H"});
    console.log(x);
    res.send("ok");
});
 
app.listen(3000);