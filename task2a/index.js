var express = require('express');
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/task2a', function (req, res) {
    const a = Number(req.query.a) || 0;
    const b = Number(req.query.b) || 0;

    res.send((a + b).toString());
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
