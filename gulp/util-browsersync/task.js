const { gulp, $path, $, util } = require('../common');
const { defOption, watchFiles, gulpTask } = require('./config');

module.exports = () => {
    // Watch files to rebuild
    // - For TS: Tasks involves lint + test only since browserify already incl. files watching
    gulp.watch( watchFiles.html, gulp.series(gulpTask.html) );
    gulp.watch( watchFiles.css, gulp.series(gulpTask.css) );
    gulp.watch( watchFiles.ts, gulp.series(gulpTask.ts) );

    // Start the local server & watch otuput/build folder
    if (!$.yargs.startIdxPage) return;
    $.browserSync.init(defOption);
    gulp.watch( watchFiles.dist ).on('change', $.browserSync.reload);
};
