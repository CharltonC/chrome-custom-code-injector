const { gulp, $path, $, util } = require('../common');
const { tasks, defOption } = require('./config');

module.exports = (done) => {
    return util.loopTasks(done, tasks, (task) => {
        return gulp.src(task.inputFiles)
            .pipe( $.plumber() )
            .pipe( $.tslint(defOption.lint) )
            .pipe( $.tslint.report(defOption.report) )
            .on('error', util.onWatchError);
    });
};