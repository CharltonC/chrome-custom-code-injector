import { IAppProps } from '../../../handle/state/type';
import { IAppState } from '../../../state/model/type';
import { IStateHandler } from '../../../state/handler/type';
import { IRowComponentProps } from '../../widget/data-grid/type';

export type IProps = IAppProps<IAppState, IStateHandler>;

export interface ITbRowProps extends IRowComponentProps {
    commonProps: IProps;
}