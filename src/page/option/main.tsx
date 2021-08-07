// // Ant Design
// // - `import {Button} from 'antd';`             does NOT work for Prod build (as it import all modules resulting in large file)
// //                                              (even specifying in babel config `"libraryDirectory": "lib"` does not work)
// // - `import Button from 'antd/es/button';`     does NOT work for JEST (as it doesnt allow ES6 import/export in "node_modules/")
// // - `import Button from 'antd/lib/button';`    works for both Prod build (Browserify) + JEST

// import React from 'react';
// import { render } from 'react-dom';
// import { OptionApp } from '../../component/app/option';

// const containerElem = document.createElement('div');
// document.body.appendChild(containerElem);
// render(<OptionApp />, containerElem);