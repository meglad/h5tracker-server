var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('debug', function() {
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
