module.exports = {
    tasks: {
        // Common
        icon_chromeStore: {
            inputFiles: [
                'src/asset/icon/icon_128.png'
            ],
            outputPath: 'doc/chrome-store/icon'
        },
        icon: {
            inputFiles: [
                'src/asset/icon/*.*'
            ],
            outputPath: 'dist/build/asset/icon'
        },
        font: {
            inputFiles: [
                'src/asset/font/*.*'
            ],
            outputPath: 'dist/build/asset/font'
        },
        manifest: {
            inputFiles: [
                'src/manifest.json'
            ],
            outputPath: 'dist/build/'
        }
    }
};