/**
 * Created by andre on 8/07/17.
 */
let
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify')
;

gulp.task('js', function(){
    gulp.src('menu.json.js')
        .pipe(concat('menu.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./'));
});

gulp.task('default',['js'],function(){
});