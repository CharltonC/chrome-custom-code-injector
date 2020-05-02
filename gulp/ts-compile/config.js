module.exports = {
    defOption: {
        basePath: './src',
        babelPresets: [
            ['react-app', {'typescript': true}]
        ],
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
                'page/bg-script/app.tsx'
            ],
            outputFile: 'app.min.js',
            outputPath: 'dist/',
        }
    }
};