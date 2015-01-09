// Gulp Setup
// ===================================================

var gulp            = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    $               = gulpLoadPlugins(),
    builder         = require('./builder');

$.exec   = require('child_process').exec;
$.fs     = require('fs');
$.marked = require('marked');


// Paths
// ===================================================

var paths_dir = {
  docs: 'docs',
  docsasset: 'assets',
  site: 'site',
  dist: 'dist',
  sitejs: 'js',
  sitecss: 'css',
  sitesass: 'src',
};

var paths = {
  docs: paths_dir.docs,
  docsasset: paths_dir.docs + '/' + paths_dir.docsasset,
  site: paths_dir.site,
  dist: paths_dir.dist,
  sitejs: paths_dir.site + '/' + paths_dir.sitejs,
  sitecss: paths_dir.site + '/' + paths_dir.sitecss,
  sitesass: paths_dir.site + '/' + paths_dir.sitecss + '/' + paths_dir.sitesass
};


// Development Server
// ===================================================

gulp.task('serve', function() {
  $.connect.server({
    root: [paths.site],
    port: 5000,
    livereload: true,
    middleware: function(connect) {
      return [
        connect().use(connect.query()),
        connect().use(builder.middleware())
      ];
    }
  });

  $.exec('open http://localhost:5000');
});


// Heroku Server
// ===================================================

gulp.task('cloud', function() {
  $.connect.server({
    root: [paths.site],
    port: process.env.PORT || 5000,
    livereload: false,
    middleware: function(connect) {
      return [
      connect().use(connect.query()),
      connect().use(builder.middleware())
      ];
    }
  });
});


// Styles Compiling
// ===================================================

gulp.task('sass', function() {
  gulp.src(paths.sitesass + '/**/*.scss')
    .pipe($.sass())
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.sitecss))
    .pipe($.connect.reload());
});


// Scripts
// ===================================================

gulp.task('usemin', function () {
  return gulp.src([paths.site + '/index.html', paths.site + '/builder.html', paths.site + '/docs.html'])
    .pipe($.usemin({
      html: [$.minifyHtml({empty: true})],
      js: [$.uglify()]
    }))
    .pipe(gulp.dest('site/dist'));
});


// Documentation
// ===================================================

gulp.task('docs', function() {
  var data = {
    'title': 'Transformicons Documentation',

    'fragments': (function(pages) {
        var fragments = [];
        pages.forEach(function(fileName) {
          var file = $.fs.readFileSync(paths.docs + '/' + fileName + '.md', {encoding: 'utf8'});
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

  gulp.src(paths.docsasset + '/*.html')
    .pipe($.template(data))
    .pipe(gulp.dest(paths.site));
});


// Watching
// ===================================================

gulp.task('watch', function() {
  gulp.watch([paths.dist + '/**/*.scss', paths.sitesass + '/**/*.scss'], ['sass']);
  gulp.watch([paths.docsasset + '/*', paths.docs + '*'], ['docs']);
});


// Tasks
// ===================================================

gulp.task('default', ['sass', 'docs', 'watch', 'serve']);