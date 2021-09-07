const { gulp, $path, $, util } = require('../common');
const { tasks, defOption } = require('./config');

module.exports = (done) => {
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