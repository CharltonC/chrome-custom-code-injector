import { MemoComponent } from './';

describe('Memo Component', () => {
    let memoCmp: MemoComponent;
    const mockNonEmptyProps = { lorem: 1 };
    const setPropsVal = (val) => {
        (memoCmp as any).props = val;
    };

    beforeEach(() => {
        memoCmp = new MemoComponent({});
    });

    it('should return false when there are no new props', () => {
        setPropsVal(mockNonEmptyProps);
        expect(memoCmp.shouldComponentUpdate({})).toBeFalsy();
    });

    it('should return false when there are no current props', () => {
        setPropsVal({});
        expect(memoCmp.shouldComponentUpdate({})).toBeFalsy();
    });

    it('should return false when all new prop values are the same as current prop values', () => {
        setPropsVal(mockNonEmptyProps);
        expect(memoCmp.shouldComponentUpdate(mockNonEmptyProps)).toBeFalsy();
    });

    it('should return true when one of new prop values is different to the current prop values ', () => {
        setPropsVal(mockNonEmptyProps);
        expect(memoCmp.shouldComponentUpdate({ lorem: 2 })).toBeTruthy();
    });
});
