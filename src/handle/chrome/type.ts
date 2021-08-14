import { SettingState } from '../../model/setting-state';
import { HostRule } from '../../model/rule';

export interface IState {
    rules: HostRule[];
    settings: SettingState;
}

export type TStorageCallack = (arg: AObj) => IState;
