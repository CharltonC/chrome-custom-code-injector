import React, { ReactElement } from 'react';
import { MemoComponent } from '../../extendable/memo-component';
import { inclStaticIcon } from '../../static/icon';
import { IProps, IState, IValidationConfig, ICallback, TValidState } from './type';

export class TextInput extends MemoComponent<IProps, IState> {
    readonly BASE_CLS: string = 'text-ipt';
    readonly $validIcon: ReactElement = inclStaticIcon('valid');
    $input: HTMLInputElement;

    constructor(props: IProps) {
        super(props);
        const { validate } = this.props;
        this.state = this.getInitialState(validate);
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    render() {
        const { BASE_CLS, cssCls, $validIcon } = this;
        const { id, label, onInputChange, onInputBlur, validate, ...inputProps } = this.props;
        const { required } = inputProps;
        const { isValid, hsValidation, errMsg } = this.state;
        const hsValidState: boolean = hsValidation && (isValid !== null);
        const validateCls: string = hsValidState ? (isValid ? 'valid' : 'invalid') : '';
        const className: string = cssCls(BASE_CLS, (label ? 'label' : '') + ` ${validateCls}`);
        const labelCls: string = cssCls(`${BASE_CLS}__label`, required ? 'req' : '');

        return (
            <div className={className}>{ label &&
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
                    { hsValidState && isValid && $validIcon }
                </div>{ hsValidState && !isValid &&
                <ul className="text-ipt__err">{ errMsg.map((msg, idx) =>
                    <li key={`text-ipt__err-msg-${idx}`}>{msg}</li>)}
                </ul>}
            </div>
        );
    }

    getInitialState(validate: IValidationConfig[]): IState {
        return {
            hsValidation: validate?.length > 0,
            isValid: null,
            errMsg: []
        };
    }

    getValidState(text: string, rules: IValidationConfig[]): TValidState {
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
        return {
            isValid: !errMsg.length,
            errMsg
        };
    }

    setValidState(evt: React.ChangeEvent<HTMLInputElement>, evtCbFn: (arg: ICallback) => void, charLimit: number): void {
        const { validate } = this.props;
        const { isValid, hsValidation } = this.state;
        const val: string = evt.target.value;

        // Get validate state anyway
        const validState: TValidState = hsValidation ? this.getValidState(val, validate) : null;

        // Only set validate state only when there r validation rules & either of the following:
        // - when its 1st time focus & there r more than or eq. to 3 characters + validation rules exist
        // - when its blurred (regardless of character limit, i.e. `charLimit=0`) + validation rules exist
        const isFitForValidation: boolean = hsValidation && ((isValid === null && val.length >= charLimit) || isValid !== null);
        if (isFitForValidation) this.setState({...this.state, ...validState});

        // handle two way binding internally if needed for external state
        evtCbFn?.({
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
        // Wait some time in case its parent component is unmounted. dont update the state if there is any unmounting
        // e.g. if inside a modal
        setTimeout(e => {
            if (!this.$input) return;
            this.setValidState(e, this.props.onInputBlur, 0);
        }, 100, {...evt});
    }
}