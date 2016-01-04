/**
 * Created by Sal on 12/31/2015.
 */
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var fs = require('fs');

gulp.task('test', function(){
    return gulp.src('passcheck.test.js')
        .pipe(mocha({ reporter: 'list' }))
        .on('error', gutil.log);
});

gulp.task('concat-ng', function(){
    return gulp.src(['C:/Development/GitHub/ngPasscheck/ngPasscheck/ng-passcheck/src/ng.js', 'passcheck.js'])
        .pipe(concat('ng-passcheck.js', {newLine: '\r\n'}))
        .pipe(gulp.dest('C:/Development/GitHub/ngPasscheck/ngPasscheck/ng-passcheck/src'));
});

gulp.task('passwords', function() {
    function isNotEmpty(line) {
        return Boolean(line.length);
    }

    function parseLine(line) {
        return line.trim();
    }

    var lines = fs.readFileSync('passwords.txt').toString().split('\n');
    var result = lines.filter(isNotEmpty).map(parseLine);
    var json = JSON.stringify({ 'dictionary': result });
    fs.writeFileSync('passwords.json', json);
});