module.exports = {
    defOption: {
        includePaths: ['node_modules'],
    },
    tasks: {
        sharedCss: {
            inputFiles: 'src/asset/scss/base.scss',              // NOTE: wildcard "*" is not allowed
            rename: 'main.min.css',
            outputPath: 'dist/build/asset/'
        },
        demoPage: {
            inputFiles: 'src/page/demo/style.scss',
            rename: 'style.min.css',
            outputPath: 'demo/'
        }
    }
};