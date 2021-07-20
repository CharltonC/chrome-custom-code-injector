import { resultsPerPage } from '../../../constant/result-per-page';
import { HostRuleConfig } from '../rule-config';
import { RuleValidState } from '../rule-valid-state';
import { Setting } from '../setting';
import * as TSort from '../../../handle/sort/type';
import * as TPgn from '../../../handle/pagination/type';
import * as TRowSelect from '../../../handle/row-select/type';
import { modalDelTarget } from '../del-target';
import { TextInputState } from '../text-input';

const { resultsPerPageIdx } = new Setting();

export class LocalState {
    //// SEARCH
    searchedText = '';
    searchedRules: HostRuleConfig[] = null;

    //// MODAL
    activeModalId: string = null;
    isModalConfirmBtnEnabled = false;
    exportFilenameInput = new TextInputState();
    importFilePath: File = null;
    modalDelTarget = new modalDelTarget();
    titleInput = new TextInputState();
    hostOrPathInput = new TextInputState();
    hostIdxForNewPath: number = null; // for targeting the host where new path will be added to

    // * Views
    // TODO: type
    /**
     * {
        isHost: null,
        idx: null,
        childIdx: null,
    };
     */
    editViewTarget = null;

    //// DATA GRID ROWS
    // * rows used by Modal Delete Confirm `onDelModalConfirm`
    // - temp storage which points to the current full set of sorted data if exist or plain data (either searched or non-search)
    // - unpaginated
    dataSrc: HostRuleConfig[] = null;

    // Sort
    sortOption: Partial<TSort.IOption> = {
        reset: true }
    ;

    // Select
    selectState: TRowSelect.IState = {
        areAllRowsSelected: false,
        selectedRowKeys: {}
    };

    // Expand (only for allow 1 row to be expanded at the same time)
    expdRowId: string = null;

    // Pagination
    pgnOption = {
        increment: resultsPerPage,
        incrementIdx: resultsPerPageIdx
    } as TPgn.IOption;

    pgnState = {
        curr: 0,
        startIdx: 0,
        endIdx: null
    } as TPgn.IState;
}