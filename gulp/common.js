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
    chalk:          require('chalk'),

    // Util: Log
    taskListing:    require('gulp-task-listing'),
    plumber:        require('gulp-plumber'),
    print:          require('gulp-print'),
    browserSync:    require('browser-sync').create(),
    bump:           require('gulp-bump'),

    // Html
    pug:            require('gulp-pug'),

    // Typescript, Babel, TreeShake/Optimize
    vinylBuffer:    require('vinyl-buffer'),
    vinylStream:    require('vinyl-source-stream'),
    eslint:         require('gulp-eslint'),
    uglify:         require('gulp-uglify'),
    browserify:     require('browserify'),
    watchify:       require('watchify'),
    tsify:          require('tsify'),
    babelify:       require('babelify'),
    unassertify:    require('unassertify'),
    envify:         require('envify/custom'),
    uglifyify:      require('uglifyify'),
    shakeify:       require('common-shakeify'),
    packFlat:       require('browser-pack-flat/plugin'),
    minifyStream:   require('minify-stream'),

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
    }
}

module.exports = { gulp, $path, $, util };