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

    const { areAllRowsSelected, selectedRowKeys } = selectState;
    const isSelected = areAllRowsSelected || ctxIdx in selectedRowKeys;
    const isDelDisabled = areAllRowsSelected || !!Object.entries(selectedRowKeys).length;

    // TODO: Dont use index approach, use `item` instead as there might be Sort, Searched and Pagination in place\
    const parentItem = parentItemCtx?.item;
    const pathIdx = isHost ? null : idx;

    return <>
            <tr className={REG_ROW}>
                <td>
                    { isHost &&
                    <Checkbox
                        id={`check-${ID_SUFFIX}`}
                        clsSuffix=""
                        checked={isSelected}
                        // TODO: Change to `item` approach
                        onChange={() => onRowSelectToggle(ctxIdx, dataSrc.length)}
                        />}
                </td><td>{ isHost &&
                    <SliderSwitch
                        id={`https-${ID_SUFFIX}`}
                        checked={isHttps}
                        disabled={isDelDisabled}
                        onChange={() => onItemExecSwitchToggle({
                            item,
                            id: 'Https'
                        })}
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
                        onSelect={arg => onItemJsExecStepChange({...arg, item})}
                        />
                </td><td>
                    <SliderSwitch
                        id={`js-${ID_SUFFIX}`}
                        defaultChecked={isJsOn}
                        disabled={isDelDisabled}
                        onChange={() => onItemExecSwitchToggle({item, id: 'Js'})}
                        />
                </td><td>
                    <SliderSwitch
                        id={`css-${ID_SUFFIX}`}
                        defaultChecked={isCssOn}
                        disabled={isDelDisabled}
                        onChange={() => onItemExecSwitchToggle({item, id: 'Css'})}
                        />
                </td><td>
                    <SliderSwitch
                        id={`lib-${ID_SUFFIX}`}
                        defaultChecked={isLibOn}
                        disabled={isDelDisabled}
                        onChange={() => onItemExecSwitchToggle({item, id: 'Lib'})}
                        />
                </td><td>{ isHost &&
                    <IconBtn
                        icon="add"
                        theme="gray"
                        title="add path rule"
                        disabled={isDelDisabled}
                        // TODO: Change to `item` approach
                        onClick={() => onAddPathRuleModal({ idx: ctxIdx })}
                        />}
                </td><td>
                    <IconBtn
                        icon="edit"
                        theme="gray"
                        disabled={isDelDisabled}
                        onClick={() => onEditView({
                            isHost,
                            item,
                            parentItem,
                            pathIdx,
                        }) }
                        />
                </td><td>
                    <IconBtn
                        icon="delete"
                        theme="gray"
                        disabled={isDelDisabled}
                        // TODO: Change to `item` approach
                        onClick={() => onDelModal({ dataSrc })}
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