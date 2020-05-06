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
                'src/asset/icon/*.png'
            ],
            outputPath: 'dist/build/asset/icon'
        },
        manifest: {
            inputFiles: [
                'src/manifest.json'
            ],
            // rename: 'manifest.json',
            outputPath: 'dist/build/'
        }
    }
};