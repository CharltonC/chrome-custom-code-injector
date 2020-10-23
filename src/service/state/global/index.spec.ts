import Setting from '../../model/setting';
import GlobalState from '.';

describe('Global State (Persisting)', () => {
    it('should return default value', () => {
        expect(new GlobalState()).toEqual({
            setting: new Setting(),
            rules: []
        });
    });
});