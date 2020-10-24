import { Setting } from '../model/setting';
import { LocalState } from '../model/local-state';
import { setting, rules, localState } from './store';

describe('State', () => {
    it('should return default value', () => {
        expect(setting).toEqual(new Setting());
        expect(rules).toEqual([]);
        expect(localState).toEqual(new LocalState());
    });
});