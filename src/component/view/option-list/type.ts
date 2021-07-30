import { IAppProps } from '../../../handle/state/type';
import { AppState } from '../../../state/model';
import { IStateHandler } from '../../../state/handler/type';
import { IRowComponentProps } from '../../widget/data-grid/type';

export type IProps = IAppProps<AppState, IStateHandler>;

export interface ITbRowProps extends IRowComponentProps {
    commonProps: IProps;
}