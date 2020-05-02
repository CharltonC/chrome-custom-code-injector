# Custom Code Insertion

#### Table of Contents:
* About
* Setup (Mac based) 
* CLI Command
* Folder Structure
* Design/Pattern

---

## About
Primary Tech Stack: 
* SCSS (CSS)
* JADE (HTML)
* TypeScript 2.5.3
* Node 13.12.0 | Npm 6.14.4


## Setup (Mac based) 
#### Dependencies
1. Install Node
2. Install Typescript in Terminal:  
```
npm install -g typescript
```
3. Under Project Root, Install the dependencies in Terminal:  
```
npm run setup
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
* Build (dev/prod):
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
* Build Watch with optional Development server:
```
gulp serve [--server]?
```
* Generate Docs:
```
npm run doc
```
* Generate Directory Tree (required to be copied from terminal upon generation & added to README):  
```
npm run dir-tree
```  

## Folder Structure

