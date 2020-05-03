module.exports = {
    defOption: {
        server: { baseDir: 'dist/' },
     //    startPath: '/#/',
        reloadDelay: 1000,
        open: false
     },
     watchFiles: {
        dist: [
            'dist/pro/**/*.*'
        ],
        html: [
            'src/page/popup/*.pug'
        ],
        ts: [
            'src/**/*.(ts|pug)',
            '!src/**/*.view.ts',
            '!src/index.pug',
        ],
        css: [
            'src/**/*.scss'
        ],
     },
     gulpTask: {
         html: 'build-html',
         css: 'build-css',
         ts: 'build-ts'
     }
};