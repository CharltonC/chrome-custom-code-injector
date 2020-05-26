import React, { memo, Component, ReactElement } from 'react';

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
        this.hsValidationRules = typeof validate !== 'undefined' && validate.length > 0;

        // Internal state only
        this.state = {
            isValid: null,
            errMsg: []
        };

        // handlers
        this.onTriggerValidate = this.onTriggerValidate.bind(this);
    }

    /**
     * Note:
     * - wont work: `
     * let isFnRule = rule instanceof Function;
     * let isValid: boolean = isFnRule ? rule(val) : rule.test(val);
     * `
     * - works:
     * `const isValid = (rule instanceof Function) ? rule(val) : rule.test(val);`
     * or
     * `if (rule instanceof Function) { isValid = rule(val); }`
     */
    getErrMsg(val: string, rules: NInput.IValidationConfig[]): string[] {
        const errMsg: string[] = [];
        rules.forEach(({rule, msg}: NInput.IValidationConfig) => {
            let isValid: boolean = true;

            if (rule instanceof Function) {
                isValid = rule(val);

            } else if (rule instanceof RegExp) {
                isValid = val.search(rule) !== -1;
            }

            if (!isValid) errMsg.push(msg);
        });
        return errMsg;
    }

    // only trigger validation when blur & input
    onTriggerValidate(evt: React.ChangeEvent<HTMLInputElement>): void {
        const { onChange, validate } = this.props;
        const val: string = evt.target.value;

        // handle two way binding internally if needed for external state
        if (onChange) onChange(evt, val, val.length >= 2);

        // Only validate when there validation rules passed
        if (this.hsValidationRules) {
            const errMsg = this.getErrMsg(val, validate);
            const isValid: boolean = !errMsg.length;
            this.setState({isValid, errMsg});
        }
    }

    render() {
        const {id, text, onChange, validate, ...props} = this.props;
        const { isValid } = this.state;

        // Wrapper
        const baseCls: string = 'text-ipt';
        const validateCls: string = (validate && (isValid !== null)) ? (isValid ? `${baseCls}--valid` : `${baseCls}--invalid`) : '';
        const wrapperCls: string = `${baseCls} ${validateCls}`;

        // Input
        const inputProps = this.hsExtState ? {...props, value: text} : {...props};

        // Icon
        const validIcon: ReactElement = (this.hsValidationRules && isValid) ? staticIconElem('valid') : null;

        return (
            <div className={wrapperCls} >
                <label className="text-ipt__label" htmlFor={id}>
                    <input
                        id={id}
                        className="text-ipt__input"
                        type="text"
                        onChange={this.onTriggerValidate}
                        onBlur={this.onTriggerValidate}
                        {...inputProps}
                        >
                    </input>
                    { validIcon }
                </label>
                { !validate ? null :
                <ul className="text-ipt__err">
                    { this.state.errMsg.map((msg, idx) => (
                        <li key={`text-ipt__err-msg-${idx}`}>{msg}</li>
                    )) }
                </ul> }
            </div>
        );
    }
}

export const Input = memo(_Input);