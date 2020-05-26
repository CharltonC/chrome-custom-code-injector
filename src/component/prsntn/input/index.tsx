import React, { memo, Component } from 'react';

import { staticIconElem } from '../../static/icon';
import * as NInput from './type';

export class _Input extends Component<NInput.IProps, NInput.IState> {
    private hsExtState: boolean;
    private hsValidationRules: boolean;

    constructor(props: NInput.IProps) {
        super(props);

        // Text input (either use internal or external)
        const { text, validate } = this.props;
        this.hsExtState = typeof text !== 'undefined';
        this.hsValidationRules = typeof validate !== 'undefined' && validate.length >= 1;

        // Internal state only
        this.state = {
            isValid: true,
            errMsg: []
        };

        // handlers
        this.onInputChange = this.onInputChange.bind(this);
    }

    /**
     * Note:
     * - wont work: let isValid: boolean = isFnRule ? rule(val) : rule.test(val);
     * - works: if (rule instanceOf Function) { isValid = rule(val); }
     */
    getErrMsg(val: string, rules: NInput.IValidationConfig[]): string[] {
        const errMsg: string[] = [];
        rules.forEach(({rule, msg}: NInput.IValidationConfig) => {
            let isValid: boolean = true;

            if (rule instanceof Function) {
                isValid = rule(val);

            } else if (rule instanceof RegExp) {
                isValid = rule.test(val);
            }

            if (!isValid) errMsg.push(msg);
        });
        return errMsg;
    }

    onInputChange(evt: React.ChangeEvent<HTMLInputElement>): void {
        const { onChange, validate } = this.props;
        const val: string = evt.target.value;

        // handle two way binding internally if needed for external state
        if (onChange) onChange(evt, val, val.length >= 2);

        // Only validate when there validation rules passed
        if (this.hsValidationRules) {
            const errMsg: string[] = this.getErrMsg(val, validate);
            const isValid: boolean = !errMsg.length;
            this.setState({isValid, errMsg});
        }
    }

    render() {
        const {id, text, onChange, validate, ...props} = this.props;
        const { isValid } = this.state;

        // Wrapper
        const baseCls: string = 'text-ipt';
        const validateCls: string = validate ? (isValid ? `${baseCls}--valid` : `${baseCls}--invalid`) : '';
        const wrapperCls: string = `${baseCls} ${validateCls}`;

        // Input
        const inputProps = this.hsExtState ? {...props, value: text} : {...props};

        return (
            <div className={wrapperCls} >
                <label className="text-ipt__label" htmlFor={id}>
                    <input
                        id={id}
                        className="text-ipt__input"
                        type="text"
                        onChange={this.onInputChange}
                        {...inputProps}
                        >
                    </input>
                    { (validate && isValid) ? staticIconElem('valid') : null }
                </label>
                { validate ?
                <ul className="text-ipt__err">
                    { this.state.errMsg.map((msg, idx) => (
                        <li key={`text-ipt__err-msg-${idx}`}>{msg}</li>
                    )) }
                </ul> :
                null }
            </div>
        );
    }
}

export const Input = memo(_Input);