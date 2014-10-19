var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
$.exec = require('child_process').exec;

gulp.task('serve', function() {
  $.connect.server({
    root: ['site'],
    port: 3000,
    livereload: true
  });

  $.exec('open http://localhost:3000');
});

gulp.task('sass', function() {
  gulp.src('site/styles/style.scss')
    .pipe($.sass())
    .pipe(gulp.dest('site/styles'));
});

gulp.task('watch', function() {
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('site/styles/**/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'watch', 'serve']);
