import { SettingState } from '../setting-state';
import { HostRule } from '../rule';
import { LocalState } from '../local-state';

export class AppState {
    // Persistant: user default config
    setting: SettingState;

    // Persistant: host/path rules
    rules: HostRule[];

    // Non-Persistant (in-memory): local state
    localState: LocalState;
}