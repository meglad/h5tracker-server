var express = require('express');
var fs = require('fs');
var url = require('url');

var gif = fs.readFileSync('./public/img/h5tracker.gif');
var config = require('../lib/config');
var LogModel = require('../models/models').LogModel;
var CountRedis = require('../lib/CountRedis');

var router = express.Router();

router.get('/*.gif', function(req, res, next) {
  var query = req.query;
  new Promise(function(resolve, reject) {
    if (typeof query.user === 'undefined') {
      reject('params user is undefined');
    } else {
      resolve();
    }
  }).then(function() {
    // 请求页面的 url
    var referer = req.get('Referer');
    return LogModel.add({
      //domain: referer ? url.parse(referer).pathname : undefined,
      url: referer,
      data: query
    });
  }).then(function() {
    return CountRedis.setCount({
      user: query.user,
      type: query.type
    });
  }).then(function(reply) {
    res.set('Cache-Control', 'nocache');
    res.end(gif);
  }).catch(function() {
    res.status(404);
    res.set('Cache-Control', 'nocache');
    res.end();
  });
});

router.get('/test', function(req, res, next) {
  res.render('../public/index.html', { layout: false });
});

module.exports = router;
