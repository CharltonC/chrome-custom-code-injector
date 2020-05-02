const { gulp, $path, $, util } = require('../common');
const { tasks, defOption } = require('./config-sass');
const autoPrefixerDefOption = require('./config-autoprefixer').defOption;

module.exports = (done) => {
    const isProd = $.yargs.prod;

    return util.loopTasks(done, tasks, (task) => {
        return gulp.src(task.inputFiles)
            .pipe( $.plumber() )
            .pipe( $.if(!isProd, $.sourcemaps.init()) )
            .pipe( $.sass(Object.assign({
                outputStyle: isProd ? 'compressed' : 'nested',
            }, defOption)) )
            .pipe( $.autoprefixer(autoPrefixerDefOption) )
            .pipe( $.if(!isProd, $.sourcemaps.write()) )  // Use Inline Sourcemap at LocalBuild
            .pipe( $.rename(task.rename ? task.rename : {extname: '.min.css'}) )
            .pipe( gulp.dest(task.outputPath) )
            .on('error', util.onWatchError);
    });
};