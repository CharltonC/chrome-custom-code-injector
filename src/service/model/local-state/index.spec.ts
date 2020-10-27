import { LocalState } from '.';

describe('Local State (Non-Persisting)', () => {
    it('should return default value', () => {
        expect(new LocalState()).toEqual({
            currView: 'LIST',
            searchedText: '',
            searchedRules: null,
            isAllRowsSelected: false,
            currListItem: null,
            currModalId: null,
            targetEditItem: null,
            isTargetEditItemIdValid: false,
            isTargetEditItemValValid: false,
            targetRmvItemIdx: null,
            targetRmvItemParentIdx: null,
        });
    });
});