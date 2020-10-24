import Setting from '../../model/setting';
import { setting, rules } from '.';

describe('Global State (Persisting)', () => {
    it('should return default value', () => {
        expect(setting).toEqual(new Setting());
        expect(rules).toEqual([]);
    });
});