var gulp                  = require('gulp'),
    gutil                 = require('gulp-util'),
    concat                = require('gulp-concat'),
    autoprefixer          = require('gulp-autoprefixer'),
    sass                  = require('gulp-sass'),
    _                     = require('lodash'),
    url                   = require('url'),
    deps                  = require('./deps.json'),
    ROOT                  = __dirname + '/dist/transformicons/',
    CONCAT_FILE_IN_MEMORY = './tcons.scss',
    MSG_START             = 'WARN: "',
    MSG_END               = '" transform is not defined in deps.json';

// get files dependencies for all transformations
// implicit include:
// "base/_config-globals.scss",
// "base/_global-styles.scss",
// "base/_config-utilities.scss"

function getDependencies(params) {
  var files = ['base/_config-globals.scss',
               'base/_global-styles.scss',
               'base/_config-utilities.scss'];

  for(var initial in params) {

    // only array to simplify processing
    if (params[initial] && !Array.isArray(params[initial])) {
      params[initial] = [params[initial]];
    }

    params[initial].forEach(function(target) {
      if (deps[initial]) {
        if (deps[initial][target]) {
          deps[initial][target].forEach(function(file) {
            files.push(file);
          });
        } else {
          console.warn(MSG_START + initial + '" to "' + target + MSG_END);
        }
      } else {
        console.warn(MSG_START + initial + MSG_END);
      }
    });
  }

  return _.uniq(files);
}

function getFiles(params) {
  return getDependencies(params).map(function(path) {
    return ROOT + path;
  });
}

function buildSCSS(params, cb) {

  gulp.src(getFiles(params))
    .pipe(concat(CONCAT_FILE_IN_MEMORY))
    .pipe(gutil.buffer(function(err, files) {
      if (err) {
        cb & cb(err);
        return;
      }

      cb && cb(null, files[0]._contents);
     }));
}

function buildCSS(params, cb) {

  gulp.src(getFiles(params))
    .pipe(concat(CONCAT_FILE_IN_MEMORY))
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gutil.buffer(function(err, files) { // TODO: duplicate code
      if (err) {
        cb & cb(err);
        return;
      }

      cb && cb(null, files[0]._contents);
    }));
}

exports.middleware = function() {
  return function(req, res, next) {
    var parseUrl = url.parse(req.url),
        type     = 'css',
        fn       = buildCSS;

    if (parseUrl.pathname.indexOf('/build/') === -1) {
      next();
      return;
    }

    if (parseUrl.pathname.indexOf('/scss') !== -1) {
      type = 'scss';
      fn = buildSCSS;
    }

    fn(req.query, function(err, buffer) {

      if (err) {
        console.log(err);
        return;
      }

      res.setHeader('Content-Disposition', 'attachment; filename="transformicons.' + type + '"');
      res.setHeader('Content-Type', type === 'css' ? 'text/css' : 'text/plain');
      res.setHeader('Content-Length', buffer.length);
      res.end(buffer);
      next();
    });
  };
};