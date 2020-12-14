var history = require("connect-history-api-fallback");
var express = require("express");

var serveStatic = require("serve-static");
var app = express();
//add this middleware
app.use(history());
app.use(serveStatic(__dirname + "/dist"));
var PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
    console.log(`The Best Solution frontend is running at http://localhost:${PORT}`);
 });