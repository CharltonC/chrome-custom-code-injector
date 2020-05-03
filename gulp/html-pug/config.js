module.exports = {
    defOption: {

    },
    tasks: {
        popupPage: {
            inputFiles: [ 'src/page/popup/*.pug' ],
            outputPath: 'dist/popup'
        },
        optionPage: {
            inputFiles: [ 'src/page/option/*.pug' ],
            outputPath: 'dist/option'
        }
    }
};