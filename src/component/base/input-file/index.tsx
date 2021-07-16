import React, { ChangeEvent } from 'react';
import { MemoComponent } from '../../extendable/memo-component';
import { IProps, IState, IValidationConfig } from './type';

const BASE_CLS = 'file-input';
const MSG_NO_FILE = 'no file was selected';

export class FileInput extends MemoComponent<IProps, IState> {
    state: IState = {
        isValid: null,
        errMsg: []
    };

    constructor(props: IProps) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    render() {
        const { cssCls, props, state } = this;
        const { id, clsSuffix, fileType, validate, onFileChange, ...inputProps } = props;
        const { isValid, errMsg } = state;
        const ROOT_CLS = cssCls(BASE_CLS, clsSuffix);

        return (
            <div className={ROOT_CLS}>
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

        const file: File = evt.target.files.item(0);
        const errMsg: string[] = [];

        if (!file) {
            errMsg.push(MSG_NO_FILE);

        } else {
            validate.forEach(({ rule, msg }: IValidationConfig) => {
                if (!rule(file)) errMsg.push(msg);
            });
        }

        const validState: IState = { errMsg, isValid: !errMsg.length };
        this.setState(validState);
        onFileChange?.(evt, validState);
    }
}