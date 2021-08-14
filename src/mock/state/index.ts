import { createMockRules } from '../data';
import { LocalState } from '../../model/local-state';
import { SettingState } from '../../model/setting-state';
import { AppState } from '../../model/app-state';

export const createMockAppState = (): AppState => {
    const rules = createMockRules();
    const setting = new SettingState();
    const localState = new LocalState(rules.length);
    return {
        rules,
        setting,
        localState,
    };
};