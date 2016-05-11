var express = require('express');
var fs = require('fs');
var gif = fs.readFileSync('public/img/h5tracker.gif');

var LogModel = require('../models/models.js').LogModel;
var router = express.Router();

router.get('/*.gif', function(req, res, next) {
  var query = req.query;
  LogModel.add({
    data: JSON.stringify(query)
  }, function(id, err) {
    if (id === null) {
      res.status(404);
      res.set('Cache-Control', 'nocache');
      res.end();
    } else {
      res.set('Cache-Control', 'nocache');
      res.end(gif);
    }
  });
});

router.get('/api/list', function(req, res, next) {
  LogModel.getList({
    where: {},
    page: 1
  }, function(docs, count) {
    res.json({
      list: docs,
      count: count
    });
  });
});


module.exports = router;
