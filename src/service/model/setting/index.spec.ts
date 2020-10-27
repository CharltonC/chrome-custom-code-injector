import { BaseRuleConfig } from '../rule-config';
import { Setting } from '.';

describe('Setting Model', () => {
    it('should return default values', () => {
        expect(new Setting()).toEqual({
            ...(new BaseRuleConfig()),
            showDeleteModal: true,
            resultsPerPage: 20,
            isHttps: false,
            isRegex: false,
        });
    });
});