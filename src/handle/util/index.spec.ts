import { UtilHandle } from '.';

describe('Utility Handle', () => {
    const { cssCls, createId } = UtilHandle;

    describe('method - cssCls: Get the Class Class based on a base class and a suffix', () => {
        const MOCK_BASE_CLS: string = 'lorem';

        it('should return the base css class if suffix is not provided or empty', () => {
            expect(cssCls(MOCK_BASE_CLS)).toBe(MOCK_BASE_CLS);
            expect(cssCls(MOCK_BASE_CLS, '')).toBe(MOCK_BASE_CLS);
        });

        it('should return the css class when given a string suffix', () => {
            expect(cssCls(MOCK_BASE_CLS, 'sum')).toBe(`${MOCK_BASE_CLS} ${MOCK_BASE_CLS}--sum`);
            expect(cssCls(MOCK_BASE_CLS, '1 2')).toBe(`${MOCK_BASE_CLS} ${MOCK_BASE_CLS}--1 ${MOCK_BASE_CLS}--2`);
            expect(cssCls(MOCK_BASE_CLS, '  1  2')).toBe(`${MOCK_BASE_CLS} ${MOCK_BASE_CLS}--1 ${MOCK_BASE_CLS}--2`);
        });
    });

    describe('method - createId: Create an unique ID', () => {
        const mockNumberId = '__number';
        const mockTimeId = 'time';

        beforeEach(() => {
            spyOn(Math, 'random').and.returnValue(mockNumberId);
            spyOn(Date, 'now').and.returnValue(mockTimeId);
        });

        it('should return unique ID', () => {
            expect(createId()).toBe('numbertime');
        });
    });
});