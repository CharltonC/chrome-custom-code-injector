import { Setting } from '../model/setting';
import { HostRuleConfig } from '../model/rule-config';
import { LocalState } from '../model/local-state';

// Persistant: user default config
export const setting: Setting = new Setting();

// Persistant: host/path rules
export const rules: HostRuleConfig[] = [];

// Non-Persistant (in-memory): local state
export const localState = new LocalState();