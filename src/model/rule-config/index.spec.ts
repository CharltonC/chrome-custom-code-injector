import { BaseRuleConfig, PathRuleConfig, HostRuleConfig, LibRuleConfig } from '.';

const mockId = '';
jest.mock('../../handle/util', () => ({
    UtilHandle: {
        createId: () => mockId
    }
}));

describe('Rule Config Model', () => {
    const mockTitle = 'title';
    const mockValue = 'value';

    it('should return default values for `BaseRuleCofig`', () => {
        expect(new BaseRuleConfig()).toEqual({
            isJsOn: false,
            isCssOn: false,
            isLibOn: false,
            jsExecPhase: 1
        });
    });

    it('should return default values for `PathRuleConfig`', () => {
        expect(new PathRuleConfig(mockTitle, mockValue)).toEqual({
            ...(new BaseRuleConfig()),
            id: '',
            title: mockTitle,
            value: mockValue,
            jsCode: '',
            cssCode: '',
            libs: [],
            activeTabIdx: 0
        });

    });

    it('should return default values for `HostRuleConfig`', () => {
        expect(new HostRuleConfig(mockTitle, mockValue)).toEqual({
            ...(new BaseRuleConfig()),
            ...(new PathRuleConfig(mockTitle, mockValue)),
            id: '',
            isHost: true,
            isHttps: false,
            paths: []
        });
    });

    it('should return default values for `LibRuleConfig`', () => {
        expect(new LibRuleConfig(mockTitle, mockValue)).toEqual({
            id: '',
            title: mockTitle,
            value: mockValue,
            isOn: false,
            isAsync: true,
        });
    });
});