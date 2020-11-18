import { IAppProps } from '../../../service/handle/state-handle/type';
import { AppState } from '../../../model/app-state';
import { IStateHandler } from '../../../service/state-handler/root/type';

export type IProps = IAppProps<AppState, IStateHandler>;