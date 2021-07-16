import { Component } from 'react';
import { UtilHandle } from '../../../service/util-handle';

/**
 * Used for Component Class Inheritance only for React Component
 */
export class MemoComponent<P = AObj, S = AObj> extends Component<P, S> {
    readonly cssCls = (new UtilHandle()).cssCls;

    shouldComponentUpdate(modProps: AObj, modState: AObj) {
        // Check State 1st (since internal state changes should be prioritized)
        const modStateItems: AObjEntry[] = modState ? Object.entries(modState) : [];
        const isDiffState = modStateItems.length &&
            modStateItems.some(([key, val]: AObjEntry) => {
                return val !== this.state[key];
            });
        // - Update if any state value changes, else Proceed to checking Props
        if (isDiffState) return true;

        // Check Props
        const modPropsItems: AObjEntry[] = Object.entries(modProps);
        const currPropsItems: AObjEntry[] = Object.entries(this.props);

        // - Dont update if no props
        if (!modPropsItems.length || !currPropsItems.length) return false;

        // - Check by using strict equal: if any prop val not equal, then update
        return modPropsItems.some(([key, val]: AObjEntry) => {
            return val !== this.props[key];
        });
    }
}
