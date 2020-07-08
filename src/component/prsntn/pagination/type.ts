import * as pgnHandleType from '../../../service/handle/paginate/type';

export interface IProps extends pgnHandleType.IRecordCtx, pgnHandleType.IRelPage {
    pageList: number[];
    pageSelectIdx: number;
    increment: number[];
    incrementIdx: number;
    onPgnChange: (...args: any[]) => any;
}

export type TSelectEvt = React.ChangeEvent<HTMLSelectElement>;

export type TEvtHandler = (...args: any[]) => void;