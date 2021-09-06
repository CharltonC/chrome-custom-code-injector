const { gulp, $path, $, util } = require('../common');
const { defOption } = require('./config');
const { collectCov } = require('yargs').argv;

module.exports = (done) => {
    if (collectCov) {
        Object.assign(defOption, {
            coverageDirectory: './coverage/',
            coverageReporters: [ 'lcov' ],
        });
    }
    $.jestRun(defOption).then(() => {
        done();
    });
};