import { Setting } from '../setting';
import { LocalState } from '../local-state';
import { AppState } from '.';

describe('State', () => {
    it('should return default value', () => {
        const { setting, rules, localState } = new AppState();
        expect(setting).toEqual(new Setting());
        expect(rules).toEqual([]);
        expect(localState).toEqual(new LocalState());
    });
});