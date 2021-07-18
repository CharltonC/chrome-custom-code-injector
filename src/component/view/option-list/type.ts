import { IAppProps } from '../../../handle/state/type';
import { AppState } from '../../../app-state/model/app-state';
import { IStateHandler } from '../../../app-state/handler/type';
import { IRowComponentProps } from '../../widget/data-grid/type';

export type IProps = IAppProps<AppState, IStateHandler>;

export interface ITbRowProps extends IRowComponentProps {
    commonProps: IProps;
}