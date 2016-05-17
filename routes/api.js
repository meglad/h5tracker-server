var express = require('express');
var fs = require('fs');
var url = require('url');
var gif = fs.readFileSync('public/img/h5tracker.gif');

var logTime = require('../lib/utils').logTime;
var LogModel = require('../models/models.js').LogModel;
var CountRedis = require('../lib/CountRedis');
var config = require('../lib/config');
var router = express.Router();

router.get('/:type/:days/:interval', function(req, res, next) {
  var type = req.params.type;
  var days = parseInt(req.params.days);
  days = days <= 0 ? 1 : days;
  var interval = parseInt(req.params.interval);
  interval = [600, 3600].indexOf(interval) === -1 ? 600 : interval;

  CountRedis.getCount({
    interval: interval
  }).then(function(reply) {
    res.json(reply);
  }).catch(function(err) {
    console.error('[%s]^linenum: %j', logTime(), err);
    next();
  });
});

module.exports = router;
