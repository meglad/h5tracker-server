'use strict';

var config = require('../lib/config.js')
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogSchema = new Schema({
  data: { type: String },
  created: { type: Date, default: Date.now } //创建时间
});

LogSchema.statics.getList = function(data, callback) {
  var where = data.where || {};
  var page = data.page || 1;

  return this.model("LogModel")
    .count(where, function(err, count) {
      if (err) {
        console.error('LogSchema getList() count error: %j', err);
        count = 0;
      }
      this.find(where)
        .sort({ _id: -1 })
        .skip((page - 1) * config.pagesize)
        .limit(config.pagesize)
        .exec(function(err, docs) {
          if (err) {
            console.error('LogSchema getList() error: %j', err);
            callback([], 0);
          } else {
            callback(docs, count);
          }
        });
    });
};

LogSchema.statics.getOne = function(id, callback) {
  return this.model('LogModel')
    .findOne({ _id: id })
    .exec(function(err, doc) {
      if (err) {
        console.error('LogSchema getOne() error: %j', err);
        callback([]);
      } else {
        callback(doc);
      }
    });
};

LogSchema.statics.add = function(data, callback) {
  return this.model("LogModel")
    .create(data, function(err, doc) {
      if (err) {
        console.error('LogSchema add() error: %j', err);
        callback(null, err);
      } else {
        callback(doc._id);
      }
    });
};
LogSchema.statics.del = function(id, callback) {
  return this.model("LogModel")
    .remove({ _id: id }, function(err, docs) {
      if (err) {
        console.error('LogSchema del() error: %j', err);
        callback([]);
      } else {
        callback(docs);
      }
    });
};
LogSchema.statics.set = function() {
  return;
};

exports.LogModel = mongoose.model('LogModel', LogSchema);
