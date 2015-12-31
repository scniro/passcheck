/**
 * Created by Sal on 12/31/2015.
 */
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

gulp.task('test', function(){
    return gulp.src('passcheck.test.js')
        .pipe(mocha({ reporter: 'list' }))
        .on('error', gutil.log);
});