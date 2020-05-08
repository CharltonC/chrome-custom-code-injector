module.exports = {
    defOption: {
        includePaths: ['node_modules'],
    },
    tasks: {
        popupPage: {
            inputFiles: 'src/page/option/style.scss',              // NOTE: wildcard "*" is not allowed
            rename: 'style.min.css',
            outputPath: 'dist/build/option/'
        },
        optionPage: {
            inputFiles: 'src/page/popup/style.scss',
            rename: 'style.min.css',
            outputPath: 'dist/build/popup/'
        }
    }
};