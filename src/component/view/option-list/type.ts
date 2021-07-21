import { IAppProps } from '../../../handle/state/type';
import { AppState } from '../../../model/app-state';
import { IStateHandler } from '../../../handle/app-state/type';
import { IRowComponentProps } from '../../widget/data-grid/type';

export type IProps = IAppProps<AppState, IStateHandler>;

export interface ITbRowProps extends IRowComponentProps {
    commonProps: IProps;
}