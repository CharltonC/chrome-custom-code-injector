# Custom Code Insertion

#### Table of Contents:
* About
* Setup (Mac based) 
* CLI Command
* Folder Structure

---

## About
Primary Tech Stack: 
* SCSS (CSS)
* JADE (HTML)
* TypeScript 3.8.3
* Node 13.12.0 | Npm 6.14.4
* React 16.13.1
* Jest (Unit Testing)


## Setup (Mac based) 
#### Dependencies
1. Install Node
2. Under Project Root, Install the dependencies in Terminal:  
```
npm install
```

#### VisualStudio Code Editor
* Go to Menu: `Preference > Settings`, in your user settings, make sure the settings has the following set: 
```javascript
{
    ...
    "typescript.tsdk": "node_modules/typescript/lib",
    "files.trimTrailingWhitespace": true,
    "[markdown]": {
        "files.trimTrailingWhitespace": false
    }        
}
```


## CLI Command (refer to `gulpfile.js` file for the rest)
* Generate Compnents (dev):
```
npm run cmp-[s|p|g|v|c]
```
* Serve: Watch files + Compile:
```
npm run files-[dev|prod]
```
* Serve: Watch files + Compile + Start a Server to view the Specific page:
```
npm run serve-index-[popup|option] [--prod --watchify?]?
```
* Serve: Start a Server to View All UI Components (dev):
```
npm run serve-styleguide
```
* Build
```
gulp build [--prod]?
``` 
* Build Scss/Css:
```
gulp build-css [--prod]?
```
* Build Typescript (including linting):
```
gulp build-ts [--prod]?
```
* Lint Typescript:
```
gulp build-ts:lint
```
* Unit Test Typescript:
```
gulp build-ts:test [--watch]?
```    


## Folder Structure
    .storybook/                 // setting for Storybook (doc generation tool)
        main.js                 // webpack config to be merged with storybook's default config
        preview-head.html       // content to be included in the UI component index page's <head> tag (used for loading css)

    .vscode/                    // vscode editor setting (contains unit test debug settings)

    dist/                       // output files
        build/                  // unzipped files used for test
            asset/              // common assets for different pages
            option/             // option page
            popup/              // popup page
            manifest.json       // copy of `src/manifest.json`

        <name>.zip              // zipped file for uploading to chrome store

    doc/                        // Documentation
        chrome-store/           // for chrome web store
        design/                 // wireframe, ui design files, notes and diagram (on separate repo)
        user-guide/             // tutorial/how-to  (separate repo)
        test-report/            // unit test report
        ui-component/           // output for doc generated by storybook (if any)
        TODO.md                 // todo list in general
        
    node_modules/               // dev dependencies

    gulp/                       // gulp plugin config
        <category-name>/
            config.js           // task config
            task.js             // task logic

    schematic/                  // based template files used for generating different types of component

    src/                        // source code
        asset/                  // common assets
            font/
            icon/
            ts/ 
                type/           // typings
                test-util/      // Unit Test Utility/Helper Module for simplifying testing                

            scss/    
                mixin/          // scss reusable extendables and mixins
                var/            // scss variables
                vendor/         // css generated by or from vendor/site

        component/              // various categories of components
            prsntn/             // presentation component
            prsntn-grp/         // presentation component group
            prsntn-composite/   // presentation composition components (i.e. complex/full functionalities)
            structural          // structural wrapper component only
            static/             // static component (fixed html)
            view/               // view (for used with router)

        page/
            <page-name>/        // bg-script (background script), ct-script (context script), option page, popup page
                main.ts         // if the page doesnt just run a script (e.g. background script)
                main.spec.ts?   // test file
                index.pug?      // index page (if the pages doesn't just run a script)
                style.scss?     // styel for index page

        service/                // services
            ui-handle/          // ui related handles             
                <name>/ 
                    index.ts
                    index.spec.ts
                    type.ts
        
        manifest.json           // manifest ("config") for the chrome extension 

    .eslintrc.json              // Typescript/js linting config
    tsconfig.json               // TypeScript config 
    typedoc.json                // TypeScript documentation config
    babel.config.js             // Babel config - transform TS and new Js features into ES5/Standard JavaScript
    jest.config.js              // Jest config - unit test

    gulpfile.js                 // build task registrations, corresp. to `gulp` folder   
    package.json                // dev-dependencies, dependencies for the project    
    .gitignore                  // git ignored (source control)
    README.md                   // entry readme file


