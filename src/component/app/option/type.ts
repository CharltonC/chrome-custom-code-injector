import { IAppProps } from '../../../handle/state/type';
import { AppState } from '../../../model/app-state';
import { IStateHandle } from '../../../handle/app-state/type';

export interface IProps extends IAppProps<AppState, IStateHandle> {}