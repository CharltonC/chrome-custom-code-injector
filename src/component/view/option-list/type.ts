import { IAppProps } from '../../../service/handle/state/type';
import { AppState } from '../../../service/model/app-state';
import { IStateHandler } from '../../../service/state-handler/root/type';
import { IRowComponentProps } from '../../widget/data-grid/type';

export type IProps = IAppProps<AppState, IStateHandler>;

export interface ITbRowProps extends IRowComponentProps {
    commonProps: IProps;
}