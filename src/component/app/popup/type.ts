import { IAppProps } from '../../../handle/state/type';
import { IStateHandle } from '../../../handle/app-state/type';
import { HostRule } from '../../../model/rule';

// This is slightyly different to the one in Option App
// - the App State here is different containing less properties
// - the State Handle is same
export interface IProps extends IAppProps<IAppState, IStateHandle> {}

export interface IAppState {
    rules: HostRule[];
    url: URL;
}