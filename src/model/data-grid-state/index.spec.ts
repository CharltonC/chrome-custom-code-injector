import { DataGridState } from '.';

describe('Data Grid State', () => {
    it('should instantiate with pagination option and state when a valid total record is provided', () => {
        const mockPgnArg = { totalRecord: 2 };
        const { pgnOption, pgnState } = new DataGridState(mockPgnArg);
        expect(pgnOption).toBeTruthy();
        expect(pgnState).toBeTruthy();
    });

    it('should instantiate with pagination option and state when a valid total record and option are provided', () => {
        const mockPgnOption = { maxSpread: 10 };
        const mockPgnArg = { totalRecord: 2, pgnOption: mockPgnOption };
        const { pgnOption, pgnState } = new DataGridState(mockPgnArg);
        expect(pgnOption.maxSpread).toBe(10);
        expect(pgnState).toBeTruthy();
    });

    it('should instantiate without pagination option and state when an invalid total record is provided', () => {
        const mockPgnArg = { totalRecord: -1 };
        const { pgnOption, pgnState } = new DataGridState(mockPgnArg);
        expect(pgnOption).toBeFalsy();
        expect(pgnState).toBeFalsy();
    });

    it('should instantiate without pagination option and state', () => {
        const { pgnOption, pgnState } = new DataGridState();
        expect(pgnOption).toBeFalsy();
        expect(pgnState).toBeFalsy();
    });
});