import React, { ChangeEvent } from 'react';
import { MemoComponent } from '../../extendable/memo-component';
import { IProps, IState, AValidationConfig } from './type';

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

    async onChange(evt: ChangeEvent<HTMLInputElement & FileList>): Promise<void> {
        const { validate, onFileChange } = this.props;
        if (!validate?.length) return;

        // File is also a Blob (specific type)
        // - File interface is based on Blob
        const file: File = evt.target.files.item(0);
        let errMsg: string[] = [];

        if (!file) {
            errMsg.push(MSG_NO_FILE);

        } else {
            for (let i=0; i < validate.length; i++) {
                const validator = validate[i];
                errMsg = await this.getErrMsg(file, validator);;
            }
        }

        const validState: IState = { errMsg, isValid: !errMsg.length };
        this.setState(validState);
        onFileChange?.({ ...validState, file });
    }

    async getErrMsg(file: File, validator: AValidationConfig) {
        let errMsg: string[] = [];

        // a custom function which return error messages
        if (typeof validator === 'function') {
            const msgs = await validator(file);
            const isValid = msgs === true;
            errMsg = isValid ? errMsg : errMsg.concat(msgs as string[]);

        // a single rule/msg config
        } else {
            const { rule, msg } = validator;
            const isValid = rule(file);
            if (!isValid) errMsg.push(msg);
        }

        return errMsg;
    }
}
