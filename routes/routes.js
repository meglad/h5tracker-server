var express = require('express');
var fs = require('fs');
var gif = fs.readFileSync('public/img/h5tracker.gif');

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {
    title: '首页'
  });
});

router.get('/*.gif', function(req, res, next) {
  var query = req.query;
  res.end(JSON.stringify(query));
  //res.end(gif);
});

module.exports = router;
