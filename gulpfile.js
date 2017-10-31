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
		fs              = require('fs'),
		builder         = require('./builder'),
		yaml            = require('js-yaml'),
		helpers         = require('handlebars-helpers'),
		expand          = require('expand')(),
		assemble        = require('assemble'),
		app             = assemble(),
		del             = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined ? require('del') : '',
		resolve         = require('path').resolve,
		basename        = require('path').basename,
		extname         = require('path').extname;

$.exec   = require('child_process').exec; // http://krasimirtsonev.com/blog/article/Nodejs-managing-child-processes-starting-stopping-exec-spawn
$.fs     = require('fs');
$.marked = require('marked');

var pkgjson = JSON.parse($.fs.readFileSync('package.json'));


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

var glob = {
	layouts: paths.templates + '/layouts/*.{md,hbs}',
	pages: paths.templates + '/pages/**/*.{md,hbs}',
	includes: paths.templates + '/includes/**/*.{md,hbs}',
	data: paths.data + '/**/*.{json,yaml}'
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
// Templatin'
// ===================================================

// Loaders
// ================

// @info
// Load yaml files using a custom dataLoader.
app.dataLoader('yaml', function(str, fp) {
	return yaml.safeLoad(str);
});

function loadData() {
	app.data([glob.data, 'site.yaml', 'package.json'], { namespace: true });
	app.data(expand(app.cache.data));
}


// Custom Helpers
// ================

// @info
// environment control and detection
app.helper('isEnv', function(env) {
	return process.env.NODE_ENV === env;
});

app.helper('date', function() {
	var time_stamp = new Date().getFullYear();
	return time_stamp;
});


// Assemble Tasks
// ================

// @info
// Placing assemble setups inside the task allows
// live reloading/monitoring of files changed.
gulp.task('assemble', ['docs', 'copy'], function() {
	app.option('layout', 'default');
	app.helpers(helpers());
	app.layouts(glob.layouts);
	app.partials(glob.includes);
	loadData();

	// @info
	// Load pages onto the pages collection to ensure the page templates are put on the
	// correct collection and the middleware is triggered.
	app.pages(glob.pages);

	var stream = app.toStream('pages')
		.pipe($.newer(glob.pages))
		.on('error', console.log)
		.pipe(app.renderFile())
		.on('error', console.log)
		.pipe($.extname())
		.on('error', console.log)
		.pipe(app.dest(paths.site))
		.on('error', console.log)
		.pipe($.livereload())

	return stream;
});


// ===================================================
// Production Prep
// ===================================================

gulp.task('usemin', ['sass', 'copy', 'assemble', 'sitemap', 'robots'], function() {
	return gulp.src(paths.site + '/*.html')
		.pipe($.flatmap(function(stream, file) {
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
		paths.site + '/sitemap.xml',
		paths.site + '/robots.txt',
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
		glob.pages,
		glob.includes,
		glob.layouts,
		paths.docs + '/**/*.{md,hbs}',
	], ['assemble']);
});


// ===================================================
// SEO
// ===================================================

gulp.task('robots', function () {
	var stream = gulp.src(paths.dist + '/robots.txt')
		.pipe(gulp.dest(paths.site));

	return stream;
});

gulp.task('sitemap', function () {
	var stream = gulp.src(paths.site + '/**/*.html', {
			read: false
		})
		.pipe($.sitemap({
			siteUrl: pkgjson.homepage
		}))
		.pipe(gulp.dest(paths.site));

	return stream;
});


// ===================================================
// Gulp Instructions
// ===================================================

if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
	gulp.task('default', [ 'sass', 'assemble', 'serve', 'watch']);
} else {
	gulp.task('default', ['usemin', 'serve']);
}
