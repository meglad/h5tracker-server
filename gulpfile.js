var gulp = require('gulp');
var util = require('util');
var nodemon = require('gulp-nodemon');
var connect = require('gulp-connect');
var open = require('gulp-open');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');

// 自动重启node
gulp.task('nodemon', function() {
  return nodemon({
    script: './app.js',
    ignore: [],
    env: {
      "NODE_ENV": "development"
    }
  }).on('restart', function() {
    console.log('重新启动');
  });
});

function debugAddress() {
  var net = require('os').networkInterfaces();
  var result;
  Object.keys(net).some(function(key) {
    return net[key].some(function(item) {
      if (!item.internal && item.family === 'IPv4') {
        result = item.address;
        return true;
      }
    });
  });
  return result;
}
gulp.task('open', function() {
  gulp.src(__filename)
    .pipe(open({
      uri: util.format('http://%s:%s/', debugAddress(), 3000)
    }));
});

gulp.task('connect', function() {
  connect.server({
    root: './',
    port: 8080,
    livereload: true
  });
});
// less
gulp.task('less', function() {
  gulp.src('./public/css/less/*.less')
    .pipe(less())
    .pipe(autoprefixer({
      cascade: true,
      remove:true
    }))
    .pipe(gulp.dest('./public/css/'))
});
gulp.task('watch', function() {
  gulp.watch('./public/css/less/*.less', ['less']);
})
// 调试
gulp.task('debug', ['watch', 'nodemon', 'open', 'less']);
