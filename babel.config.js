/*
 * Used by JEST Unit Test (where this config file is auto pickedup) & Build/Bundle (where this config file is imported)
 */
module.exports = {
    plugins: [
        /**
         * Shared by build/bundle + Jest Test
         * - used for Ant Design UI Components + "babel-plugin-import" to resolve `import` issue and large final bundle size issue
         * - ref: https://github.com/ant-design/babel-plugin-import#note
         * - Component Library Usage in Jx/Ts:
         *   `import {Button} from 'antd';`             does NOT work for Prod build (as it import all modules resulting in large file)
         *                                              (even specifying in babel config `"libraryDirectory": "lib"` does not work)
         *
         *   `import Button from 'antd/es/button';`     does NOT work for JEST (as it doesnt allow ES6 import/export in "node_modules/")
         *
         *   `import Button from 'antd/lib/button';`    works for both Prod build (Browserify) + JEST
         */
        ["import", {"libraryName": "antd"}],

        /**
         * For ES6 Class property defined on top of `constructor`
         */
        ["@babel/plugin-proposal-class-properties", { "loose": true }]
    ],

    presets: [
        /**
         * Shared by both build/bundle + Jest Test
         * - `['react-app', {'typescript': true}]` (from pkg "babel-preset-react-app") does not work for Jest
         */
        "@babel/preset-env", "@babel/preset-react",
        '@babel/preset-typescript'
    ]
};