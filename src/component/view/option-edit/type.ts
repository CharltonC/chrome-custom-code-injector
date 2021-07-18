import { IAppProps } from '../../../handle/store/type';
import { AppState } from '../../../model/app-state';
import { IStateHandler } from '../../../handle/state/root/type';

export type IProps = IAppProps<AppState, IStateHandler>;