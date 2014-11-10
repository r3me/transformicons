var gulp                  = require('gulp'),
    gutil                 = require('gulp-util'),
    concat                = require('gulp-concat'),
    uglify                = require('gulp-uglify'),
    autoprefixer          = require('gulp-autoprefixer'),
    sass                  = require('gulp-sass'),
    _                     = require('lodash'),
    url                   = require('url'),
    deps                  = require('./deps.json'),
    FILENAME              = 'transformicons',
    ROOT                  = __dirname + '/dist/',
    ROOT_SCSS             = ROOT + FILENAME + '/',
    CONCAT_FILE_IN_MEMORY = './tcons.scss',
    BASE                  = '/build/',
    MSG_START             = 'WARN: "',
    MSG_END               = '" transform is not defined in deps.json',
    contentMap            = {
                              'css': {
                                build: buildCSS,
                                mime : 'text/css'
                              },
                              'scss': {
                                build: buildSCSS,
                                mime: 'text/plain'
                              },
                              'js': {
                                build: buildJS,
                                mime: 'text/javascript'
                              }
                            };

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
    return ROOT_SCSS + path;
  });
}


function buildStylesheet(isCSS, params, cb) {
  gulp.src(getFiles(params))
    .pipe(concat(CONCAT_FILE_IN_MEMORY))
    .pipe(isCSS ? sass() : gutil.noop())
    .pipe(isCSS ? autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                  }) : gutil.noop())
    .pipe(gutil.buffer(function(err, data) {
      cb && cb(err, data);
    }));
}


function buildSCSS(params, cb) {
  buildStylesheet(false, params, function(err, data) {
      cb && cb(err, data);
    });
}


function buildCSS(params, cb) {
  buildStylesheet(true, params, function(err, data) {
    cb && cb(err, data);
  });
}


function buildJS(params, cb) {
  gulp.src(ROOT + FILENAME + '.js')
    .pipe(params.minified === 'true' ? uglify() : gutil.noop())
    .pipe(gutil.buffer(function(err, files) {
      if (err) {
        cb & cb(err);
        return;
      }

      cb && cb(null, files);
    }));
}


exports.middleware = function() {
  return function(req, res, next) {
    var pathname = url.parse(req.url).pathname;

    if (pathname.indexOf(BASE) === -1) {
      next();
      return;
    }

    var type = pathname.substring(BASE.length, pathname.length);

    if (!type || !contentMap[type]) {
      next();
      return;
    }

    contentMap[type].build(req.query, function(err, buffer) {

      if (!err && buffer) {
        var contents = buffer[0]._contents;

        // TODO change file if minified
        res.setHeader('Content-Disposition', 'attachment; filename="' + FILENAME + '.' + type + '"');
        res.setHeader('Content-Type', contentMap[type].mime);
        res.setHeader('Content-Length', contents.length);
        res.end(contents);
      }
      next();
    });
  };
};
