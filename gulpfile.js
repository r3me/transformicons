// ===================================================
// Setup
// ===================================================

var gulp            = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    $               = gulpLoadPlugins({
                        rename: {
                          'gulp-htmlmin' : 'minhtml',
                          'gulp-foreach' : 'foreach'
                        }
                      }),
    basename        = require('path').basename,
    extname         = require('path').extname,
    builder         = require('./builder'),
    assemble        = require('assemble'),
    helpers         = require('handlebars-helpers'),
    app             = assemble(),
    del             = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined ? require('del') : '';

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
    .pipe($.sass({
      outputStyle: 'compressed'
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.sitecss))
    .pipe($.connect.reload());

  return stream;
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

gulp.task('assemble', ['docs', 'copy'], function() {
  app.option('layout', 'default');
  app.helpers(helpers());
  app.layouts(paths.templates + '/layouts/*.{md,hbs}');
  app.partials(paths.templates + '/includes/**/*.{md,hbs}');

  var stream = app.src(paths.templates + '/pages/**/*.{md,hbs}')
    .on('error', console.log)
    .pipe(app.renderFile())
    .on('error', console.log)
    .pipe($.extname())
    .pipe(app.dest(paths.site))
    .pipe($.connect.reload());

  return stream;
});


// ===================================================
// Production Prep
// ===================================================

/*
 * foreach is because usemin 0.3.21 won't manipulate
 * multiple files as an array.
 */

gulp.task('usemin', ['sass', 'copy', 'assemble'], function() {
  return gulp.src(paths.site + '/*.html')
    .pipe($.foreach(function(stream, file) {
      return stream
        .pipe($.usemin({
          assetsDir: paths.site,
          css: [ $.rev() ],
          html: [ $.minhtml({ collapseWhitespace: true }) ],
          js: [ $.uglify(), $.rev() ]
        }))
        .pipe(gulp.dest(paths.site));
    }));
});


// ===================================================
// Utilities
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

gulp.task('copy', function() {
  var stream = gulp.src(paths.dist + '/' + 'js/transformicons.js')
      .pipe(gulp.dest(paths.sitejs + '/'  + 'lib'));

  return stream;
});


// ===================================================
// File Monitoring
// ===================================================

gulp.task('watch', function() {
  gulp.watch([
    paths.dist + '/**/*.scss',
    paths.sitesass + '/**/*.scss'
  ], ['sass']);

  gulp.watch([
    paths.templates + '/pages/**/*.{md,hbs}',
    paths.templates + '/includes/**/*.{md,hbs}',
    paths.docs + '/**/*.{md,hbs}',
  ], ['assemble']);
});


// ===================================================
// Gulp Instructions
// ===================================================

if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
  gulp.task('default', [ 'sass', 'assemble', 'serve', 'watch']);
} else {
  gulp.task('default', ['usemin', 'serve']);
}
