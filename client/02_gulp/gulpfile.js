var gulp = require('gulp'),
	include = require('gulp-file-include'),
	replace = require('gulp-replace'),
	uglify = require('gulp-uglify');

var VERSION = '0.0.1',
	MAX_URL_LENGTH = 4096;



gulp.task("newegg-ec", function () {
    gulp.src('../01_lib/neg-trace.js')
		.pipe(include({
		    prefix: '@@',
		    basepath: '../01_lib/'
		}))
		.pipe(replace("${VERSION}", VERSION))
		.pipe(replace("${MAX_URL_LENGTH}", MAX_URL_LENGTH))
		.pipe(replace("${REQURL}", '//10.16.50.56:8080/_.gif'))
		.pipe(gulp.dest('../03_newegg-ec/source/'))

    gulp.src('../01_lib/neg-trace.js')
        .pipe(include({
            prefix: '@@',
            basepath: '../01_lib/'
        }))
        .pipe(replace("${VERSION}", VERSION))
        .pipe(replace("${MAX_URL_LENGTH}", MAX_URL_LENGTH))
        .pipe(replace("${REQURL}", '//pf2.newegg.com/_.gif'))
		.pipe(uglify())
		.pipe(gulp.dest('../03_newegg-ec/src/'));
});


gulp.task('default', ['newegg-ec']);