module.exports = {
    defOption: {
        server: { baseDir: 'dist/build/' },
     //    startPath: '/#/',
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
         ts: 'build-ts'
     }
};