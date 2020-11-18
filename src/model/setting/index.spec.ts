import { Setting } from '.';

describe('Setting Model', () => {
    it('should return default values', () => {
        expect(new Setting()).toEqual({
            showDeleteModal: true,
            resultsPerPageIdx: 0,
            defRuleConfig: {
                isHttps: false,
                isJsOn: false,
                isCssOn: false,
                isLibOn: false,
                jsExecPhase: 1
            }
        });
    });
});