import { SettingState } from '../../model/setting-state';
import { HostRule } from '../../model/rule';

export interface IState {
    rules: HostRule[];
    setting: SettingState;
}

export type AStorageCallack = (arg: AObj) => IState;
