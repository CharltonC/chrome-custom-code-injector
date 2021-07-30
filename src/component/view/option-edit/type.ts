import { IAppProps } from '../../../handle/state/type';
import { AppState } from '../../../state/model';
import { IStateHandler } from '../../../state/handler/type';

export type IProps = IAppProps<AppState, IStateHandler>;