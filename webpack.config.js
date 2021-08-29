const path = require('path');
const isProd = process.env.NODE_ENV === 'production';

//// For root folder, `./` is recommeneded in `entry` and `output.path`
// - e.g. `./` in `./src`
module.exports = {
    mode: isProd ? 'production' : 'development',

    entry: {
        'ct-script': './src/page/ct-script/main.ts',
        'option': './src/page/option/main.tsx',
        'popup': './src/page/popup/main.tsx',
        'bg': './src/page/background/main.ts',
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            }
        ],
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },

    output: {
        //// Clean the `path` before compile
        // clean: true,

        //// relative to project root
        path: path.resolve(__dirname, './dist/build'),

        //// [name] will used the property name under `entry`
        // filename: '[name].min.js',
        // OR
        filename({ chunk }) {
            const { name } = chunk;

            //// Allows specific output to sub folder of `path` above
            // - `name` is the Entry source file or Vendor
            // - `common` matches `splitChunks.cacheGroups.common.name`
            // - the rest matches `entry.<propName>`
            // - ref: https://webpack.js.org/configuration/output/
            return name === 'common'
                ? `asset/common.min.js`
                : `${name}/main.min.js`
        }
    },
    optimization: {
        //// common/shared js file (aka vendor)
        splitChunks: {
            //// Random generated name
            // chunks: 'all',

            // OR

            //// Specific name
            cacheGroups: {
                //// name and specific dep match
                conmmon: {
                    //// specific match if needed to group specific modules as shared modules
                    // e.g. test: /[\\/]node_modules[\\/]/,

                    //// file name
                    name: 'common',

                    chunks: 'all',
                },
            }
        },
    },
};