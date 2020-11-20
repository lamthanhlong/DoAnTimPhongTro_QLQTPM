const express = require('express');
const app = express();

app.use('/test', require('./routes/test.route'));
 
app.listen(3000);

// error handler
app.use((req, res, next) => {
    
});