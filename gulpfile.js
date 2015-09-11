var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    uglify= require('gulp-uglify'),
    zip   = require('gulp-zip');

gulp.task('prepare_dist', function() {

    gulp.src('game.json')
        .pipe(gulp.dest('dist/'));

    return gulp.src('game/**/*')
        .pipe(gulp.dest('dist/game'));
});

gulp.task('uglify_all', ['prepare_dist'], function() {

    return gulp.src('dist/game/src/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/game/src'));
});

gulp.task('zip_it', ['uglify_all'], function() {
    return gulp.src(['dist/**/*',],{base: "."})
        .pipe(zip('glitche.zip'))
        .pipe(gulp.dest('.'));
});

gulp.task('default', ['zip_it']);