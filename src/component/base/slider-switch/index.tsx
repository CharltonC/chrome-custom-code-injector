import React, { ChangeEvent } from 'react';
import { MemoComponent } from '../../../asset/ts/memo-component';
import { IProps, IState } from './type';

export class SliderSwitch extends MemoComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(evt: ChangeEvent<HTMLInputElement>): void {
        this.props.onChange?.(evt);
    }

    render() {
        const { id, label, ...props } = this.props;

        return (
            <label className="slider-switch" htmlFor={id}>
                <input
                    type="checkbox"
                    id={id}
                    name={id}
                    {...props}
                    onChange={this.onChange}
                    />{ label &&
                    <span>{label}</span>}
            </label>
        );
    }
}