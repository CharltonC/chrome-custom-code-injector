const { gulp, $path, $, util } = require('../common');
const { tasks, defOption } = require('./config');

module.exports = (done) => {
    const isProd = $.yargs.prod;
    let time;

    return util.loopTasks(done, tasks, ({inputFiles, outputPath}) => {
        const getBundleSizeTxt = () => $.chalk.white('  Bundled output ') + $.chalk.blue(`${outputPath}/`);
        const getBundleEndTxt = () => `  Finished compiling for ${$.chalk.blue(inputFiles)} in ${time}, file watch restarts...`;
        const getBundleUpdateTxt = (filePath) => `Detected changes in files: ${$.chalk.cyan(filePath)}`

        const brsfInst = $.browserify({
            basedir: defOption.basePath,
            entries: inputFiles,
            debug: !isProd,          // true: generate sourcemap
            cache: {},
            packageCache: {}
        })
        .plugin( $.tsify );

        function bundle() {
            return brsfInst
                .transform($.babelify, defOption.babel)            // Transform to Next Gen JS, i.e. new feats (incl. jsx to js)
                .bundle()
                .pipe( $.plumber() )
                .pipe( $.vinylStream(outputFile) )
                .pipe( $.vinylBuffer() )
                .pipe( $.size({showFiles: true, title: getBundleSizeTxt()}) )
                .pipe( gulp.dest(outputPath) )
                .pipe( $.print(getBundleEndTxt) )
                .on('error', util.onWatchError);
        }

        // Do NOT use it for development as it causes error with sourcemap
        // - details: when `{global: true}` is passed for "uglifyify" during `.transform()`  (i.e. removing dead code, not compress/mangle)
        if (isProd) {
            brsfInst.plugin($.tinyify, defOption.tinyify);

        // - Watch the files & Speed up the build by caching files which didnt change
        } else {
            brsfInst
                .plugin( $.watchify )
                .on('update', (filePath) => {
                    console.log(getBundleUpdateTxt(filePath));
                    return bundle();
                })
                .on('time', (timeInMs) => {
                    time = $.chalk.magenta(`${timeInMs/100}s`);
                });
        }

        return bundle();
    });
};