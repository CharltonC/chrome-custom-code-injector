const { gulp, $path, $, util } = require('../common');
const { tasks, defOption } = require('./config');

module.exports = (done) => {
    const isProd = $.yargs.prod;

    return util.loopTasks(done, tasks, (task) => {
        const brsfInst = $.browserify({
                basedir: defOption.basePath,
                entries: task.inputFiles,
                debug: !isProd,          // true: generate sourcemap
                cache: {},
                packageCache: {}
            })
            // .plugin( $.esmify )          // allow use of es6 module in node_modules for library files
            .plugin( $.tsify );          // ts to js file

        // Do NOT use it for development as it causes error with sourcemap
        // - details: when `{global: true}` is passed for "uglifyify" during `.transform()`  (i.e. removing dead code, not compress/mangle)
        if (isProd) {
            brsfInst.plugin($.tinyify, defOption.tinyify);
        }

        return brsfInst
            // .transform($.babelify, defOption.babel)            // Transform to Next Gen JS, i.e. new feats (incl. jsx to js)
            .transform($.babelify, {
                "plugins": [
                    // used only for Ant Design UI Components + "babel-plugin-import"
                    ["import", {"libraryName": "antd"}]
                ],
                "presets": [
                    // ["@babel/preset-env"],
                    // ["@babel/preset-react"],
                    ['react-app', {'typescript': true}]
                ]
            })
            .bundle()
            .pipe( $.plumber() )
            .pipe( $.vinylStream(task.outputFile) )
            .pipe( $.vinylBuffer() )
            .pipe( gulp.dest(task.outputPath) )
            .on('error', util.onWatchError);
    });
};