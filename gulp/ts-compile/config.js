const { $ } = require('../common');
const babelConfig = require('../../babel.config');

module.exports = {
    //// Browserify & Plugins Config
    defOption: {
        // General
        basePath: './src',
        outputPath: './',

        // Babel settings for compiling only, not used for unit testing via Jest
        babel: babelConfig,

        // Prod Build Optimization
        minifyStream: { sourceMap: false },
        envify: {NODE_ENV: 'production'},
        brwsrfyTrnsfm: { global: true },

        // Dev Build Optimization
        watchify: {
            // './path' does not work, use '**' instead
            ignoreWatch: [
                '**/node_modules/**',
                '**/schematic/**',
                '**/dist/**',
                '**/doc/**',
                '**/gulp/**',
                '**/package.json'
            ]
        }
    },

    //// NOTE: as this is supposed to be entry file, wildcard `**` or `*` is not allowed
    /* Exclude Test files, e.g. '!ts/service/elem-selector/*.spec.ts' */
    /* jQuery: required if you import it - does not make diff. if you do `import * as $ from 'jquery';` */
    /* AngularJs:
        if using AngularJs, it must be the non-minified version, usage:
        import { module, element ... } from 'angular';
        or
        import * as angular from 'angular';
        (Not work: import angular from 'angular';)
    */
    /* Library (not required to be specified)
    '../node_modules/jquery/dist/pro/jquery.js',
    '../node_modules/angular/angular.js',
    */
    tasks: {
        bgScript: {
            inputFiles: [
                'page/bg-script/main.ts'
            ],
            outputFile: 'dist/build/bg-script/main.min.js',
        },
        contentScript: {
            inputFiles: [
                'page/ct-script/main.ts'
            ],
            outputFile: 'dist/build/ct-script/main.min.js',
        },
        popup: {
            inputFiles: [
                'page/popup/main.tsx'
            ],
            outputFile: 'dist/build/popup/main.min.js',
        },
        option: {
            inputFiles: [
                'page/option/main.tsx'
            ],
            outputFile: 'dist/build/option/main.min.js',
        }
    }
};