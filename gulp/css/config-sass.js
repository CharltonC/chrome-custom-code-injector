module.exports = {
    defOption: {
        includePaths: ['node_modules'],
    },
    tasks: {
        popupPage: {
            inputFiles: 'src/page/option/main.scss',              // NOTE: wildcard "*" is not allowed
            rename: 'main.min.css',
            outputPath: 'dist/option/'
        },
        optionPage: {
            inputFiles: 'src/page/popup/main.scss',
            rename: 'main.min.css',
            outputPath: 'dist/popup/'
        }
    }
};