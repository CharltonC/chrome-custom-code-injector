import React, { memo } from 'react';
import { jsExecStageList } from '../../../constant/js-exec-stage-list';

import { IconBtn } from '../../base/btn-icon';
import { Checkbox } from '../../base/checkbox';
import { SliderSwitch } from '../../base/checkbox-slider-switch';
import { Dropdown } from '../../base/select-dropdown';
import { NumBadge } from '../../base/num-badge';

import { ITbRowProps } from './type';

export const TbRow: React.FC<any> = memo((props: ITbRowProps) => {
    // Note `dataSrc`
    // - is full set of data (i.e. unpaginated)
    // - can be 1) unaltered results  OR  2) filterd results based on search text  OR  3) Sorted + Unaltered/Filtered
    const { dataSrc, idx, itemLvl, item, nestedItems, classNames, parentItemCtx, commonProps } = props;
    const { appState, appStateManager } = commonProps;
    const { localState } = appState;
    const {
        onRowExpand,
        onRowSelectToggle,

        onHttpsToggle,
        onJsExecStepChange,
        onJsToggle,
        onCssToggle,
        onLibToggle,

        onAddPathModal,
        onEditView,
        onDelHostOrPathModal,
    } = appStateManager;

    // Item
    const { isHost, id, isHttps, title, value, jsExecPhase, isJsOn, isCssOn, isLibOn, paths } = item;
    const parentItem = parentItemCtx?.item;
    const hostId = isHost ? id : parentItem?.id;
    const pathId = isHost ? null : id;
    const ruleIdCtx = isHost ? { hostId } : { hostId, pathId };

    // ID/Class names
    const ID_SUFFIX = `${itemLvl}-${idx}`;
    const { REG_ROW, NESTED_ROW, NESTED_GRID } = classNames;

    // DataGrid
    // - Expand
    const { selectState, expdRowId } = localState.listView.dataGrid;
    const isRowExp = isHost && hostId === expdRowId;

    // - Selected
    const { areAllRowsSelected, selectedRowKeyCtx } = selectState;
    const isSelected = areAllRowsSelected || hostId in selectedRowKeyCtx;
    const isDelDisabled = areAllRowsSelected || !!Object.entries(selectedRowKeyCtx).length;

    return <>
            <tr className={REG_ROW}>
                <td>
                    { isHost &&
                    <Checkbox
                        id={`check-${ID_SUFFIX}`}
                        clsSuffix=""
                        checked={isSelected}
                        onChange={() => onRowSelectToggle({ dataSrc, hostId })}
                        />}
                </td><td>{ isHost &&
                    <SliderSwitch
                        id={`https-${ID_SUFFIX}`}
                        checked={isHttps}
                        disabled={isDelDisabled}
                        onChange={() => onHttpsToggle({ hostId })}
                        />}
                </td><td>
                    <div>{ isHost &&
                        <>
                            <IconBtn
                                icon="arrow-rt"
                                clsSuffix={`arrow-rt ${isRowExp ? 'open': ''}`}
                                disabled={!paths?.length}
                                onClick={() => onRowExpand({ hostId })}
                                />
                            <NumBadge total={paths?.length} />
                        </>}
                        <span className="datagrid__cell datagrid__cell--id">{title}</span>
                    </div>
                </td><td>
                    <span className="datagrid__cell datagrid__cell--addr">
                        {value}
                    </span>
                </td><td>
                    <Dropdown
                        id={`select-${ID_SUFFIX}`}
                        list={jsExecStageList}
                        selectIdx={jsExecPhase}
                        className="dropdown__select--cell"
                        disabled={isDelDisabled}
                        onSelect={(arg) => onJsExecStepChange({ ...arg, ...ruleIdCtx})}
                        />
                </td><td>
                    <SliderSwitch
                        id={`js-${ID_SUFFIX}`}
                        defaultChecked={isJsOn}
                        disabled={isDelDisabled}
                        onChange={() => onJsToggle(ruleIdCtx)}
                        />
                </td><td>
                    <SliderSwitch
                        id={`css-${ID_SUFFIX}`}
                        defaultChecked={isCssOn}
                        disabled={isDelDisabled}
                        onChange={() => onCssToggle(ruleIdCtx)}
                        />
                </td><td>
                    <SliderSwitch
                        id={`lib-${ID_SUFFIX}`}
                        defaultChecked={isLibOn}
                        disabled={isDelDisabled}
                        onChange={() => onLibToggle(ruleIdCtx)}
                        />
                </td><td>{ isHost &&
                    <IconBtn
                        icon="add"
                        theme="gray"
                        title="add path rule"
                        disabled={isDelDisabled}
                        onClick={() => onAddPathModal(ruleIdCtx)}
                        />}
                </td><td>
                    <IconBtn
                        icon="edit"
                        theme="gray"
                        disabled={isDelDisabled}
                        onClick={() => onEditView(ruleIdCtx)}
                        />
                </td><td>
                    <IconBtn
                        icon="delete"
                        theme="gray"
                        disabled={isDelDisabled}
                        onClick={() => onDelHostOrPathModal(ruleIdCtx)}
                        />
                </td>
            </tr>{ nestedItems && isRowExp &&
            <tr className={NESTED_ROW}>
                <td colSpan={11}>
                    <table className={NESTED_GRID}>
                        <tbody>
                            {nestedItems}
                        </tbody>
                    </table>
                </td>
            </tr>}
    </>;
});