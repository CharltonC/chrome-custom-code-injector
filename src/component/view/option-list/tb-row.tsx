import React, { memo } from 'react';
import { codeExecStageList } from '../../../constant/code-exec-stage-list';
import { hintMsgSet } from '../../../constant/hint-msg-set';

import { IconBtn } from '../../base/btn-icon';
import { Checkbox } from '../../base/checkbox';
import { IconSwitch } from '../../base/checkbox-icon-switch';
import { SliderSwitch } from '../../base/checkbox-slider-switch';
import { Dropdown } from '../../base/select-dropdown';
import { NumBadge } from '../../base/num-badge';

import { ITbRowProps } from './type';

export const TbRow: React.FC<any> = memo((props: ITbRowProps) => {
    // Note `dataSrc`
    // - is full set of data (i.e. unpaginated)
    // - can be 1) unaltered results  OR  2) filterd results based on search text  OR  3) Sorted + Unaltered/Filtered
    const { dataSrc, idx, itemLvl, item, nestedItems, classNames, parentItemCtx, commonProps } = props;
    const { appState, appStateHandle } = commonProps;
    const { localState } = appState;
    const {
        onRowExpand,
        onRowSelectToggle,

        onHttpsToggle,
        onExactMatchToggle,
        onJsExecStepChange,
        onJsToggle,
        onCssToggle,
        onLibToggle,

        onAddPathModal,
        onEditView,
        onDelHostOrPathModal,
    } = appStateHandle;

    // Item
    const { isHost, id, isHttps, isExactMatch, title, value, codeExecPhase, isJsOn, isCssOn, isLibOn, paths } = item;
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
                        checked={isSelected}
                        onChange={() => onRowSelectToggle({ dataSrc, hostId })}
                        />}
                </td><td>
                    <div>{ isHost &&
                        <>
                            <IconBtn
                                icon="arrow-rt"
                                title={hintMsgSet.EXPAND_BTN}
                                clsSuffix={`arrow-rt ${isRowExp ? 'open': ''}`}
                                disabled={!paths?.length}
                                onClick={() => onRowExpand({ hostId })}
                                />
                            <NumBadge total={paths?.length} />
                        </>}
                        <span className="datagrid__cell datagrid__cell--id">{title}</span>
                    </div>
                </td><td>{ isHost &&
                    <IconSwitch
                        icon
                        title={hintMsgSet.HTTPS_SWITCH}
                        id={`https-${ID_SUFFIX}`}
                        label="lock-close"
                        checked={isHttps}
                        disabled={isDelDisabled}
                        onChange={() => onHttpsToggle({ hostId })}
                        />}
                    <IconSwitch
                        label="="
                        title={hintMsgSet.EXACT_MATCH_SWITCH}
                        id={`exact-${ID_SUFFIX}`}
                        checked={isExactMatch}
                        disabled={isDelDisabled}
                        onChange={() => onExactMatchToggle(ruleIdCtx)}
                        />
                    <span className="datagrid__cell datagrid__cell--addr">
                        {value}
                    </span>
                </td><td>
                    <Dropdown
                        title={hintMsgSet.CODE_EXEC_STEP_SELECT}
                        id={`select-${ID_SUFFIX}`}
                        list={codeExecStageList}
                        selectIdx={codeExecPhase}
                        className="dropdown__select--cell"
                        disabled={isDelDisabled}
                        onSelect={(arg) => onJsExecStepChange({ ...arg, ...ruleIdCtx})}
                        />
                </td><td>
                    <SliderSwitch
                        title={hintMsgSet.JS_SWITCH}
                        id={`js-${ID_SUFFIX}`}
                        defaultChecked={isJsOn}
                        disabled={isDelDisabled}
                        onChange={() => onJsToggle(ruleIdCtx)}
                        />
                </td><td>
                    <SliderSwitch
                        title={hintMsgSet.CSS_SWITCH}
                        id={`css-${ID_SUFFIX}`}
                        defaultChecked={isCssOn}
                        disabled={isDelDisabled}
                        onChange={() => onCssToggle(ruleIdCtx)}
                        />
                </td><td>
                    <SliderSwitch
                        title={hintMsgSet.LIB_SWITCH}
                        id={`lib-${ID_SUFFIX}`}
                        defaultChecked={isLibOn}
                        disabled={isDelDisabled}
                        onChange={() => onLibToggle(ruleIdCtx)}
                        />
                </td><td>{ isHost &&
                    <IconBtn
                        title={hintMsgSet.ADD_PATH_BTN}
                        icon="add"
                        theme="gray"
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