const gulp = require('gulp');
const $path = require('path');
const yargs = require('yargs').argv;

// container for gulp plugins
const $ = {
    // Util: General
    if:             require('gulp-if'),     // e.g. $>if(condition, fnToRun,
    yargs:          yargs,
    isProd:         yargs.prod,
    rename:         require('gulp-rename'),
    clean:          require('gulp-clean'),
    zip:            require('gulp-zip'),
    file:           require('gulp-file'),
    size:           require('gulp-size'),
    flatmap:        require('gulp-flatmap'),
    sourcemaps:     require('gulp-sourcemaps'),

    // Util: Log
    taskListing:    require('gulp-task-listing'),
    plumber:        require('gulp-plumber'),
    print:          require('gulp-print'),
    browserSync:    require('browser-sync').create(),
    bump:           require('gulp-bump'),

    // Html
    pug:            require('gulp-pug'),

    // Typescript, Babel, TreeShake/Optimize
    browserify:     require('browserify'),
    vinylBuffer:    require('vinyl-buffer'),
    vinylStream:    require('vinyl-source-stream'),
    tsify:          require('tsify'),
    tinyify:        require('tinyify'),
    babelify:       require('babelify'),
    eslint:         require('gulp-eslint'),
    uglify:         require('gulp-uglify'),

    // Unit Test
    jestRun:        require("jest").run,

    // SCSS/CSS
    sass:           require('gulp-sass'),
    autoprefixer:   require('gulp-autoprefixer'),

    // Image
    spritesmith:    require('gulp.spritesmith'),
};

const util = {
    loopTasks(done, tasks, cbFn) {
        const result = Object.getOwnPropertyNames(tasks)
            .reduce((container, taskName) => {
                const task = tasks[taskName];
                return cbFn(task);
            }, null);

        if (result) {
            return result;

        } else {
            done();
        }
    },

    onWatchError(err) {
        console.log(err.message);

        // Required - this allos the watch to continue after you fix the file
        this.emit('end');
    },

    logColor(msg, color) {
        let colorCode = color || '\x1b[32m';

        switch (color) {
            case 'red':
                colorCode = '\x1b[31m';
                break;

            case 'cyan':
                colorCode = '\x1b[36m';
                break;

            case 'magenta':
                colorCode = '\x1b[35m';
                break;

            case 'green':
            default:
                break;
        }
        console.log(`${colorCode}%s\x1b[0m`, msg);
    }
}

module.exports = { gulp, $path, $, util };