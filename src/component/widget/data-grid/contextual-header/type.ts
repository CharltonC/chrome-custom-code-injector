import { ReactElement } from 'react';
import * as THeaderGrpHandle from '../../../../handle/header-group/type';
import * as TSortBtn from '../../../base/btn-sort/type';
import * as TDataGrid from '../type';

export interface IProps extends React.HTMLAttributes<HTMLElement> {
    type?: 'table' | 'list';
    data: Record<string, any>[];
    rows: TTbHeaderRows | TListHeaderRows;
    sortBtnProps?: (sortKey: string) => TSortBtn.IProps;
    commonProps?: {
        props: TDataGrid.IProps;
        state: TDataGrid.IState;
        [k: string]: any;
    };
}

export type TListHeaderRows = THeaderGrpHandle.ICtxListHeader<TTitle>;
export type TTbHeaderRows = THeaderGrpHandle.ICtxTbHeader<TTitle>;
export type TTitle = string | JSX.Element | ReactElement | ((...args: any[]) => ReactElement);
