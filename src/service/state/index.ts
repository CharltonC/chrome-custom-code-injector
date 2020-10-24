import { Setting } from '../model/setting';
import { HostRuleConfig } from '../model/rule-config';
import { LocalState } from '../model/local-state';

export class AppState {
    // Persistant: user default config
    setting: Setting = new Setting();

    // Persistant: host/path rules
    rules: HostRuleConfig[] = [];

    // Non-Persistant (in-memory): local state
    localState = new LocalState();
}