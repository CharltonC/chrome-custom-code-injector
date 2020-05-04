// Ant Design
// - DO NOT: e.g. `import {Button} from 'antd';` which will import all modules
// - Do: e.g. `import Button from 'antd/es/button';`
import React from 'react';
import { render } from 'react-dom';

export const Hello = () => <h1>lorem</h1>;
const containerElem = document.createElement('div');
document.body.appendChild(containerElem);
render(<h1>lorem sum</h1>, containerElem);

// import Button from 'antd/es/button';
// render(<Button type="primary">PRESS ME</Button>, containerElem);