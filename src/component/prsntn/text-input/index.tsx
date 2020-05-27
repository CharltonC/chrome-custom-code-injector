import React, { memo, Component } from 'react';

import { staticIconElem } from '../../static/icon';
import { IProps, State, IValidationConfig } from './type';

export class _TextInput extends Component<IProps, State> {
    private hsExtState: boolean;
    private hsValidationRules: boolean;

    constructor(props: IProps) {
        super(props);

        // Text input (either use internal or external)
        const { text, validate } = this.props;
        this.hsExtState = typeof text !== 'undefined';
        this.hsValidationRules = typeof validate !== 'undefined' && validate.length > 0;
        this.state = new State();

        // handlers
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    //// HELPER FN
    /**
     * TODONote:
     * - wont work: `
     * let isFnRule = rule instanceof Function;
     * let isValid: boolean = isFnRule ? rule(val) : rule.test(val);
     * `
     * - works:
     * `const isValid = (rule instanceof Function) ? rule(val) : rule.test(val);`
     * or
     * `if (rule instanceof Function) { isValid = rule(val); }`
     */
    // only trigger validation when blur & input
    // when there are 3 char or more
    getValidState(text: string, rules: IValidationConfig[]): State {
        const errMsg: string[] = [];
        rules.forEach(({rule, msg}: IValidationConfig) => {
            let isValid: boolean = true;

            if (typeof rule === 'function') {
                isValid = rule(text);

            } else if (rule instanceof RegExp) {
                isValid = text.search(rule) !== -1;
            }

            if (!isValid) errMsg.push(msg);
        });
        const isValid: boolean = !errMsg.length;
        return { isValid, errMsg };
    }

    setValidState(evt: React.ChangeEvent<HTMLInputElement>, evtCbFn: (...args: any[]) => void, charLimit: number): void {
        const { validate } = this.props;
        const { isValid } = this.state;
        const { hsValidationRules } = this;
        const val: string = evt.target.value;

        // Get validate state anyway
        const validState: State = hsValidationRules ? this.getValidState(val, validate) : null;

        // Only set validate state only when there r validation rules & either of the following:
        // - when its 1st time focus & there r more than or eq. to 3 characters + validation rules exist
        // - when its blurred (regardless of character limit, i.e. `charLimit=0`) + validation rules exist
        const isFitForValidation: boolean = hsValidationRules && ((isValid === null && val.length >= charLimit) || isValid !== null);
        if (isFitForValidation) this.setState(validState);

        // handle two way binding internally if needed for external state
        if (evtCbFn) evtCbFn(evt, val, val.length >= 3, validState);
    }

    //// EVENT HANDLE
    onChange(evt: React.ChangeEvent<HTMLInputElement>): void {
        this.setValidState(evt, this.props.onInputChange, 3);
    }

    onBlur(evt: React.ChangeEvent<HTMLInputElement>): void {
        this.setValidState(evt, this.props.onInputBlur, 0);
    }

    render() {
        const {id, text, onInputChange, onInputBlur, validate, ...props} = this.props;
        const { isValid } = this.state;
        const { hsValidationRules } = this;
        const hsValidState: boolean = hsValidationRules && (isValid !== null);

        // Wrapper
        const baseCls: string = 'text-ipt';
        const validateCls: string = hsValidState ? (isValid ? `${baseCls}--valid` : `${baseCls}--invalid`) : '';
        const wrapperCls: string = validateCls ? `${baseCls} ${validateCls}` : baseCls;

        // Input
        const inputProps = this.hsExtState ? {...props, value: text} : {...props};

        // Icon
        const hsIcon: boolean = hsValidState && isValid;

        // Error Msg
        const hsErrMsg: boolean = hsValidState && !isValid;

        return (
            <div className={wrapperCls} >
                <label className="text-ipt__label" htmlFor={id}>
                    <input
                        id={id}
                        className="text-ipt__input"
                        type="text"
                        onChange={this.onChange}
                        onBlur={this.onBlur}
                        {...inputProps}
                        >
                    </input>
                    { hsIcon ? staticIconElem('valid') : null }
                </label>
                {
                    hsErrMsg ?
                    <ul className="text-ipt__err">
                        { this.state.errMsg.map((msg, idx) => (
                            <li key={`text-ipt__err-msg-${idx}`}>{msg}</li>
                        )) }
                    </ul> :
                    null
                }
            </div>
        );
    }
}

export const TextInput = memo(_TextInput);