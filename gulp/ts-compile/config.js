const { $ } = require('../common');
const babelConfig = require('../../babel.config');

module.exports = {
    defOption: {
        basePath: './src',
        // babel settings for compiling only, not used for unit testing via Jest
        babel: babelConfig,
        tinyify: {
            env: { NODE_ENV: 'production' }
        }
    },

    // NOTE: as this is supposed to be entry file, wildcard `**` or `*` is not allowed
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
            outputFile: 'main.min.js',
            outputPath: 'dist/build/bg-script',
        },
        contentScript: {
            inputFiles: [
                'page/ct-script/main.ts'
            ],
            outputFile: 'main.min.js',
            outputPath: 'dist/build/ct-script',
        },
        popup: {
            inputFiles: [
                'page/popup/main.tsx'
            ],
            outputFile: 'main.min.js',
            outputPath: 'dist/build/popup',
        },
        option: {
            inputFiles: [
                'page/option/main.tsx'
            ],
            outputFile: 'main.min.js',
            outputPath: 'dist/build/option',
        },
        uiCmpIdx: {
            inputFiles: 'page/ui-cmp-doc/main.tsx',
            outputFile: 'main.min.js',
            outputPath: 'doc/ui-component/'
        }
    }
};