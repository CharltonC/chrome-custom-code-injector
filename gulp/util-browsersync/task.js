const { gulp, $path, $, util } = require('../common');
const { defOption, watchFiles, gulpTask } = require('./config');

module.exports = () => {
    if (!$.isProd) {
        // Watch files to rebuild
        gulp.watch( watchFiles.html, gulp.series(gulpTask.html) );
        gulp.watch( watchFiles.css, gulp.series(gulpTask.css) );
        gulp.watch( watchFiles.ts, gulp.series(gulpTask.ts) );

        // Start the local server
        $.browserSync.init(defOption);
        gulp.watch( watchFiles.dist ).on('change', $.browserSync.reload);
    }
};