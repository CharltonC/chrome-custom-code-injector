import { IAppProps } from '../../../handle/state/type';
import { AppState } from '../../../model/app-state';
import { IStateHandler } from '../../../handle/app-state/type';

export type IProps = IAppProps<AppState, IStateHandler>;