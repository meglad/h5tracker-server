var logTime = require('./lib/utils').logTime;

var express = require('express');
var hbs = require('hbs');
var path = require('path');
var routes = require('./routes/routes');

var app = express();

// 视图
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);
// 路由
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
// 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// 错误页面
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development' ? err : {})
  });
});

/*<jdists encoding="linenum">*/
var port = parseInt(process.argv[2]) || 3000;
app.listen(port, function() {
  console.log('[%s]^linenum server listen: %j', logTime(), port);
});
/*</jdists>*/
