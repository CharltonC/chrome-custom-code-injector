module.exports = {
    tasks: {
        lite: {
            inputFiles: [ 'dist/lite/**/*' ],
            versionFile: 'src/manifest.lite.json',  // rel. to root
            outputFileName: 'dist-lite',            // (no ".zip"extension required)
            outputPath: './dist/'
        },
        pro: {
            inputFiles: [ 'dist/pro/**/*' ],
            versionFile: 'src/manifest.pro.json',
            outputFileName: 'dist-pro',
            outputPath: './dist/'
        }
    }
};