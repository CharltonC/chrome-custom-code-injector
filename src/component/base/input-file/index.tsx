import React, { ChangeEvent } from 'react';
import { MemoComponent } from '../../extendable/memo-component';
import { IProps, IState, IValidationConfig } from './type';

export class FileInput extends MemoComponent<IProps, IState> {
    readonly BASE_CLS: string = 'file-input';

    state: IState = {
        isValid: null,
        errMsg: []
    };

    constructor(props: IProps) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    render() {
        const { BASE_CLS, cssCls, props, state } = this;
        const { id, clsSuffix, fileType, validate, onFileChange, ...inputProps } = props;
        const { isValid, errMsg } = state;
        const className: string = cssCls(BASE_CLS, clsSuffix);

        return (
            <div className={className}>
                <input
                    type="file"
                    id={id}
                    className={`${BASE_CLS}__input`}
                    accept={fileType}
                    onChange={this.onChange}
                    {...inputProps}
                    />{ validate?.length && !isValid &&
                <ul className={`${BASE_CLS}__err`}>{ errMsg.map((msg, idx) =>
                    <li key={`${BASE_CLS}__err-msg-${idx}`}>{msg}</li>)}
                </ul>}
            </div>
        );
    }

    onChange(evt: ChangeEvent<HTMLInputElement & FileList>): void {
        const { validate, onFileChange } = this.props;
        if (!validate?.length) return;

        const errMsg: string[] = [];
        const file: File = evt.target.files.item(0);
        validate.forEach(({ rule, msg }: IValidationConfig) => {
            if (!rule(file)) errMsg.push(msg);
        });
        const validState: IState = {
            errMsg,
            isValid: !errMsg.length
        };

        this.setState(validState);
        onFileChange?.(evt, validState);
    }
}