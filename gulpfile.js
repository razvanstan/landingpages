var gulp = require('gulp');
var jade = require('gulp-jade');
var compass = require('gulp-compass');
var path = require('path');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var copy = require('gulp-copy');
var rename = require("gulp-rename");
var rev = require('gulp-rev');
var uglify = require('gulp-uglify');
var revReplace = require('gulp-rev-replace');
var useref = require('gulp-useref');
var minifyCss = require('gulp-minify-css');
var gulpif = require('gulp-if');
var flatten = require('gulp-flatten');
var gulpsync = require('gulp-sync')(gulp);

gulp.task('clean-dist', function() {
    return gulp.src('./dist/*', {read: false})
        .pipe(clean());
});

gulp.task("revision", function(){
  return gulp.src(['./style.css', './scripts/*js'])
    .pipe(rev())
    .pipe(gulp.dest('./dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist'));
});

gulp.task("revreplace", ["revision"], function(){
  var manifest = gulp.src("./dist/rev-manifest.json");

  return gulp.src("./*.html")
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('dist-pages', ["revreplace"], function() {

    //prepare assets for partener compatibil
    gulp.src("./dist/index.html")
        .pipe(rename("landingpage/index.html"))
        .pipe(gulp.dest("./dist"));


    gulp.src('./dist/*.css')
        .pipe(copy('./dist/landingpage/', {prefix: 1}));

    gulp.src('./dist/*.js')
        .pipe(copy('./dist/landingpage/', {prefix: 1}));

    gulp.src('./images/**/*')
        .pipe(copy('./dist/landingpage/'));

});

gulp.task("jade", function() {
    gulp.src(['./templates/*.jade', './templates/**/*.jade'])
        .pipe(jade())
        .pipe(gulp.dest('./'));
});

/*
 * Compass task
 * */

gulp.task('compass', function() {
    gulp.src('styles/style.scss')
        .pipe(compass({
            css: '',
            sass: 'styles/'
        }))
        .pipe(gulp.dest(''));
});

// Rerun the task when a file changes
gulp.task('watch', function() {

    gulp.watch([
        './templates/*.jade'
    ], ['jade']);

    gulp.watch([
        './styles/*.scss'
    ], ['compass']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['jade', 'compass']);

gulp.task('dist', gulpsync.sync(['clean-dist', 'dist-pages']));
