import React, { memo, Component } from 'react';

import { inclStaticIcon } from '../../static/icon';
import { IProps, IState, IValidationConfig } from './type';

export class _TextInput extends Component<IProps, IState> {
    inputElem: HTMLInputElement;

    constructor(props: IProps) {
        super(props);

        // Text input (either use internal or external)
        const { text, validate } = this.props;
        this.state = this.getInitialState(text, validate);

        // handlers
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    /**
     * Revalidate when passed validation rules have changed
     */
    UNSAFE_componentWillReceiveProps({text, validate}: IProps): void {
        const { props } = this;
        const isSameRules: boolean = props.validate === validate;

        // We dont care about if other props change except for the passed text and validation rules
        if (isSameRules) return;

        // Only Revalidate & Update internal state when the passed Validation rules have changed
        const state: IState = this.getInitialState(text, validate);
        const validateText: string = state.hsExtState ? text : this.inputElem.value;
        const validState: Partial<IState> = state.hsValidationRules ? this.getValidState(validateText, validate) : {};
        this.setState({...state, ...validState});
    }

    getInitialState(text: string, validate: IValidationConfig[]): IState {
        return {
            hsExtState: typeof text !== 'undefined',
            hsValidationRules: typeof validate !== 'undefined' && validate.length > 0,
            isValid: null,
            errMsg: []
        }
    }

    getValidState(text: string, rules: IValidationConfig[]): Partial<IState> {
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
        const { isValid, hsValidationRules } = this.state;
        const val: string = evt.target.value;

        // Get validate state anyway
        const validState: Partial<IState> = hsValidationRules ? this.getValidState(val, validate) : null;

        // Only set validate state only when there r validation rules & either of the following:
        // - when its 1st time focus & there r more than or eq. to 3 characters + validation rules exist
        // - when its blurred (regardless of character limit, i.e. `charLimit=0`) + validation rules exist
        const isFitForValidation: boolean = hsValidationRules && ((isValid === null && val.length >= charLimit) || isValid !== null);
        if (isFitForValidation) this.setState({...this.state, ...validState});

        // handle two way binding internally if needed for external state
        if (evtCbFn) evtCbFn({
            evt,
            val,
            isGte3: val.length >= 3,
            validState
        });
    }

    //// EVENT HANDLE ////
    onChange(evt: React.ChangeEvent<HTMLInputElement>): void {
        this.setValidState(evt, this.props.onInputChange, 3);
    }

    onBlur(evt: React.ChangeEvent<HTMLInputElement>): void {
        this.setValidState(evt, this.props.onInputBlur, 0);
    }

    render() {
        const {id, text, onInputChange, onInputBlur, validate, ...props} = this.props;
        const { isValid, hsValidationRules, hsExtState } = this.state;
        const hsValidState: boolean = hsValidationRules && (isValid !== null);

        // Wrapper
        const baseCls: string = 'text-ipt';
        const validateCls: string = hsValidState ? (isValid ? `${baseCls}--valid` : `${baseCls}--invalid`) : '';
        const wrapperCls: string = validateCls ? `${baseCls} ${validateCls}` : baseCls;

        // Input
        const inputProps = hsExtState ? {...props, value: text} : {...props};

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
                        ref={elem => this.inputElem = elem}
                        onChange={this.onChange}
                        onBlur={this.onBlur}
                        {...inputProps}
                        >
                    </input>
                    { hsIcon ? inclStaticIcon('valid') : null }
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