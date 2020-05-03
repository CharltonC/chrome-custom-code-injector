const { gulp, $path, $, util } = require('../common');
const { tasks, defOption } = require('./config');

module.exports = (done) => {
    return util.loopTasks(done, tasks, (task) => {
        return gulp.src(task.inputFiles)
            .pipe( $.plumber() )
            .pipe( $.pug(defOption) )
            .pipe( gulp.dest(task.outputPath) )
            .on('error', util.onWatchError);
    });
};;