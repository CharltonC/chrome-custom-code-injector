import { MemoComponent } from './';

describe('Memo Component', () => {
    let memoCmp: MemoComponent;

    beforeEach(() => {
        memoCmp = new MemoComponent({});
    });

    describe('Check State Changes', () => {
        const mockEmptyProps = {};
        const mockState = { lorem: 1 };
        const setStateVal = (val) => {
            (memoCmp as any).state = val;
        };

        it('should return true when new states are not empty and are different to current state values', () => {
            setStateVal(mockState);
            expect(memoCmp.shouldComponentUpdate(mockEmptyProps, { lorem: 2})).toBeTruthy();
        });
    });

    describe('Check Props Changes', () => {
        const mockProps = { lorem: 1 };
        const mockEmptyState = {};
        const setPropsVal = (val) => {
            (memoCmp as any).props = val;
        };

        it('should return false when there are no new props', () => {
            setPropsVal(mockProps);
            expect(memoCmp.shouldComponentUpdate({}, mockEmptyState)).toBeFalsy();
        });

        it('should return false when there are no current props', () => {
            setPropsVal({});
            expect(memoCmp.shouldComponentUpdate({}, mockEmptyState)).toBeFalsy();
        });

        it('should return false when all new prop values are the same as current prop values', () => {
            setPropsVal(mockProps);
            expect(memoCmp.shouldComponentUpdate(mockProps, mockEmptyState)).toBeFalsy();
        });

        it('should return true when one of new prop values is different to the current prop values ', () => {
            setPropsVal(mockProps);
            expect(memoCmp.shouldComponentUpdate({ lorem: 2 }, mockEmptyState)).toBeTruthy();
        });
    });
});
