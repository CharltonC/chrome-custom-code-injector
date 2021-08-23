import { IAppProps } from '../../../handle/state/type';
import { AppState } from '../../../model/app-state';
import { IStateHandle } from '../../../handle/app-state/type';
import { IRowComponentProps } from '../../widget/data-grid/type';

export type IProps = IAppProps<AppState, IStateHandle>;

export interface ITbRowProps extends IRowComponentProps {
    commonProps: IProps;
}