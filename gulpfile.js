const gulp = require('gulp');
const { $ } = require('./gulp/common');

// Set Node Env
process.env.NODE_ENV = $.isProd ? 'production' : 'development';

// Register Tasks
gulp.task('build-html', require('./gulp/html-pug/task'));
gulp.task('build-css', require('./gulp/css/task'));
// gulp.task('build-img', require('./gulp/img-sprite/task'));

gulp.task('build-ts:lint', require('./gulp/ts-lint/task'));
gulp.task('build-ts:compile', require('./gulp/ts-compile/task'));
// gulp.task('build-ts:test', gulp.series('build-ts:template', 'build-ts:karma'), done => { done(); });
// gulp.task('build-ts', gulp.series('build-ts:lint', 'build-ts:test', 'build-ts:compile'), done => { done(); });

gulp.task('serve', require('./gulp/util-browsersync/task'));
// gulp.task('clean', require('./gulp/util-clean/task'));
// gulp.task('ver-check', require('./gulp/util-ver-check/task'));
// gulp.task('ver-bump', require('./gulp/util-ver-bump/task'));
// gulp.task('zip', require('./gulp/util-zip/task'));

// gulp.task('wait', require('./gulp/util-wait/task'));
// gulp.task('copy', require('./gulp/util-copy/task'));
// gulp.task('build-copy', gulp.series('copy', 'wait'), done => { done(); });

// gulp.task('build', gulp.series(
//     'clean',
//     'build-html',
//     'build-css',
//     'build-img',
//     'build-ts',
//     'build-copy',
//     'ver-check',
//     'zip'
// ), (done) => {
//     done();
// });


const { run } = require("jest-cli");
gulp.task('test', (done) => {
    run().then(() => {
        done();
    });
});