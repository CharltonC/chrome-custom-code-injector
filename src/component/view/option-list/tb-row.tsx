import React, { memo } from 'react';
import { jsExecStage } from '../../../constant/js-exec-stage';
import { IconBtn } from '../../base/btn-icon';
import { Checkbox } from '../../base/checkbox';
import { SliderSwitch } from '../../base/checkbox-slider-switch';
import { Dropdown } from '../../base/select-dropdown';
import { NumBadge } from '../../base/num-badge';
import { ITbRowProps } from './type';

export const TbRow: React.FC<any> = memo((props: ITbRowProps) => {
    const { dataSrc, ctxIdx, idx, itemLvl, item, nestedItems, classNames, parentItemCtx, commonProps } = props;
    const { appState, appStateHandler } = commonProps;
    const { localState } = appState;

    const { selectState, expdRowId } = localState.ruleDataGrid;

    const {
        onDelModal, onAddPathRuleModal,
        onItemExecSwitchToggle, onItemJsExecStepChange,
        onEditView, onRowExpand, onRowSelectToggle,
    } = appStateHandler;

    const { REG_ROW, NESTED_ROW, NESTED_GRID } = classNames;
    const { isHost, isHttps, title, value, jsExecPhase, isJsOn, isCssOn, isLibOn, paths } = item;

    const ID_SUFFIX = `${itemLvl}-${idx}`;
    const isRowExp = isHost && title === expdRowId;
    const parentCtxIdx: number = parentItemCtx?.ctxIdx;

    const { areAllRowsSelected, selectedRowKeys } = selectState;
    const isSelected = areAllRowsSelected || ctxIdx in selectedRowKeys;
    const isDelDisabled = areAllRowsSelected || !!Object.entries(selectedRowKeys).length;
    const itemIdxCtx = { ctxIdx, parentCtxIdx };

    return <>
            <tr className={REG_ROW}>
                <td>
                    { isHost &&
                    <Checkbox
                        id={`check-${ID_SUFFIX}`}
                        clsSuffix=""
                        checked={isSelected}
                        onChange={() => onRowSelectToggle(ctxIdx, dataSrc.length)}
                        />}
                </td><td>{ isHost &&
                    <SliderSwitch
                        id={`https-${ID_SUFFIX}`}
                        checked={isHttps}
                        disabled={isDelDisabled}
                        onChange={() => onItemExecSwitchToggle({ ...itemIdxCtx, key: 'isHttps'})}
                        />}
                </td><td>
                    <div>{ isHost &&
                        <>
                            <IconBtn
                                icon="arrow-rt"
                                clsSuffix={`arrow-rt ${isRowExp ? 'open': ''}`}
                                disabled={!paths?.length}
                                onClick={() => onRowExpand({[title]: itemLvl})}
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
                        list={jsExecStage}
                        selectIdx={jsExecPhase}
                        className="dropdown__select--cell"
                        disabled={isDelDisabled}
                        onSelect={arg => onItemJsExecStepChange({...itemIdxCtx, ...arg})}
                        />
                </td><td>
                    <SliderSwitch
                        id={`js-${ID_SUFFIX}`}
                        defaultChecked={isJsOn}
                        disabled={isDelDisabled}
                        onChange={() => onItemExecSwitchToggle({ ...itemIdxCtx, key: 'isJsOn'})}
                        />
                </td><td>
                    <SliderSwitch
                        id={`css-${ID_SUFFIX}`}
                        defaultChecked={isCssOn}
                        disabled={isDelDisabled}
                        onChange={() => onItemExecSwitchToggle({ ...itemIdxCtx, key: 'isCssOn'})}
                        />
                </td><td>
                    <SliderSwitch
                        id={`lib-${ID_SUFFIX}`}
                        defaultChecked={isLibOn}
                        disabled={isDelDisabled}
                        onChange={() => onItemExecSwitchToggle({ ...itemIdxCtx, key: 'isLibOn'})}
                        />
                </td><td>{ isHost &&
                    <IconBtn
                        icon="add"
                        theme="gray"
                        title="add path rule"
                        disabled={isDelDisabled}
                        onClick={() => onAddPathRuleModal({ idx: ctxIdx })}
                        />}
                </td><td>
                    <IconBtn
                        icon="edit"
                        theme="gray"
                        disabled={isDelDisabled}
                        onClick={() => onEditView({ isHost, idx, parentCtxIdx }) }
                        />
                </td><td>
                    <IconBtn
                        icon="delete"
                        theme="gray"
                        disabled={isDelDisabled}
                        onClick={() => onDelModal({ dataSrc, ...itemIdxCtx })}
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