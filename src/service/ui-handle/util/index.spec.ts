import { UtilHandle } from '.';

describe('Utility Handle', () => {
    describe('method - cssCls: Get the Class Class based on a base class and a suffix', () => {
        const { cssCls } = UtilHandle.prototype;

        it('should return the css class when given a string suffix', () => {
            const MOCK_BASE_CLS: string = 'lorem';
            const MOCK_SUFFIX_CLS: string = 'sum';

            expect(cssCls(MOCK_BASE_CLS, MOCK_SUFFIX_CLS)).toBe(`${MOCK_BASE_CLS} ${MOCK_BASE_CLS}--${MOCK_SUFFIX_CLS}`);
        });

        it('should return the css class when given an array of suffix', () => {
            const MOCK_BASE_CLS: string = 'lorem';
            const MOCK_SUFFIX_CLS: string[] = ['1', '2'];

            expect(cssCls(MOCK_BASE_CLS, MOCK_SUFFIX_CLS))
            .toBe(`${MOCK_BASE_CLS} ${MOCK_BASE_CLS}--1 ${MOCK_BASE_CLS}--2`);
        });
    });
});