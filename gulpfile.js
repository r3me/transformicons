// ===================================================
// Setup
// ===================================================

var gulp            = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    $               = gulpLoadPlugins(),
    builder         = require('./builder'),
    assemble        = require('assemble'),
    ext             = require('gulp-extname'),
    minifyHtml      = require('gulp-minify-html'),
    minifyCSS       = require('gulp-minify-css'),
    del             = require('del');

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
// Server
// ===================================================

gulp.task('serve', ['assemble'], function() {
  $.connect.server({
    root: [paths.site],
    port: process.env.PORT || 5000,
    livereload: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined ? true : false,
    middleware: function(connect) {
      return [
        connect().use(connect.query()),
        connect().use(builder.middleware())
      ];
    }
  });

  if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined)
    $.exec('open http://localhost:5000');
});


// ===================================================
// Stylesheets
// ===================================================

gulp.task('sass', function() {
  var stream = gulp.src(paths.sitesass + '/**/*.scss')
    .pipe($.sass())
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.sitecss))
    .pipe($.connect.reload());

  return stream;
});

gulp.task('cssmin', ['sass'], function() {
  var stream = gulp.src(paths.sitecss + '/*.css')
    .pipe(minifyCSS({ keepBreaks:true }))
    .pipe(gulp.dest(paths.sitecss));

  return stream;
});


gulp.task('copy', function() {
  gulp.src(paths.dist + '/' + 'js/transformicons.js')
      .pipe(gulp.dest(paths.sitejs + '/'  + 'lib'));
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

gulp.task('assemble', ['docs', 'copy'], function() {
  var stream = assemble.src(paths.templates + '/pages/*.hbs')
    .pipe(ext())
    .pipe(assemble.dest(paths.site));

  return stream;
});


// ===================================================
// Production Prep
// ===================================================

gulp.task('usemin', ['assemble', 'cssmin', 'copy'], function() {
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

gulp.task('clean', function(cb) {
  del([
    paths.site + '/css/*.css',
    paths.site + '/*.html',
    paths.site + '/js/build',
    paths.sitejs + '/lib/transformicons.js',
    paths.templates + '/pages/docs.hbs'
  ], cb);
});


// ===================================================
// File Monitoring
// ===================================================

gulp.task('watch', function() {
  gulp.watch([paths.dist + '/**/*.scss', paths.sitesass + '/**/*.scss'], ['sass']);
  gulp.watch([paths.templates + '/**/*.hbs', paths.site + '/*.html', paths.docsasset + '/*', paths.docs + '*'], ['assemble']);
});


// ===================================================
// Gulp Instructions
// ===================================================

if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
  gulp.task('default', ['sass', 'assemble', 'serve', 'watch']);
} else {
  gulp.task('default', ['usemin', 'serve']);
}