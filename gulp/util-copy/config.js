module.exports = {
    tasks: {
        // Common
        icon_pro_chromeStore: {
            inputFiles: [ 'src/common/img/icon/pro/icon_128.png' ],
            outputPath: 'doc/chrome-store/pro/icon'
        },
        icon_lite_chromeStore: {
            inputFiles: [ 'src/common/img/icon/lite/icon_128.png' ],
            outputPath: 'doc/chrome-store/lite/icon'
        },
        icon_lite: {
            inputFiles: [
                'src/common/img/icon/lite/*.png'
            ],
            outputPath: 'dist/lite/common/'
        },
        icon_pro: {
            inputFiles: [
                'src/common/img/icon/pro/*.png',
                'src/common/font/shl-app-icomoon/fonts/shl-app-icomoon.woff'
            ],
            outputPath: 'dist/pro/common/'
        },
        manifest_lite: {
            inputFiles: [ 'src/manifest.lite.json' ],
            rename: 'manifest.json',
            outputPath: 'dist/lite/'
        },
        manifest_pro: {
            inputFiles: [ 'src/manifest.pro.json' ],
            rename: 'manifest.json',
            outputPath: 'dist/pro/'
        }
    }
};