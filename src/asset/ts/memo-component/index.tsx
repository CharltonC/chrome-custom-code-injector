import { Component } from 'react';

/**
 * Used for Component Class Inheritance only for React Component
 */
export class MemoComponent extends Component {
    shouldComponentUpdate(modProps: Record<string, any>) {
        const modPropsEntries: [string, any][] = Object.entries(modProps);
        const currPropsEntries: [string, any][] = Object.entries(this.props);

        // Dont update if no props
        if (!modPropsEntries.length || !currPropsEntries.length) return false;

        // Check by using strict equal:
        // - if any prop val not equal, then update
        return modPropsEntries.some(([propKey, propVal]: [string, any]) => {
            return propVal !== this.props[propKey];
        });
    }
}
