const path = require('path');
const isProd = process.env.NODE_ENV === 'production';
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

//// For root folder, `./` is recommeneded in `entry` and `output.path`
// - e.g. `./` in `./src`
module.exports = {
    // Prevent eval error below thrown by Chrome:
    // `Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script in the following Content Security Policy directive: "script-src 'self' blob: filesystem:".`
    devtool: 'inline-source-map',

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
            // - the rest matches `entry.<propName>`
            // - ref: https://webpack.js.org/configuration/output/
            return `${name}/main.min.js`;
        }
    },
    optimization: {
        usedExports: true,

        // Prod only (not run in Dev mode)
        minimizer: [
            new UglifyJsPlugin(),
        ],

        //// common/shared js file (aka vendor)
        splitChunks: {
            //// Random generated name
            // chunks: 'all',

            // OR

            //// Specific name
            cacheGroups: {
                //// name and specific dep match
                conmmons: {
                    //// specific match if needed to group specific modules as shared modules
                    // e.g. test: /[\\/]node_modules[\\/]/,

                    //// file name
                    name: 'asset/common.min',               // for dev (WTF?)
                    filename: 'asset/common.min.js',        // for prod (WTF? else it outputs to e.g. `0.js`)

                    chunks: 'initial',
                },
            }
        },
    },
};