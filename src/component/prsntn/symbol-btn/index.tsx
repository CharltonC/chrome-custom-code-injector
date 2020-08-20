import React from 'react';
import { MemoComponent } from '../../../asset/ts/memo-component';
import { IProps } from './type';

export class SymbolBtn extends MemoComponent<IProps, {}> {
    hsExtState: boolean;

    constructor(props: IProps) {
        super(props);

        const { isChecked } = props;
        this.hsExtState = typeof isChecked !== 'undefined';
        this.onChange = this.onChange.bind(this);
    }

    onChange(evt: React.ChangeEvent<HTMLInputElement>): void {
        const checked: boolean = evt.target.checked;
        this.props.onChecked?.(evt, checked);
    }

    render() {
        const { id, text, isChecked, onChecked, ...cbProps } = this.props;

        const baseCls = 'symbol-btn';
        const inputCls = `${baseCls}__checkbox`;
        const spanCls = `${baseCls}__text`;

        // Determine whether to incl. ext. state
        const props = this.hsExtState ? {...cbProps, defaultChecked: isChecked} : cbProps;

        return (
            <label htmlFor={id} className={baseCls}>
                <input
                    type="checkbox"
                    id={id}
                    className={inputCls}
                    onChange={this.onChange}
                    {...props}
                    >
                </input>
                <span className={spanCls}>{text}</span>
            </label>
        );
    }
}
