module.exports = {
    tasks: {
        main: {
            inputFiles: [ 'dist/build/**/*' ],
            versionFile: 'src/manifest.json',  // rel. to root
            outputFileName: 'dist',            // (no ".zip"extension required)
            outputPath: './dist/'
        }
    }
};