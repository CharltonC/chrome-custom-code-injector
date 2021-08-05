import { RuleIdCtxState } from ".";

describe('Rule Id context state', () => {
    it('should instantiate', () => {
        const idCtxState = new RuleIdCtxState();
        expect(idCtxState).toEqual({});
    });

    it('should instantiate with argument', () => {
        const mockIdCtx = {
            hostId: 'host',
            pathId: 'path',
        };
        const idCtxState = new RuleIdCtxState(mockIdCtx);
        expect(idCtxState).toEqual(mockIdCtx);
    });
});