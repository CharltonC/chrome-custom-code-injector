import { IAppProps } from '../../../handle/state/type';
import { IAppState } from '../../../state/model/type';
import { IStateHandler } from '../../../state/handler/type';

export type IProps = IAppProps<IAppState, IStateHandler>;