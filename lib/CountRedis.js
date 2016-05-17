var redis = require('redis');
var config = require('./config');
var logTime = require('./utils').logTime;

/*<jdists encoding="linenum">*/

/**
 * 设置 Count 数据
 *
 * @param {Object} params 参数
 * @param {Number} interval 统计间隔时间
 * @return {Promise} 返回处理过程
 */
function getCount(params) {
  console.log('[%s]^linenum getCount() params: %j', logTime(), params);
  return new Promise(function(resolve, reject) {
    var client = redis.createClient(
      config.redis.port,
      config.redis.host, {
        connect_timeout: config.redis.timeout || 1500,
        db: config.redis.database
      }
    ).on('error', function(err) {
      reject(err);
    }).on('connect', function() {
      client.mget(getKeyNameArr('pv', params.interval), function(err, pvReply) {
        (pvReply || []).map(function(item, index) {
          pvReply[index] = item || 0;
        });
        client.mget(getKeyNameArr('uv', params.interval), function(err, uvReply) {
          client.end(true);
          (uvReply || []).map(function(item, index) {
            uvReply[index] = item || 0;
          });

          resolve({
            xData: getTimeArr(params.interval),
            pv: pvReply,
            uv: uvReply
          });
        });
      });
    });
  });
}

exports.getCount = getCount;

/**
 * 设置 Count 数据
 *
 * @param {Object} params 参数
 * @param {string} params.user 用户id
 * @param {string} params.type 是否是'pv'类型
 * @return {Promise} 返回处理过程
 */
function setCount(params) {
  console.log('[%s]^linenum setCount() params: %j', logTime(), params);
  return new Promise(function(resolve, reject) {
    var client = redis.createClient(
      config.redis.port,
      config.redis.host, {
        connect_timeout: config.redis.timeout || 1500,
        db: config.redis.database
      }
    ).on('error', function(err) {
      reject(err);
    }).on('connect', function() {
      // 判断是否uv
      client.setnx(params.user, params.user, function(err, replies) {
        var multi = client.multi();
        if (replies == 1) {
          multi.incr(getKeyName('uv', 600), redis.print);
          multi.incr(getKeyName('uv', 3600), redis.print);
          if (typeof config.redis.expire !== 'undefined') {
            multi.expire(getKeyName('uv', 600), parseInt(config.redis.expire), redis.print);
            multi.expire(getKeyName('uv', 3600), parseInt(config.redis.expire), redis.print);
          }
        }
        if (params.type == 'pv') {
          console.log('pv');
          multi.incr(getKeyName('pv', 600), redis.print);
          multi.incr(getKeyName('pv', 3600), redis.print);
          if (typeof config.redis.expire !== 'undefined') {
            multi.expire(getKeyName('pv', 600), parseInt(config.redis.expire), redis.print);
            multi.expire(getKeyName('pv', 3600), parseInt(config.redis.expire), redis.print);
          }
        }
        multi.exec(function(err, replies) {
          if (typeof config.redis.expire !== 'undefined') {
            client.expire(params.user, parseInt(config.redis.expire), function() {
              client.end(true);
            });
          } else {
            client.end(true);
          }
          resolve({
            status: 200,
            desc: 'success'
          });
        });
        ////////
      });
    });
  });
}

exports.setCount = setCount;
/*</jdists>*/

// 获取当前10分钟内的时间戳
function getTime(sec) {
  sec = sec || 60 * 10;
  var time = Date.now();
  return time - (time % (sec * 1000));
}
// 获取时间数组
function getTimeArr(sec) {
  sec = sec || 60 * 10;
  var current = getTime(sec);
  var arr = [];
  for (var i = 0; i < 24 * 3600 / sec; i++) {
    arr.unshift(current - sec * 1000 * i);
  }
  return arr;
}

function getKeyName(prefix, sec) {
  sec = sec || 60 * 10;
  return [prefix, sec, getTime(sec)].join(':');
}

function getKeyNameArr(prefix, sec) {
  sec = sec || 60 * 10;
  var current = getTime(sec);
  var arr = [];
  for (var i = 0; i < 24 * 3600 / sec; i++) {
    arr.unshift([prefix, sec, (current - sec * 1000 * i)].join(':'));
  }
  return arr;
}
