import { RowSelectHandle } from '../../row-select';
import { StateHandle } from '../../state';
import { AppState } from '../../../model/app-state';
import * as TSort from '../../sort/type';
import { IStateHandler } from '../type';

const rowSelectHandle = new RowSelectHandle();

export class GeneralStateHandler extends StateHandle.BaseStateHandler {
    onSort({ localState }: AppState, { sortOption }: { sortOption: TSort.IOption, sortState: TSort.IState }) {
        return {
            localState: {
                ...localState,
                sortOption
            }
        };
    }

    onRowSelectToggle({ localState }: AppState, rowIdx: number, totalRules: number) {
        const { pgnOption, pgnState } = localState;
        const { getRowIndexCtx } = (this as unknown as IStateHandler).reflect;
        const { startRowIdx, endRowIdx } = getRowIndexCtx(totalRules, pgnOption, pgnState);

        const rowSelectState = rowSelectHandle.getState({
            isAll: false,
            currState: localState.selectState,
            rowsCtx: { startRowIdx, endRowIdx, rowIdx }
        });

        return {
            localState: { ...localState, selectState: rowSelectState }
        };
    }

    onRowsSelectToggle({ localState }: AppState): Partial<AppState> {
        const rowSelectState = rowSelectHandle.getState({
            isAll: true,
            currState: localState.selectState
        });

        return {
            localState: { ...localState, selectState: rowSelectState }
        };
    }

}