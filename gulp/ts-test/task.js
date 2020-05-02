const { gulp, $path, $, util } = require('../common');
const { defOption } = require('./config');

module.exports = (done) => {
    const doWatch = $.yargs.watch;

    // Watch for file changes if provided with an flag
    Object.assign(defOption, {
        autoWatch: doWatch,
        singleRun: !doWatch
    });

    $.karma.start(defOption,  (karmaResult) => {
        done();
    });
};