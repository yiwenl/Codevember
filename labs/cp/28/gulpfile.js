'use strict';

var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var browserify  = require('browserify');
var source      = require('vinyl-source-stream2')
var uglify      = require('gulp-uglify');
var sass        = require('gulp-ruby-sass');
var prefix      = require('gulp-autoprefixer');
var watchify 	= require('watchify');
var buffer 		= require('vinyl-buffer');
var reload      = browserSync.reload;


var bundler = watchify(browserify('./src/js/app.js', watchify.args));
    gulp.task('browserify', bundle);

bundler.on('update', bundle);     

function logError(msg) {
	console.log( msg.toString() );
}

function bundle() {
    var b = bundler.bundle()
	.on('error', logError)
	.pipe(source('bundle.js'))
	.pipe(buffer())
	.pipe(gulp.dest('./dist/bundle/'))
	.pipe(reload({stream: true, once: true}));

    return b;
}

gulp.task('watch', function() {
	gulp.watch('./src/scss/*.scss', ['sass']);
});


gulp.task('sass', function() {
	return sass('./src/scss/main.scss') 
	.on('error', function (err) {
	  console.error('Error!', err.message);
	})
	.pipe(prefix({
			browsers: ['last 2 versions'],
			cascade: false
		}))
	.pipe(gulp.dest('./dist/css'))
	.pipe(reload({stream:true}));
});

gulp.task('browser-sync', function() {
	browserSync.init({
	    browser: 'google chrome',
	    server: {
	      baseDir: './dist/'
	    },
	    files: [
	      './dist/js/bundle.js',
	      './dist/css/main.css',
	      './dist/index.html'
	    ],
	    // open: false,
	    // port: '8000',
	    reloadDebounce: 500
	  });
});

gulp.task('default', ['browserify', 'sass', 'browser-sync', 'watch']);
