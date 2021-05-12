import { IAppProps } from '../../../service/state-handle/type';
import { AppState } from '../../../model/app-state';
import { IStateHandler } from '../../../service/state-handler/root/type';

export interface IProps extends IAppProps<AppState, IStateHandler> {}