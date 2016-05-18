var config = {
  mongodb: {
    connection: 'mongodb://127.0.0.1:27017/log'
  },
  redis: {
    port: 6333,             //端口
    host: '127.0.0.1',      //主机
    database: 1,            //数据库名
    expire: 24 * 60 * 60    //过期时间  1天
  }
};

module.exports = config;