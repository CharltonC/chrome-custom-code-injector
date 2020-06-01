const { gulp, $path, $, util } = require('../common');
const { defOption, watchFiles, gulpTask } = require('./config');

module.exports = () => {
    const args = Object.getOwnPropertyNames($.yargs);

    // Prod
    if ($.isProd) return;

    // Watch Specific only (e.g. Cmd `gulp serve --css`)
    const isWatchOnly = args.some(arg => {
        const isMatch = arg === 'css' || arg === 'ts' || arg === 'ts';
        if (isMatch) gulp.watch( watchFiles[arg], gulp.series(gulpTask[arg]) );
        return isMatch;
    });
    if (isWatchOnly) return;

    // Watch + Live Server
    // - Watch files to rebuild
    gulp.watch( watchFiles.html, gulp.series(gulpTask.html) );
    gulp.watch( watchFiles.css, gulp.series(gulpTask.css) );
    gulp.watch( watchFiles.ts, gulp.series(gulpTask.ts) );

    // - Start the local server & watch otuput/build folder
    $.browserSync.init(defOption);
    gulp.watch( watchFiles.dist ).on('change', $.browserSync.reload);
};