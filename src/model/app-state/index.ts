import { SettingState } from '../setting-state';
import { HostRuleConfig } from '../rule-config';
import { LocalState } from '../local-state';

export class AppState {
    // Persistant: user default config
    setting = new SettingState();

    // Persistant: host/path rules
    rules: HostRuleConfig[] = [];

    // Non-Persistant (in-memory): local state
    localState = new LocalState();
}