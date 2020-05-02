const { gulp, $path, $, util } = require('../common');
const { tasks, defOption } = require('./config');

module.exports = (done) => {
    // Skip if not production mode
    if (!$.yargs.prod) {
        util.logColor('"zip" task not run for dev mode', 'magenta');
        return done();
    }

    return util.loopTasks(done, tasks, (task) => {
        const { version } = require( $path.resolve(task.versionFile) );
        return gulp.src( task.inputFiles )
            .pipe( $.plumber() )
            .pipe( $.print() )
            .pipe( $.zip(`${task.outputFileName}_v${version}.zip`) )
            .pipe( gulp.dest(task.outputPath) )
            .on('error', util.onWatchError);
    });
};