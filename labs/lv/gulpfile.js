/*eslint-env node*/
'use strict';

var argv         = require('yargs').argv,
  gulp         = require('gulp'),
  browserSync  = require('browser-sync').create(),
  reactify     = require('reactify'),
  babelify     = require('babelify'),
  concat       = require('gulp-concat'),
  eslint       = require('gulp-eslint'),
  watch        = require('gulp-watch'),
  exit         = require('gulp-exit'),
  clean        = require('gulp-clean'),
  sourcemaps   = require('gulp-sourcemaps'),
  postcss      = require('gulp-postcss'),
  browserify   = require('browserify'),
  source       = require('vinyl-source-stream'),
  notify       = require("gulp-notify");

var config = {
  paths: {
    html   : './src/*.html',
    js     : './src/js/app/**/*.js',
    jsLibs : './src/js/libs/**/*.js',
    images : './src/images/*',
    fonts : './src/fonts/*',
    json   : './src/json/*',
    styl   : './src/css/*',
    mainJs : './src/js/app/main.js',
    dist   : './dist',
    dev    : './dev',
    app    : './src'
  }
};


var production = (argv.env === 'production') ? true : false;
var dir = (production) ? config.paths.dist : config.paths.dev;


gulp.task('style', function() {
  var processors = [
    require('postcss-import'),      // Inline css import
    require('postcss-nested'),
    require('lost'),              // Grid system
    require('rucksack-css'),        // CSS Helper library
    require('postcss-pxtorem'),     // Pixel values to rem
    require('cssnext')({}),         // Use future css properties and variables
    require('autoprefixer')({browsers: ['last 2 versions'] }),
    require('css-mqpacker'),
    require('csswring')
  ];
  return gulp.src(config.paths.styl)
      .pipe(sourcemaps.init())
      .pipe(postcss(processors))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(dir+'/css'))
      .pipe(browserSync.reload({stream:true}));
});

gulp.task('lint', function() {
  return gulp.src(config.paths.js)
    .pipe( eslint() )
    .pipe(eslint.formatEach());
});

gulp.task('js', function() {
  browserify(config.paths.mainJs)
    .transform(babelify)
    .bundle()
    .on('error', console.error.bind(console))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(dir + '/js'))
    .pipe( browserSync.reload({stream:true}) )
    .pipe(notify("Javascript Compiled!"));
});

gulp.task('jsLibs', function() {
  gulp.src(config.paths.jsLibs)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(dir+'/js'))
    .pipe( browserSync.reload({stream:true}) );
});

gulp.task('html', function() {
  gulp.src(config.paths.html)
    .pipe(gulp.dest(dir))
    .pipe( browserSync.reload({stream:true}) );
});

gulp.task('json', function() {
  gulp.src(config.paths.json)
    .pipe(gulp.dest(dir+'/json'))
    .pipe( browserSync.reload({stream:true}) );
});

gulp.task('images', function() {
  gulp.src(config.paths.images)
    .pipe(gulp.dest(dir+'/images'))
    .pipe( browserSync.reload({stream:true}) );
});

gulp.task('fonts', function() {
  gulp.src(config.paths.images)
    .pipe(gulp.dest(dir+'/fonts'))
    .pipe( browserSync.reload({stream:true}) );
});

gulp.task('serve', function() {

  browserSync.init({
    server: {
      baseDir: dir
    },
    ghostMode: {
      scroll: true
    },
    notify: false
  });

  gulp.watch(config.paths.styl, ['style']);
  gulp.watch(config.paths.js, ['js', 'lint']);
  gulp.watch(config.paths.jsLibs, ['jsLibs']);
  gulp.watch(config.paths.json, ['json']);
  gulp.watch(config.paths.fonts, ['fonts']);
  gulp.watch(config.paths.html, ['html']).on('change', browserSync.reload);

});

gulp.task('clean', function(path) {
  return gulp.src( dir ).pipe( clean() );
});

if(production) {
  console.log("need to setup the production version");
} else {
  gulp.task('default', ['json','style','js','jsLibs','html','serve']);
}

