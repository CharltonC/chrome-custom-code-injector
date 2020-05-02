const { gulp, $path, $, util } = require('../common');
const { defOption, watchFiles, gulpTask } = require('./config');

module.exports = () => {
    // const { server } = $.yargs;

    // Start the local server
    // if (server) {
        $.browserSync.init(defOption);
        // gulp.watch( watchFiles.dist ).on('change', $.browserSync.reload);
    // }

    // Watch files to rebuild
    // gulp.watch( watchFiles.html, gulp.series(gulpTask.html) );
    // gulp.watch( watchFiles.css, gulp.series(gulpTask.css) );
    // gulp.watch( watchFiles.ts, gulp.series(gulpTask.ts) );
};