import { IAppProps } from '../../../service/store-handle/type';
import { AppState } from '../../../model/app-state';
import { IStateHandler } from '../../../service/state-handler/root/type';

export type IProps = IAppProps<AppState, IStateHandler>;