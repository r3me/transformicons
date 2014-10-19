var gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    $            = require('gulp-load-plugins')();

$.exec = require('child_process').exec;


// Server
gulp.task('serve', function() {
  $.connect.server({
    root: ['site'],
    port: 3000,
    livereload: true
  });

  $.exec('open http://localhost:3000');
});


// Compiling
gulp.task('sass', function() {
  gulp.src('site/styles/style.scss')
    .pipe($.sass())
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('site/styles'));
});


// Watching
gulp.task('watch', function() {
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('site/styles/**/*.scss', ['sass']);
});


// Tasks
gulp.task('default', ['sass', 'watch', 'serve']);
