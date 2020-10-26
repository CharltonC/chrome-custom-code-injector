import { AppState } from '../../../service/model/app-state';
import { StateHandler } from '../../../service/state-handler';
import { IAppProps } from '../../../service/handle/state/type';

export type IProps = IAppProps<AppState, StateHandler>;