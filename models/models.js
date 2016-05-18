'use strict';

var config = require('../config/config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogSchema = new Schema({
  domain: { type: String },
  url: { type: String },
  data: { type: Object },
  created: { type: Date, default: Date.now } //创建时间
});

LogSchema.statics.getList = function(data, callback) {
  var where = data.where || {};
  var page = data.page || 1;

  var _this = this;
  return new Promise(function(resolve, reject) {
    _this.model('LogModel')
      .find(where)
      .sort({ _id: -1 })
      .exec(function(err, desc) {
        if(err) {
          console.error('LogSchema getList() error: %j', err);
          reject(err);
        }else{
          resolve(desc);
        }
      });
  });
};

LogSchema.statics.add = function(data) {
  var _this = this;
  return new Promise(function(resolve, reject) {
    _this.model('LogModel')
      .create(data, function(err, desc) {
        if (err) {
          console.error('LogSchema add() error: %j', err);
          reject(err);
        } else {
          resolve(desc._id);
        }
      });
  });
};
LogSchema.statics.del = function(id) {
  var _this = this;
  return new Promise(function(resolve, reject) {
    _this.model('LogModel')
      .remove({ _id: id }, function(err, desc) {
        if (err) {
          console.error('LogSchema del() error: %j', err);
          reject(err);
        } else {
          resolve(desc);
        }
      });
  });
};
LogSchema.statics.set = function() {
  return;
};

exports.LogModel = mongoose.model('LogModel', LogSchema);