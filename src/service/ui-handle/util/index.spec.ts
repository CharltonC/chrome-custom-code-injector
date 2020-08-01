import { UtilHandle } from '.';

describe('Utility Handle', () => {
    describe('method - cssCls: Get the Class Class based on a base class and a suffix', () => {
        const { cssCls } = UtilHandle.prototype;

        it('should return the css class', () => {
            const MOCK_BASE_CLS: string = 'lorem';
            const MOCK_SUFFIX_CLS: string = 'sum';

            expect(cssCls(MOCK_BASE_CLS, MOCK_SUFFIX_CLS)).toBe(`${MOCK_BASE_CLS} ${MOCK_BASE_CLS}--${MOCK_SUFFIX_CLS}`);
        });
    });
});