import { BaseRuleConfig, PathRuleConfig, HostRuleConfig, LibRuleConfig } from '.';

describe('Rule Config Model', () => {
    const mockId = 'id';
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
        expect(new PathRuleConfig(mockId, mockValue)).toEqual({
            ...(new BaseRuleConfig()),
            id: mockId,
            value: mockValue,
            jsCode: '',
            cssCode: '',
            libs: [],
            activeTabIdx: 0
        });

    });

    it('should return default values for `HostRuleConfig`', () => {
        expect(new HostRuleConfig(mockId, mockValue)).toEqual({
            ...(new BaseRuleConfig()),
            ...(new PathRuleConfig(mockId, mockValue)),
            isHttps: false,
            paths: []
        });
    });

    it('should return default values for `LibRuleConfig`', () => {
        expect(new LibRuleConfig(mockId, mockValue)).toEqual({
            id: mockId,
            value: mockValue,
            isOn: false,
            isAsync: true,
        });
    });
});