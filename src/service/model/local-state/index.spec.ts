import { LocalState } from '.';

describe('Local State (Non-Persisting)', () => {
    it('should return default value', () => {
        expect(new LocalState()).toEqual({
            searchedText: '',
            searchedRules: null,
            selectedRowKeys: {},
            pgnPageIdx: 0,
            pgnIncrmIdx: 0,
            pgnItemStartIdx: 0,
            pgnItemEndIdx: null,

            currView: 'LIST',
            areAllRowsSelected: false,
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