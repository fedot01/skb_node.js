var cors = require('cors');
var express = require('express');
var _ = require('lodash');

const app = express();
app.use(cors());

var model = {"board":{"vendor":"IBM","model":"IBM-PC S-100","cpu":{"model":"80286","hz":12000},"image":"http://www.s100computers.com/My%20System%20Pages/80286%20Board/Picture%20of%2080286%20V2%20BoardJPG.jpg","video":"http://www.s100computers.com/My%20System%20Pages/80286%20Board/80286-Demo3.mp4"},"ram":{"vendor":"CTS","volume":1048576,"pins":30},"os":"MS-DOS 1.25","floppy":0,"hdd":[{"vendor":"Samsung","size":33554432,"volume":"C:"},{"vendor":"Maxtor","size":16777216,"volume":"D:"},{"vendor":"Maxtor","size":8388608,"volume":"C:"}],"monitor":null};


app.get('/task3a/volumes', (req, res) => {
    var hdds = _.pick(model, 'hdd').hdd;
    var result = _.mapValues(_.zip(_.map(hdds, 'volume'), _.map(hdds, 'size')).reduce((o, [k, v]) => {
      o[k] = o[k] + v || v; return o}, {}), (v) => {return v + 'B'});
    res.json(result);
});

app.get('/task3a/(*)', (req, res) => {
    var value = req.params[0] ? _.get(model, req.params[0].split('/')) : model;
    (value !== undefined) ? res.json(value) : res.status(404).send('Not found');
});

app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
