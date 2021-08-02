import { createMockRules } from '../../data/mock';
import { LocalState } from '../model/local-state';
import { SettingState } from '../model/setting-state';
import { IAppState } from '../model/type';

export const createMockAppState = (): IAppState => {
    const rules = createMockRules();
    const setting = new SettingState();
    const localState = new LocalState(rules.length);
    return {
        rules,
        setting,
        localState,
    };
};