const { gulp, $path, $, util } = require('../common');
const { tasks, defOption } = require('./config');

module.exports = (done) => {
    const isProd = $.yargs.prod;

    return util.loopTasks(done, tasks, (task) => {
        return $.browserify({
                basedir: defOption.basePath,
                entries: task.inputFiles,
                debug: !isProd,                 // true: generate sourcemap
                cache: {},
                packageCache: {}
            })
            .plugin( $.tsify )
            .plugin( $.tinyify, {                // already incl. uglify & sourcemap
                env: { NODE_ENV: isProd ? 'production' : 'development' }
                // debug: !isProd,              // NOT required because it is same as the browserify option `debug` property
            })
            .plugin( $.esmify )
            .transform( $.babelify, {
                presets: defOption.babelPresets
            })
            .bundle()
            .pipe( $.plumber() )
            .pipe( $.vinylStream(task.outputFile) )
            .pipe( $.vinylBuffer() )
            .pipe( gulp.dest(task.outputPath) )
            .on('error', util.onWatchError);
    });
};