// ===================================================
// Setup
// ===================================================

var gulp            = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    $               = gulpLoadPlugins(),
    builder         = require('./builder'),
    assemble        = require('assemble'),
    ext             = require('gulp-extname');

$.exec   = require('child_process').exec; // http://krasimirtsonev.com/blog/article/Nodejs-managing-child-processes-starting-stopping-exec-spawn
$.fs     = require('fs');
$.marked = require('marked');


// ===================================================
// Config
// ===================================================

var paths_dir = {
  docs: 'docs',
  docsasset: 'assets',
  site: 'site',
  templates : 'templates',
  dist: 'dist',
  sitejs: 'js',
  sitecss: 'css',
  sitesass: 'src'
};

var paths = {
  docs: paths_dir.docs,
  docsasset: paths_dir.docs + '/' + paths_dir.docsasset,
  site: paths_dir.site,
  templates: paths_dir.site + '/' + paths_dir.templates,
  dist: paths_dir.dist,
  sitejs: paths_dir.site + '/' + paths_dir.sitejs,
  sitecss: paths_dir.site + '/' + paths_dir.sitecss,
  sitesass: paths_dir.site + '/' + paths_dir.sitecss + '/' + paths_dir.sitesass
};


// ===================================================
// Development Server
// ===================================================

gulp.task('servedev', ['assemble'], function() {
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


// ===================================================
// Heroku Server
// ===================================================

gulp.task('serveprod', function() {
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


// ===================================================
// Sass Compiling
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


// ===================================================
// Docs Compiling
// ===================================================

gulp.task('docs', function() {
  var data = {
    'title': 'Transformicons Documentation',

    'fragments': (function(pages) {
        var fragments = [];

        pages.forEach(function(fileName) {
          var file = $.fs.readFileSync(paths.docs + '/' + fileName + '.md', { encoding: 'utf8' });

          fragments.push({ 'body': $.marked(file) });
        });

        return fragments;

      })([ 'markup', 'sass', 'javascript' ])
  };

  var stream = gulp.src(paths.docsasset + '/*.hbs')
    .pipe($.template(data))
    .pipe(gulp.dest(paths.templates + '/pages/'));

  return stream;
});


// ===================================================
// Template Compiling
// ===================================================

assemble.layouts(paths.templates + '/layouts/*.hbs');
assemble.partials(paths.templates + '/includes/*.hbs');
assemble.pages(paths.templates + '/content/*.hbs');
assemble.option('layout', 'default');

gulp.task('assemble', ['docs'], function() {
  var stream = assemble.src(paths.templates + '/pages/*.hbs')
    .pipe(ext())
    .pipe(assemble.dest(paths.site));

  return stream;
});


// ===================================================
// Production Prep
// ===================================================

gulp.task('usemin', ['assemble'], function() {
  var stream = gulp.src([
        paths.site + '/index.html',
        paths.site + '/builder.html',
        paths.site + '/docs.html'
      ])
      .pipe($.usemin({
        css: [$.rev()],
        html: [$.minifyHtml({ empty: true })],
        js: [$.uglify(), $.rev()]
      }))
      .pipe(gulp.dest(paths.site));

  return stream;
});


// ===================================================
// Ground Zero
// ===================================================

gulp.task('clean', function() {
  return gulp.src([
        paths.site + '/css/style.css',
        paths.site + '/css/style.*.css',
        paths.site + '/css/style.*.css',
        paths.site + '/css/prism.*.css',
        paths.site + '/*.html',
        paths.site + '/js/build',
        paths.templates + '/pages/docs.hbs'
      ], { read: false })
    .pipe($.clean());
});


// ===================================================
// File Monitoring
// ===================================================

gulp.task('watch', function() {
  gulp.watch([paths.dist + '/**/*.scss', paths.sitesass + '/**/*.scss'], ['sass']);
  gulp.watch([paths.docsasset + '/*', paths.docs + '*'], ['docs']);
});


// ===================================================
// Gulp Instructions
// ===================================================

gulp.task('default', ['docs', 'assemble', 'sass', 'watch', 'servedev']);
gulp.task('build', ['docs', 'assemble', 'sass', 'usemin', 'serveprod']);