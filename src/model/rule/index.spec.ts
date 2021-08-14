import { BaseRule, PathRule, HostRule, LibRule } from '.';

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
        expect(new BaseRule()).toEqual({
            isJsOn: false,
            isCssOn: false,
            isLibOn: false,
            codeExecPhase: 0
        });
    });

    it('should return default values for `PathRule`', () => {
        expect(new PathRule(mockTitle, mockValue)).toEqual({
            ...(new BaseRule()),
            id: '',
            isExactMatch: false,
            title: mockTitle,
            value: mockValue,
            jsCode: '',
            cssCode: '',
            libs: [],
            activeTabIdx: 0
        });

    });

    it('should return default values for `HostRule`', () => {
        expect(new HostRule(mockTitle, mockValue)).toEqual({
            ...(new BaseRule()),
            ...(new PathRule(mockTitle, mockValue)),
            id: '',
            isHost: true,
            isHttps: false,
            paths: []
        });
    });

    it('should return default values for `LibRule`', () => {
        expect(new LibRule(mockTitle, mockValue)).toEqual({
            id: '',
            type: 'js',
            title: mockTitle,
            value: mockValue,
            isOn: false,
            isAsync: true,
        });
    });
});