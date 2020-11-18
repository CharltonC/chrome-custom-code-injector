import { Component } from 'react';
import { UtilHandle } from '../../../service/util-handle';
import { TObj, TObjEntry } from './type';

/**
 * Used for Component Class Inheritance only for React Component
 */
export class MemoComponent<P = TObj, S = TObj> extends Component<P, S> {
    readonly cssCls = (new UtilHandle()).cssCls;

    shouldComponentUpdate(modProps: TObj, modState: TObj) {
        // Check State 1st (since internal state changes should be prioritized)
        const modStateItems: TObjEntry[] = modState ? Object.entries(modState) : [];
        const isDiffState: boolean = modStateItems.length &&
            modStateItems.some(([key, val]: TObjEntry) => {
                return val !== this.state[key];
            });
        // - Update if any state value changes, else Proceed to checking Props
        if (isDiffState) return true;

        // Check Props
        const modPropsItems: TObjEntry[] = Object.entries(modProps);
        const currPropsItems: TObjEntry[] = Object.entries(this.props);

        // - Dont update if no props
        if (!modPropsItems.length || !currPropsItems.length) return false;

        // - Check by using strict equal: if any prop val not equal, then update
        return modPropsItems.some(([key, val]: TObjEntry) => {
            return val !== this.props[key];
        });
    }
}
