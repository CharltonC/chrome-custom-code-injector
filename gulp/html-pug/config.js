module.exports = {
    defOption: {

    },
    tasks: {
        popupPage: {
            inputFiles: [ 'src/page/popup/index.pug' ],
            outputPath: 'dist/build/popup'
        },
        optionPage: {
            inputFiles: [ 'src/page/option/index.pug' ],
            outputPath: 'dist/build/option'
        }
    }
};