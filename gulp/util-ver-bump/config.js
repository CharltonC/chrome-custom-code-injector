module.exports = {
    tasks: {
        packageJson: {
            inputFiles: [
                './package.json',
            ],
            outputPath: './'
        },
        manifestJson: {
            inputFiles: [
                './src/manifest.json'
            ],
            outputPath: './src'
        }

    }
};