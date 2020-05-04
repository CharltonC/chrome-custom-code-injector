const { $ } = require('../common');
const isProd = $.yargs.prod;

module.exports = {
    defOption: {
        basePath: './src',
        babel: {
            presets: ['react-app', {'typescript': true}]
        },
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
        // Background Script
        common: {
            inputFiles: [
                'page/bg-script/main.tsx'
            ],
            outputFile: isProd ? 'main.min.js' : 'main.js',
            outputPath: 'dist/',
        }
    }
};