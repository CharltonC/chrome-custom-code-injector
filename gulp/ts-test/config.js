module.exports = {
    // UNIT TESTING
    // - Karma uses "minmatch" for file pattern handling, thus diff. from Gulp built-in one
    //
    // - for `preprocessor`, it must has EXACTLY ONE exclude (i.e. folder & file in one go)
    //      // works
    //      '**/!(outer-sandbox)/!(*.spec|*.view|*.interface|*.constant|throttle|debounce).ts': [ 'coverage' ],
    //
    //      // won't work
    //      '**/!(outer-sandbox)/*.ts': [ 'coverage' ],
    //      '**/!(*.spec|*.view|*.interface|*.constant|throttle|debounce).ts': [ 'coverage' ],
    //
    // - examples:
    //      - excluding directory: '**/!(folderName)/*.ext'
    //      - excluding file: '**/!(*.ext1|*.extN).ext'

    // defOption: {
    //     configFile: __dirname + "/karma.conf.gulp.js",
    //     singleRun: true
    // },
    defOption: {
        /* 1. FILES TO BE LOADED/EXCLUDED IN THE BROWSER (SHOULD BE IN ORDER) */
        basePath: 'src',                 // relative to Karma config file
        files: [
            // IMPORTANT: Karma uses diff. file pattern ("minimatch") from Gulp Build-in file pattern, therefore the wildcard pattern works differently. THe same applies for the `preprocessor` file pattern below.
            // * REF: http://www.globtester.com/
            // * e.g. wild card: "**/*.ts"
            //  - already includes "*.ts" and "**/**/*.ts" (2 LEVELS ONLY)
            //  - HOWEVER "**/**/**/*.ts" does NOT work as expected (i.e. NO 3 LEVELS)
            //  - 'ts/**/*.ts' does NOT work for 'ts/component/**/*.ts'

            // 1. The vendors Library are not required as it will be concatenated by TS
            // - e.g. jquery, angular
            // - for angular-mocks, install & import are needed, e.g. import 'angular-mocks';

            // 2. App related Ts/Js files & its test file, e.g. main.ts
            // Independent
            'common/ts/vendor/*.ts',
            'common/ts/outer-sandbox/*.ts',

            // App
            'component/**/*.ts',
            'service/**/*.ts',   // already includes 'service/**/**/*.ts' & so on
            'app.module.ts',

            // App Admin (app crud)
            'common/ts/app-admin/*.ts',

            // 3. App related spec/test files, e.g. main.spec.ts
            // 'ts/*.spec.ts',
            // 'ui/**/**/*.spec.ts'
            // '!*.spec.ts'
        ],
        exclude: [],
        autoWatch: false,    // `autoWatch: true` is for monitor file changes specified in `files` property (when `singlRun: false`)

        /* 2. LOG */
        colors: true,
        // logLevel: ,       // 'info' (d) | 'debug'

        /* 3. PLUGINS & PREPROCESSOR */
        // List of Plugins to be loaded for testing, generating reports, launching browser, preprocessing files etc
        plugins: [
            'karma-typescript',
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-spec-reporter',
            'karma-coverage'
        ],

        // List of Files to be preprocessed by Preprocessors Plugin
        // - Globals that already defined don't need to be specified here, e.g. angular, jquery
        //   anything else such as vendor that uses `export` will need to be defined here
        // - not configured here, refer to "config.preprocessors" at the bottom of the code
        // - e.g.
        //     // show coverage stats in PhantomJS Console/CMD
        //     'build/js/*.js': ['coverage'],
        //
        //     // process the html files with 'karma-ng-html2js-preprocessor' plugin
        //     'build/view/*.html': ['ng-html2js']
        preprocessors: {
            // Exclude files from coverage (plugin not run here)
            '**/!(outer-sandbox)/!(*.spec|*.view|*.interface|*.constant|throttle|debounce).ts': [ 'coverage' ],

            // Run the plugin ("karma-coverage" automatically runs by default for these files except excluded ones above)
            '**/*.ts': [ 'karma-typescript' ],
        },

        /* 4. PLUGIN CONFIG (INCL. PREPROCESSOR) */
        // Plugin Config - Browser
        browsers: ['Chrome'],           // Browser to be launched to run the test (requires "karma-<browsername>-launcher" plugin)
        port: 8090,
        singleRun: true,

        // Plugin Config - Testing Framework
        frameworks: [
            'karma-typescript',         // corresponds to 'karma-typescript'`
            'jasmine',                  // installed below as npm package 'karma-jasmine' therefore no required to include js
        ],

        // Plugin Config - Report Coverage
        reporters: [
            'spec',                 // corresponds to 'karma-spect-reporter' (show tests passed/failed)
            'coverage'              // corresponds to 'karma-coverage' (coverage % stats)
        ],
        specReporter: {
            maxLogLines: 5,         // limit number of lines logged per test
            suppressErrorSummary: true,  // do not print error summary
            suppressFailed: false,       // do not print information about failed tests
            suppressPassed: false,       // do not print information about passed tests
            suppressSkipped: true,       // do not print information about skipped tests
            showSpecTiming: false,       // print the time elapsed for each spec
            outputTestReportFile: 'doc/github/ref/test-report.md'
        },
        coverageReporter: {
            reporters: [
                // for Command line log
                {  type: 'text-summary' },

                // for inspecting report in html format
                {  type: 'html', dir: '../doc/test-report' },
            ]
        }
    }
};