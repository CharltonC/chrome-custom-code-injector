import { IAppProps } from '../../../handle/state/type';
import { IAppState } from '../../../state/model/type';
import { IStateHandler } from '../../../state/manager/type';

export type IProps = IAppProps<IAppState, IStateHandler>;