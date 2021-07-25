import { RowSelectHandle } from '../../row-select';
import { HandlerHelper } from '../helper';
import { StateHandle } from '../../state';
import { AppState } from '../../../model/app-state';

const rowSelectHandle = new RowSelectHandle();

export class LibDatagridStateHandler extends StateHandle.BaseStateHandler {
    onLibSort({ localState }: AppState, payload) {
        const { sortOption } = payload;
        return {
            localState: {
                ...localState,
                libDataGrid: {
                    ...localState.libDataGrid,
                    sortOption
                }
            }
        }
    }

    onLibRowSelectToggle({ localState }: AppState, rowIdx: number, totalRules: number) {
        const { libDataGrid } = localState;
        const { pgnOption, pgnState, selectState } = libDataGrid;
        const { startRowIdx, endRowIdx } = HandlerHelper.getRowIndexCtx(totalRules, pgnOption, pgnState);

        const rowSelectState = rowSelectHandle.getState({
            isAll: false,
            currState: selectState,
            rowsCtx: { startRowIdx, endRowIdx, rowIdx }
        });

        return {
            localState: {
                ...localState,
                libDataGrid: {
                    ...libDataGrid,
                    selectState: rowSelectState
                }
            }
        };
    }

    onLibRowsSelectToggle({ localState }: AppState): Partial<AppState> {
        const { libDataGrid } = localState;
        const rowSelectState = rowSelectHandle.getState({
            isAll: true,
            currState: libDataGrid.selectState
        });

        return {
            localState: {
                ...localState,
                libDataGrid: {
                    ...libDataGrid,
                    selectState: rowSelectState
                }
            }
        };
    }
}
