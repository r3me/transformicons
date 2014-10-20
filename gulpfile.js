var gulp         = require('gulp'),
		autoprefixer = require('gulp-autoprefixer'),
		$            = require('gulp-load-plugins')();

$.exec   = require('child_process').exec;
$.fs     = require('fs');
$.marked = require('marked');


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


// Documentation
gulp.task('docs', function() {
	var data = {
		'title': 'Transformicons -- Documentation',

		'fragments': (function(pages) {
				var fragments = [];
				pages.forEach(function(fileName) {
					var file = $.fs.readFileSync('docs/' + fileName + '.md', {encoding: 'utf8'});
					fragments.push( {
						'body': $.marked(file)
					});
				});
				return fragments;
			})([
				'required-javascript',
				'transformicons'
			])
	};

	gulp.src('docs/assets/index.html')
		.pipe($.template(data))
		.pipe(gulp.dest('site/docs'));
});


// Watching
gulp.task('watch', function() {
	gulp.watch('sass/**/*.scss', ['sass']);
	gulp.watch('site/styles/**/*.scss', ['sass']);
	gulp.watch(['docs/assets/*', 'docs/*'], ['docs']);
});


// Tasks
gulp.task('default', ['sass', 'docs', 'watch', 'serve']);
