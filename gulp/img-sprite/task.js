const { gulp, $path, $, util } = require('../common');
const { tasks, defOption } = require('./config');

module.exports = (done) => {
    return util.loopTasks(done, tasks, (task) => {
        const spriteData = gulp.src(task.inputImgFiles)
            .pipe( $.plumber() )
            .pipe( $.spritesmith(defOption) )
            .on('error', onWatchError);

        spriteData.css
        .pipe( gulp.dest(task.outputScssPath) )
        .on('error', onWatchError);

        spriteData.img
        .pipe( gulp.dest(task.outputImgPath) )
        .on('error', util.onWatchError);

        return spriteData;
    });
};