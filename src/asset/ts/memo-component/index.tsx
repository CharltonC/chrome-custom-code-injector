import { Component } from 'react';

/**
 * Used for Component Class Inheritance only for React Component
 */
export class MemoComponent<P = any, S = any> extends Component<P, S> {
    shouldComponentUpdate(modProps: Record<string, any>, modState: Record<string, any>) {
        // Check State 1st (since internal state changes should be prioritized)
        const modStateItems: [string, any][] = Object.entries(modState);
        const isDiffState: boolean = modStateItems.length &&
            modStateItems.some(([key, val]: [string, any]) => {
                return val !== this.state[key];
            });
        // - Update if any state value changes, else Proceed to checking Props
        if (isDiffState) return true;

        // Check Props
        const modPropsItems: [string, any][] = Object.entries(modProps);
        const currPropsItems: [string, any][] = Object.entries(this.props);

        // - Dont update if no props
        if (!modPropsItems.length || !currPropsItems.length) return false;

        // - Check by using strict equal: if any prop val not equal, then update
        return modPropsItems.some(([key, val]: [string, any]) => {
            return val !== this.props[key];
        });
    }
}
