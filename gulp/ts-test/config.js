const { $ } = require('../common');

const reportSubPath = $.isProd ? 'test-report/' : 'temp-file/test-report/';

module.exports = {
    // `defOption`:
    // - corresp. to file: "node_modules/jest-cli/build/cli/index.js"
    // - for options avail.: "node_modules/jest-cli/build/cli/index.d.ts"
    // - ref: https://jestjs.io/docs/en/cli
    defOption: [
        '--coverage=true',
        `--coverageDirectory=./doc/${reportSubPath}`,
        '--detectOpenHandles'
    ]
};