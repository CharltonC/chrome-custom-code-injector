import { IAppProps } from '../../../handle/store/type';
import { AppState } from '../../../model/app-state';
import { IStateHandler } from '../../../handle/state/root/type';
import { IRowComponentProps } from '../../widget/data-grid/type';

export type IProps = IAppProps<AppState, IStateHandler>;

export interface ITbRowProps extends IRowComponentProps {
    commonProps: IProps;
}