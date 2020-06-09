const { gulp, $path, $, util } = require('../common');
const { defOption, watchFiles, gulpTask } = require('./config');

module.exports = () => {
    const { files } = $.yargs;

    // Watch files to rebuild
    // - For TS: Tasks involves lint + test only since browserify already incl. files watching
    if (!files || files === 'html') gulp.watch( watchFiles.html, gulp.series(gulpTask.html) );
    if (!files || files === 'css') gulp.watch( watchFiles.css, gulp.series(gulpTask.css) );
    if (!files || files === 'ts') gulp.watch( watchFiles.ts, gulp.series(gulpTask.ts) );

    // Start the local server & watch otuput/build folder
    if (!$.yargs.startIdxPage) return;
    $.browserSync.init(defOption);
    gulp.watch( watchFiles.dist ).on('change', $.browserSync.reload);
};
