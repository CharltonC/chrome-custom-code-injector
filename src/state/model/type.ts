import { SettingState } from './setting-state';
import { HostRuleConfig } from '../../data/model/rule-config';
import { LocalState } from './local-state';

export interface IAppState {
    // Persistant: user default config
    setting: SettingState;

    // Persistant: host/path rules
    rules: HostRuleConfig[];

    // Non-Persistant (in-memory): local state
    localState: LocalState;
}