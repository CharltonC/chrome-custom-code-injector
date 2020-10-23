import Setting from '../../model/setting';
import { HostRuleConfig } from '../../model/rule-config';

export default class GlobalState {
    // user default config
    setting: Setting = new Setting();

    // host/path rules
    rules: HostRuleConfig[] = [];
}