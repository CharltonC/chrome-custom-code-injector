const gulp = require('gulp');
const { $ } = require('./gulp/common');

gulp.task('build-html', require('./gulp/html-pug/task'));
gulp.task('build-css', require('./gulp/css/task'));
// gulp.task('build-img', require('./gulp/img-sprite/task'));
gulp.task('build-ts:lint', require('./gulp/ts-lint/task'));
gulp.task('build-ts:compile', require('./gulp/ts-compile/task'));
gulp.task('build-ts:test', require('./gulp/ts-test/task'));
gulp.task('build-ts', gulp.series('build-ts:lint', 'build-ts:test', 'build-ts:compile'), done => done());
gulp.task('clean', require('./gulp/util-clean/task'));
gulp.task('ver-check', require('./gulp/util-ver-check/task'));
gulp.task('ver-bump', require('./gulp/util-ver-bump/task'));
gulp.task('zip', require('./gulp/util-zip/task'));
gulp.task('wait', require('./gulp/util-wait/task'));
gulp.task('copy', require('./gulp/util-copy/task'));
gulp.task('build-copy', gulp.series('copy', 'wait'), done => { done(); });

/**
 * Watch files + Optionally Start a local server (if `startIdxPage` is specified)
 *
 * CMD: `gulp browsersync [--startIdxPage=<indexPageName>]?`
 * @param: indexPageName - starting index page at the output folder, e.g. option | poup
 * @param: startIdxPage - starts a local server
 */
gulp.task('watch', require('./gulp/util-browsersync/task'));

/**
 * Build + Watch TS files (dev mode or prod+watchify mode)
 *
 * CMD: `gulp build [--prod --watchify?]?`
 * @param: prod - production mode (incl. optimization)
 * @param: watchify - include file watch + build caching for production mode
 */
gulp.task(
    'build',
    gulp.series('clean', 'build-html', 'build-css', 'build-ts', 'build-copy', 'ver-check', 'zip'),
    done => done()
);

/**
 * Build + Watch files + Optionally Start a local server (if `startIdxPage` is specified)
 *
 * CMD: `gulp serve [--prod --watchify?]? [--startIdxPage=<indexPageName>]?`
 * @param: prod - as abv
 * @param: watchify - as abv
 * @param: startIdxPage - as abv
 */
gulp.task(
    'serve',
    gulp.series('build', 'watch'),
    done => done()
);
