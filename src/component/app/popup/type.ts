import { IAppProps } from '../../../handle/state/type';
import { AppState } from '../../../model/app-state';
import { IStateHandle } from '../../../handle/app-state/type';

export interface IProps extends IAppProps<AExtendedAppState, IStateHandle> {}

export interface AExtendedAppState extends AppState {
    url: URL;
}