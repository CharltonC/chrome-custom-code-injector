import React, { memo } from 'react';
import { UtilHandle } from '../../../service/handle/util';
import { IProps } from './type';

const { cssCls } = UtilHandle.prototype;

export const CLS_BASE = 'file-input';

export const FileInput: React.FC<IProps> = memo((props: IProps) => {
    const { id, clsSuffix, fileType, ...inputProps } = props;
    const CLS_NAME: string = cssCls(CLS_BASE, clsSuffix);
    return (
        <input
            type="file"
            id={id}
            className={CLS_NAME}
            accept={fileType}
            {...inputProps}
            />
    );
});