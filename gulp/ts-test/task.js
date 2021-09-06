const { gulp, $path, $, util } = require('../common');
const { defOption } = require('./config');

module.exports = (done) => {
    $.jestRun(defOption).then(() => {
        done();
    });
};