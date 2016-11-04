'use strict';

const path = require('path')
const fs = require('fs');

const gulp = require('gulp');
const webpack = require('gulp-webpack');
const concat = require('gulp-concat');
const less = require('gulp-less');
const cssnano = require('gulp-cssnano');

const WPconfigDev = require('./configs/webpack.dev.config.js');
const WPconfigProd = require('./configs/webpack.prod.config.js');

const addrs = {
    scripts: path.join(__dirname, 'src/scripts/index.jsx'),
    styles: path.join(__dirname, 'src/styles/all.less'),
    builds: path.join(__dirname, 'files/builds')
};

gulp.task('scripts-dev', function () {
    return gulp.src(addrs.scripts)
        .pipe(webpack(WPconfigDev))
        .pipe(gulp.dest(addrs.builds));
});

gulp.task('scripts-prod', function () {
    return gulp.src(addrs.scripts)
        .pipe(webpack(WPconfigProd))
        .pipe(gulp.dest(addrs.builds));
});

gulp.task('styles-dev', function () {
    return gulp.src(addrs.styles)
        .pipe(less())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(addrs.builds));
});

gulp.task('styles-prod', function () {
    return gulp.src(addrs.styles)
        .pipe(less())
        .pipe(concat('styles.min.css'))
        .pipe(cssnano())
        .pipe(gulp.dest(addrs.builds));
});

gulp.task('all-dev', ['scripts-dev', 'styles-dev']);

gulp.task('all-prod', ['scripts-prod', 'styles-prod']);
