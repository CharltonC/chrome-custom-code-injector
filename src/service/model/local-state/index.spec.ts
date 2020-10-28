import { LocalState } from '.';

describe('Local State (Non-Persisting)', () => {
    it('should return default value', () => {
        expect(new LocalState()).toEqual({
            currView: 'LIST',
            searchedText: '',
            searchedRules: null,
            isAllRowsSelected: false,
            expdRowId: null,
            currListItem: null,
            currModalId: null,
            allowModalConfirm: false,
            targetItem: null,
            isTargetItemIdValid: false,
            isTargetItemValValid: false,
            targetChildItemIdx: null,
            targetItemIdx: null,
        });
    });
});