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
    ROOT_SCSS             = ROOT + '/sass/',
    TEMPLATES             = __dirname + '/site/templates/includes/tcons/',
    BASE                  = '/build/',
    MSG_START             = 'WARN: "',
    MSG_END               = '" transform is not defined in deps.json',
    cacheFile             = {},
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
                              },
                              'html': {
                                build: buildHTML,
                                mime : 'text/html'
                              }
                            };

// Dependencies for all transformations
function getDependencies(params) {
  var files = ['base/_config-globals.scss'];

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

function buildHTML(params, key, cb) {
  var markupFiles = [];

  for(var initial in params) {
    // only array to simplify processing
    if (params[initial] && !Array.isArray(params[initial])) {
      params[initial] = [params[initial]];
    }

    params[initial].forEach(function(target) {
      markupFiles.push(TEMPLATES + initial + '-' + target + '.hbs');
    });
  }

  // TODO: use assemble with layout for button if provide
  gulp.src(markupFiles)
    .pipe(concat('./markup' + new Date().getTime()))
    .pipe(gutil.buffer(function(err, data) {
      if (err) {
        console.log(err);
      }
      cb && cb(err, key, data);
    }));
}

function buildStylesheet(isCSS, params, cb) {
  gulp.src(getFiles(params))
    .pipe(concat('./tmp' + new Date().getTime()))
    .pipe(isCSS ? sass() : gutil.noop())
    .pipe(isCSS ? autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                  }) : gutil.noop())
    .pipe(gutil.buffer(function(err, data) {
      cb && cb(err, data);
    }));
}

function buildSCSS(params, key, cb) {
  buildStylesheet(false, params, function(err, data) {
    cb && cb(err, key, data);
  });
}

function buildCSS(params, key, cb) {
  buildStylesheet(true, params, function(err, data) {
    cb && cb(err,key,data);
  });
}

function buildJS(params, key, cb) {
  gulp.src(ROOT + '/js/' + FILENAME + '.js')
    .pipe(params.minified === 'true' ? uglify() : gutil.noop())
    .pipe(gutil.buffer(function(err, files) {
      if (err) {
        cb & cb(err);
        return;
      }

      cb && cb(null, key, files);
    }));
}

function process(res, data) {
  if (!data.buffer[0]) {
    console.log('no data content to return');
    res.end();
    return;
  }
  var contents = data.buffer[0]._contents;

  if (data.minified) {
    data.filename += '.min';
  }

  res.setHeader('Content-Disposition', 'attachment; filename="' + data.filename + '.' + data.type + '"');
  res.setHeader('Content-Type', contentMap[data.type].mime);
  res.setHeader('Content-Length', contents.length);
  res.end(contents);
}

exports.middleware = function() {
  return function(req, res, next) {

    var parseUrl = url.parse(req.url);
        pathname = parseUrl.pathname,
        key      = parseUrl.path,
        filename = FILENAME;

    if (pathname.indexOf(BASE) === -1) {
      next();
      return;
    }

    var type = pathname.substring(BASE.length, pathname.length);

    if (!type || !contentMap[type]) {
      next();
      return;
    }

    if (cacheFile[key]) {
      process(res, cacheFile[key]);
      next();
      return;
    }

    contentMap[type].build(req.query, key, function(err, key, buffer) {
      if (err) {
        console.log(err);
        next();
        return;
      }

      var data = {
        buffer: buffer,
        filename: filename,
        type: type,
        minified: !!req.query.minified
      };

      if (buffer) {
        process(res, data);
      }

      cacheFile[key] = data;
      next();
    });
  };
};
