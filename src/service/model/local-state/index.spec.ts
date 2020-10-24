import { LocalState } from '.';

describe('Local State (Non-Persisting)', () => {
    it('should return default value', () => {
        expect(new LocalState()).toEqual({
            currView: 'LIST',
            currSearchText: '',
            isAllRowsSelected: false,
            currListItemIdx: 0,
            currNestedListItemIdx: 0,
            currModalId: null,
            isModalConfirmDisabled: false,
        });
    });
});