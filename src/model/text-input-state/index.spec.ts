import { TextInputState } from ".";

describe('Text Input State', () => {
    it('should instantiate without argument', () => {
        const textInputState = new TextInputState();
        expect(textInputState).toEqual({
            value: '',
            isValid: null,
            errMsg: []
        });
    });

    it('should instantiate with argument', () => {
        const mockArg = {
            value: 'lorem',
            isValid: true,
            errMsg: ['abc']
        };
        const textInputState = new TextInputState(mockArg);
        expect(textInputState).toEqual(mockArg);
    });
});