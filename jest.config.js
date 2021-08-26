const { $ } = require('./gulp/common');
const reportSubPath = $.isProd ? 'test-report/' : 'temp-file/test-report/';

const { defaults } = require('jest-config');  // def. jest config object

// JEST Option (not cli option)
// - Ref: https://jestjs.io/docs/en/configuration#testmatch-arraystring
module.exports = {
    verbose: true,

    // # Mock & Global variable
    clearMocks: true,
    globals: {
        // e.g. 'someGlobalVar': true
    },

    // # Coverage & Report
    collectCoverage: true,
    coverageDirectory: `./doc/${reportSubPath}`,

    // # File to test (either use `testMatch` or `tesstRegex`)
    testMatch: [
        // '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)'
    ],

    // # Folder/File to ignored
    testPathIgnorePatterns: [
        ...defaults.testPathIgnorePatterns,
        './schematic/',

    ],
    coveragePathIgnorePatterns: [
        ...defaults.coveragePathIgnorePatterns,
        './src/asset/ts/test-util/',
        './src/asset/ts/',
        './model/rule/default.ts'
    ]
};