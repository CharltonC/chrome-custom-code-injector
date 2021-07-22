import React from 'react';
import { MemoComponent } from '../../extendable/memo-component';
import { inclStaticIcon } from '../../static/icon';
import { IProps, IValidationRule, IValidationState } from './type';

const BASE_CLS = 'text-ipt';
const $validIcon = inclStaticIcon('valid');

export class TextInput extends MemoComponent<IProps> {
    $input: HTMLInputElement;

    static defaultProps: Partial<IProps> = {
        validation: {}
    };

    constructor(props: IProps) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    render() {
        const { cssCls } = this;
        const { id, label, onInputChange, onInputBlur, validation, defaultValue,...inputProps } = this.props;
        const { rules, fixedPosErrMsg, isValid, errMsg, } = Object.assign(this.defValidationConfig, validation);

        const showValidation = this.hsValidation(rules) && typeof isValid === 'boolean';
        const showValidIcon = showValidation && isValid;
        const showErrMsg = showValidation && !isValid;

        const validateCls = showValidation ? (isValid ? 'valid' : 'invalid') : '';
        const wrapperCls = cssCls(BASE_CLS, (label ? 'label' : '') + ` ${validateCls}`);
        const labelCls = cssCls(`${BASE_CLS}__label`, inputProps?.required ? 'req' : '');
        const errMsgCls = cssCls(`${BASE_CLS}__err`, fixedPosErrMsg ? 'pos-fixed' : '');

        const $errMsgList = showErrMsg && errMsg ? (
            <ul className={errMsgCls}>{ errMsg.map((msg, idx) =>
                <li key={`text-ipt__err-msg-${idx}`}>{msg}</li>)}
            </ul>
        ) : null;

        return (
            <div className={wrapperCls}>{ label &&
                <label className={labelCls} htmlFor={id}>{label}</label>}
                <div className="text-ipt__input">
                    <input
                        id={id}
                        type="text"
                        ref={e => this.$input = e}
                        onChange={this.onChange}
                        onBlur={this.onBlur}
                        {...inputProps}
                        />
                    { showValidIcon && $validIcon }
                    { fixedPosErrMsg && $errMsgList }
                </div>
                { !fixedPosErrMsg && $errMsgList }
            </div>
        );
    }

    // - only when its 1st time focus & there r more than or eq. to 3 characters
    onChange(evt: React.ChangeEvent<HTMLInputElement>): void {
        this.onCallback(evt, this.props.onInputChange);
    }

    // - only when its blurred (regardless of character limit)
    onBlur(evt: React.ChangeEvent<HTMLInputElement>): void {
        this.onCallback(evt, this.props.onInputBlur);
    }

    onCallback(evt: React.ChangeEvent<HTMLInputElement>, cbFn: AFn<void>): void {
        if (!cbFn) return;

        const { rules } = this.props.validation;
        const val = evt.target.value;
        const isGte3 = val.length >= 3;
        const validState = this.getValidState(val, rules);
        cbFn({
            ...validState,
            evt,
            val,
            isGte3
        });
    }

    getValidState(text: string, rules: IValidationRule[]): IValidationState {
        if (!this.hsValidation(rules)) return;

        const errMsg: string[] = [];
        rules.forEach(({rule, msg}: IValidationRule) => {
            let isValid = true;

            if (typeof rule === 'function') {
                isValid = rule(text);

            } else if (rule instanceof RegExp) {
                isValid = text.search(rule) !== -1;
            }

            if (!isValid) errMsg.push(msg);
        });
        return {
            isValid: !errMsg.length,
            errMsg
        };
    }

    hsValidation(rules: IValidationRule[]): boolean {
        return rules?.length > 0;
    }

    get defValidationConfig() {
        return {
            rules: [],
            isValid: null,
            errMsg: [],
            fixedPosErrMsg: true,
        };
    }
}