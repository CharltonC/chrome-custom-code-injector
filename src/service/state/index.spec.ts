import { Setting } from '../model/setting';
import { LocalState } from '../model/local-state';
import { AppState } from '.';

describe('State', () => {
    it('should return default value', () => {
        const { setting, rules, localState } = new AppState();
        expect(setting).toEqual(new Setting());
        expect(rules).toEqual([]);
        expect(localState).toEqual(new LocalState());
    });
});