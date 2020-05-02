module.exports = {
    defOption: {
        includePaths: ['node_modules'],
    },
    tasks: {
        app: {
            inputFiles: 'src/component/app/app.scss',              // NOTE: wildcard "*" is not allowed
            rename: 'app.min.css',
            outputPath: 'dist/pro/common'
        },
        popup: {
            inputFiles: 'src/page/popup/main.scss',
            rename: 'main.min.css',
            outputPath: 'dist/pro/popup'
        }
    }
};