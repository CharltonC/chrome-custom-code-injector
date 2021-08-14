import { SettingState } from './setting-state';
import { HostRule } from '../../model/rule';
import { LocalState } from './local-state';

export interface IAppState {
    // Persistant: user default config
    setting: SettingState;

    // Persistant: host/path rules
    rules: HostRule[];

    // Non-Persistant (in-memory): local state
    localState: LocalState;
}