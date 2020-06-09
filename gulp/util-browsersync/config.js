const { $ } = require('../common');

const { startIdxPage } = $.yargs;
const indexPage = startIdxPage ? startIdxPage : '';

module.exports = {
    defOption: {
        server: {
            baseDir: `dist/build/${indexPage}`,
        },
        // startPath:
        reloadDelay: 1000,
        open: false
     },
     watchFiles: {
        dist: [
            'dist/build/**/*.*'
        ],
        html: [
            'src/**/*.pug'
        ],
        ts: [
            'src/**/*.(tsx|spec.tsx)'
        ],
        css: [
            'src/**/*.scss'
        ],
     },
     gulpTask: {
         html: 'build-html',
         css: 'build-css',
         ts: ['build-ts:lint', 'build-ts:test']
     }
};