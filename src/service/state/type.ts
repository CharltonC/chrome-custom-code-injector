import { LocalState } from '../model/local-state';
import { HostRuleConfig } from '../model/rule-config';
import { Setting } from '../model/setting';

export interface IAppState {
    localState: LocalState;
    setting: Setting;
    rules: HostRuleConfig[];
}
