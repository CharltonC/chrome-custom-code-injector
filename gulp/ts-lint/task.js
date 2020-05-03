const { gulp, $path, $, util } = require('../common');
const { tasks, defOption } = require('./config');

module.exports = (done) => {
    return util.loopTasks(done, tasks, (task) => {
        return gulp.src(task.inputFiles)
            .pipe( $.plumber() )
            .pipe( $.eslint() )             // alt: `$.eslint(configObj)` similar to "".eslintrc.json" file
            .pipe( $.eslint.format() )
            .pipe( $.eslint.failAfterError() )
            .on('error', util.onWatchError);
    });
};