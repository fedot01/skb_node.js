var express = require('express');
var _ = require('lodash');
var app = express();


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/task2b', function (req, res) {

    var result = 'Invalid fullname';
    const fullname_raw = req.query.fullname.trim() || '';
    var fio_parts = fullname_raw.split(/\s+/);

    if((fullname_raw != '') && !(/[\d\-_\/]/.test(fullname_raw)) && (fio_parts.length <= 3))
    {   
        fio_parts = fio_parts.map(_.capitalize);
        result = fio_parts.slice(-1)[0];
        for (var i = 0; i <= fio_parts.length - 2; i++) {
            result += ` ${fio_parts[i].charAt(0)}.`;
        }        
    }

    res.send(result);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
