import { IAppProps } from '../../../handle/state/type';
import { AppState } from '../../../app-state/model/app-state';
import { IStateHandler } from '../../../app-state/handler/type';

export interface IProps extends IAppProps<AppState, IStateHandler> {}