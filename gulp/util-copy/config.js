const { $ } = require('../common');

module.exports = {
    tasks: {
        // Common
        icon_chromeStore: {
            inputFiles: [
                'src/asset/icon/icon_128.png'
            ],
            outputPath: 'doc/chrome-store/icon'
        },

        // Asset
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
        img: {
            inputFiles: [
                'src/asset/img/*.*'
            ],
            outputPath: 'dist/build/asset/img'
        },

        // Demo Asset only
        demoFont: {
            inputFiles: [
                'src/asset/font/*.*'
            ],
            outputPath: 'demo/font'
        },
        demoImg: {
            inputFiles: [
                'src/asset/img/*.*'
            ],
            outputPath: 'demo/img'
        },

        // Chrome
        manifest: {
            inputFiles: [
                'src/manifest.json'
            ],
            outputPath: 'dist/build/'
        }
    }
};