const { gulp, $path, $, util } = require('../common');
const { inputFiles } = require('./config');

module.exports = (done) => {
    /**
     * The following are for Input in command line:
     * --type=pre                   // bump the prerelease version      *.*.*-x
     * --type=patch OR no flag      // bump the patch version           *.*.x
     * --type=minor                 // bump the minor version           *.x.*, e.g. 0.1.0 --> 0.2.0
     * --type=major                 // bump the major version           x.*.*
     * --version=1.2.3              // bump to a specific version & ignore other flags
     */
    let msg = 'Bumping version';
    const { version, type } = $.yargs;
    const options = {};

    // If user provide a specific version in the cmd
    if (version) {
        options.version = version;
        msg += ' to ' + version;

    // If specific version is not provided
    } else {
        options.type = type;
        msg += ' for a ' + type;
    }

    // Bumping up the version in json files
    return gulp
        .src(inputFiles)
        .pipe( $.bump(options) )
        .pipe( gulp.dest('./') )
        .on('error', onWatchError);
};