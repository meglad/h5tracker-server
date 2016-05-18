var express = require('express');
var fs = require('fs');
var url = require('url');

var gif = fs.readFileSync('./public/img/h5tracker.gif');
var config = require('../config/config');
var LogModel = require('../models/models').LogModel;
var CountRedis = require('../lib/CountRedis');

var router = express.Router();

router.get('/*.gif', function(req, res, next) {
  var query = req.query;
  var isPageview = (query.ht == 'pageview');
  new Promise(function(resolve, reject) {
    if (typeof query.uid === 'undefined') {
      reject('params uid is undefined');
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
      uid: query.uid,
      pageview: isPageview
    });
  }).then(function(reply) {
    res.set('Cache-Control', 'nocache');
    res.end(gif);
  }).catch(function() {
    console.error('[%s]^linenum "/*.gif": %j', logTime(), err);
    res.status(404);
    res.set('Cache-Control', 'nocache');
    res.end();
  });
});

router.get('/test', function(req, res, next) {
  res.render('../public/index.html', { layout: false });
});

module.exports = router;
