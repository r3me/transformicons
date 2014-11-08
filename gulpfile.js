var gulp         = require('gulp'),
    $            = require('gulp-load-plugins')(),
    builder      = require('./builder');

$.exec   = require('child_process').exec;
$.fs     = require('fs');
$.marked = require('marked');


// Server
gulp.task('serve', function() {
  $.connect.server({
    root: ['site'],
    port: 3000,
    livereload: true,
    middleware: function(connect) {
      return [
        connect().use(connect.query()),
        connect().use(builder.middleware())
      ];
    }
  });

  $.exec('open http://localhost:3000');
});


// Compiling
gulp.task('sass', function() {
  gulp.src('site/css/src/style.scss')
    .pipe($.sass())
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('site/css'));
});


// Documentation
gulp.task('docs', function() {
  var data = {
    'title': 'Transformicons Documentation',

    'fragments': (function(pages) {
        var fragments = [];
        pages.forEach(function(fileName) {
          var file = $.fs.readFileSync('docs/' + fileName + '.md', {encoding: 'utf8'});
          fragments.push({
            'body': $.marked(file)
          });
        });
        return fragments;
      })([
        'markup',
        'sass',
        'javascript'
      ])
  };

  gulp.src('docs/assets/docs.html')
    .pipe($.template(data))
    .pipe(gulp.dest('site'));
});


// Watching
gulp.task('watch', function() {
  gulp.watch('dist/**/*.scss', ['sass']);
  gulp.watch('site/css/**/*.scss', ['sass']);
  gulp.watch(['docs/assets/*', 'docs/*'], ['docs']);
});


// Tasks
gulp.task('default', ['sass', 'docs', 'watch', 'serve']);
