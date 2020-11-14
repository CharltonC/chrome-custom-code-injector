import { LocalState } from '.';

describe('Local State (Non-Persisting)', () => {
    it('should return default value', () => {
        expect(new LocalState()).toEqual({
            searchedText: '',
            searchedRules: null,
            sortedData: null,
            selectedRowKeys: {},
            pgnPageIdx: 0,
            pgnIncrmIdx: 0,
            pgnItemStartIdx: 0,
            pgnItemEndIdx: null,
            importFile: null,
            exportFileName: null,

            currView: 'LIST',
            areAllRowsSelected: false,
            expdRowId: null,
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