var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var less = require('gulp-less');

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
// less
gulp.task('less', function() {
  gulp.src('./public/css/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('./public/css/'))
});
gulp.task('watch', function() {
  gulp.watch('./public/css/less/*.less', ['less']);
})
// 调试
gulp.task('debug', ['watch', 'nodemon']);
