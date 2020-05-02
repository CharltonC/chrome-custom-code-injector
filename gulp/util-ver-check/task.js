const { gulp, $path, $, util } = require('../common');
const { inputFiles } = require('./config');

module.exports = (done) => {
    // Exit (No check) if there is only 1 file with version
    if (!$.yargs.prod) {
        util.logColor('"version-checkeq" task not run for dev mode', 'magenta');
        return done();
    }

    // Check
    const has2FilesOrMore = inputFiles.length >= 2;
    let isConsistent = has2FilesOrMore ? false : true;
    if (has2FilesOrMore) {
        const versions = inputFiles.map((rawPath) => {
            const path = $path.resolve(rawPath);
            const file = require(path);
            return file.version;
        });
        const lastIdx = versions.length - 1;
        isConsistent = versions.every((version, idx) => {
            return (idx === lastIdx) ? true : (version === versions[idx + 1]);
        });
    }

    // Log
    if (isConsistent) return done();
    util.logColor('versions not matched', 'red');
    throw new Error();
};