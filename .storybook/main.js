const path = require('path');

module.exports = {
    stories: [
        // base story used just for importing assets e.g. css
        './*.tsx',

        // all compoennt stories
        '../src/component/**/**/*.story.tsx'
    ],
    webpackFinal: async config => {
        //// Parse Ts
        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            use: [{
                loader: require.resolve('ts-loader'),
            }],
        });
        config.resolve.extensions.push('.ts', '.tsx');

        //// For Debugging, use the following setting alone + CMD `npm run ui --debug-webpack`:
        // console.dir(config, { depth: null })

        return config;
    }
};