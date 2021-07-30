import { IAppProps } from '../../../handle/state/type';
import { AppState } from '../../../state/model';
import { IStateHandler } from '../../../state/handler/type';

export interface IProps extends IAppProps<AppState, IStateHandler> {}