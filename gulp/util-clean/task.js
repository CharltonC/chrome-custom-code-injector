const { gulp, $path, $, util } = require('../common');
const { tasks, defOption } = require('./config');

module.exports = (done) => {
    return util.loopTasks(done, tasks, (task) => {
        return gulp.src( task.inputFiles, {read: false, allowEmpty: true} )
            .pipe( $.plumber() )
            .pipe( $.print() )
            .pipe( $.clean() )
            .on('error', util.onWatchError);
    });
};