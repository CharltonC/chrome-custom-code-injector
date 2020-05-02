const { gulp, $path, $, util } = require('../common');
const { tasks, defOption } = require('./config');

module.exports = (done) => {
    return util.loopTasks(done, tasks, (task) => {
        const fileName = task.rename;

        return gulp.src( task.inputFiles )
            .pipe( $.plumber() )
            .pipe( $.if(!!fileName, $.rename(fileName)) )
            .pipe( gulp.dest(task.outputPath) )
            .on('error', util.onWatchError);
    });
};
