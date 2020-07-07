import * as pgnHandleType from '../../../service/handle/paginate/type';

export interface IProps extends pgnHandleType.IRecordCtx, pgnHandleType.IRelPage {
    pageList: number[];
    pageSelectIdx: number;
    increment: number[];
    incrementIdx: number;
    onPgnChanged: (...args: any[]) => any;
}

export type TSelectEvt = React.ChangeEvent<HTMLSelectElement>;