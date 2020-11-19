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
    const { store, storeHandler } = commonProps;
    const { localState } = store;

    const {
        selectState,
        expdRowId,
    } = localState;

    const {
        onDelModal, onAddPathModal,
        onRowSwitchToggle, onRowJsStageChange,
        onRowEdit, onRowExpand, onRowSelectToggle,
    } = storeHandler;

    const { REG_ROW, NESTED_ROW, NESTED_GRID } = classNames;
    const { isHttps, id, value, jsExecPhase, isJsOn, isCssOn, isLibOn, paths } = item;

    const ID_SUFFIX: string = `${itemLvl}-${idx}`;
    const isParent = itemLvl === 0;
    const isRowExp = isParent && id === expdRowId;
    const parentCtxIdx: number = parentItemCtx?.ctxIdx;

    const { areAllRowsSelected, selectedRowKeys } = selectState;
    const isSelected = areAllRowsSelected || ctxIdx in selectedRowKeys;
    const isDelDisabled = areAllRowsSelected || !!Object.entries(selectedRowKeys).length;

    return <>
            <tr className={REG_ROW}>
                <td>
                    { isParent &&
                    <Checkbox
                        id={`check-${ID_SUFFIX}`}
                        clsSuffix=""
                        checked={isSelected}
                        onChange={() => onRowSelectToggle(ctxIdx, dataSrc.length)}
                        />}
                </td><td>{ isParent &&
                    <SliderSwitch
                        id={`https-${ID_SUFFIX}`}
                        checked={isHttps}
                        disabled={isDelDisabled}
                        onChange={() => onRowSwitchToggle(ctxIdx, 'isHttps')}
                        />}
                </td><td>
                    <div>{ isParent && <>
                        <IconBtn
                            icon="arrow-rt"
                            clsSuffix={`arrow-rt ${isRowExp ? 'open': ''}`}
                            disabled={!paths?.length}
                            onClick={() => onRowExpand({[id]: itemLvl})}
                            />
                        <NumBadge total={paths?.length} /> </>}
                        <span>{id}</span>
                    </div>
                </td><td>
                    {value}
                </td><td>
                    <Dropdown
                        id={`select-${ID_SUFFIX}`}
                        list={jsExecStage}
                        selectIdx={jsExecPhase}
                        className="dropdown__select--cell"
                        disabled={isDelDisabled}
                        onSelect={(evt, selectIdx) => onRowJsStageChange(ctxIdx, selectIdx)}
                        />
                </td><td>
                    <SliderSwitch
                        id={`js-${ID_SUFFIX}`}
                        defaultChecked={isJsOn}
                        disabled={isDelDisabled}
                        onChange={() => onRowSwitchToggle(ctxIdx, 'isJsOn')}
                        />
                </td><td>
                    <SliderSwitch
                        id={`css-${ID_SUFFIX}`}
                        defaultChecked={isCssOn}
                        disabled={isDelDisabled}
                        onChange={() => onRowSwitchToggle(ctxIdx, 'isCssOn')}
                        />
                </td><td>
                    <SliderSwitch
                        id={`lib-${ID_SUFFIX}`}
                        defaultChecked={isLibOn}
                        disabled={isDelDisabled}
                        onChange={() => onRowSwitchToggle(ctxIdx, 'isLibOn')}
                        />
                </td><td>{ isParent &&
                    <IconBtn
                        icon="add"
                        theme="gray"
                        title="add path rule"
                        disabled={isDelDisabled}
                        onClick={() => onAddPathModal(ctxIdx)}
                        />}
                </td><td>
                    <IconBtn
                        icon="edit"
                        theme="gray"
                        disabled={isDelDisabled}
                        onClick={() => onRowEdit(item) }
                        />
                </td><td>
                    <IconBtn
                        icon="delete"
                        theme="gray"
                        disabled={isDelDisabled}
                        onClick={() => onDelModal({ dataSrc, ctxIdx, parentCtxIdx })}
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