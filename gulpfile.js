//
// PLUGINS
//
var gulp         = require('gulp')
  , gutil        = require('gulp-util')
  , autoprefixer = require('gulp-autoprefixer')
  , minifycss    = require('gulp-minify-css')
  , jshint       = require('gulp-jshint')
  , uglify       = require('gulp-uglify')
  , imagemin     = require('gulp-imagemin')
  , rename       = require('gulp-rename')
  , clean        = require('gulp-clean')
  , concat       = require('gulp-concat')
  , notify       = require('gulp-notify')
  , cache        = require('gulp-cache')
  , livereload   = require('gulp-livereload')
  , jade         = require('gulp-jade')
  , stylus       = require('gulp-stylus')
  , coffee       = require('gulp-coffee')
  ;
//
// HTML
//
function sname(x,y) {return (x+"' x "+y+"' Step &amp; Repeat Banner")}
var APP = {
};
gulp.task('html', function(){
  return gulp.src('src/**/*.jade')
  .pipe(jade({locals: APP}))
  .pipe(gulp.dest('dist/views'));
});
//
// STYLESHEETS
//
gulp.task('styles', function() {
  return gulp.src('src/styles/**/*.stylus')
    .pipe(stylus({use: ['nib']}))
    .pipe(concat('main.css'))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});
//
// SCRIPTS
//
gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});
gulp.task('coffee', function() {
  gulp.src('src/**/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({ message: 'Coffeescript task complete' }));
});
//
// IMAGES
//
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/assets/img'))
    .pipe(notify({ message: 'Images task complete' }));
});
//
// CLEANUP
//
gulp.task('clean', function() {
  return gulp.src(['dist/assets/css/*', 'dist/assets/js/*', 'dist/assets/img/*'], {read: false})
    .pipe(clean());
});
//
// WATCH
//
gulp.task('watch', function() {
  var server = livereload();
  gulp.watch('src/**').on('change', function(file) {
      server.changed(file.path);
  });
  gulp.watch('src/**/*.jade', ['html']);
  gulp.watch('src/styles/**/*.stylus', ['styles']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/scripts/**/*.coffee', ['coffee']);
  gulp.watch('src/images/**/*', ['images']);
});
//
// DEFAULT
//
gulp.task('default', ['clean'], function() {
    gulp.start('html','styles', 'scripts', 'coffee', 'images');
});