import React, { memo } from 'react';
import { jsExecStage } from '../../../service/constant/js-exec-stage';
import { IconBtn } from '../../base/icon-btn';
import { Checkbox } from '../../base/checkbox';
import { SliderSwitch } from '../../base/slider-switch';
import { Dropdown } from '../../base/dropdown';
import { InclStaticNumBadge } from '../../static/num-badge';
import { ITbRowProps } from './type';

export const TbRow: React.FC<any> = memo((props: ITbRowProps) => {
    const { ctxIdx, idx, itemLvl, item, nestedItems, classNames, parentItemCtx, commonProps } = props;
    const { store, storeHandler } = commonProps;
    const { localState } = store;

    const {
        areAllRowsSelected,
        selectedRowKeys,
        expdRowId,
    } = localState;

    const {
        onDelModal, onAddPathModal,
        onRowHttpsToggle, onRowJsToggle, onRowCssToggle, onRowLibToggle,
        onRowJsStageChange,
        onRowEdit, onRowExpand, onRowSelectToggle,
    } = storeHandler;

    const { REG_ROW, NESTED_ROW, NESTED_GRID } = classNames;
    const { isHttps, id, value, jsExecPhase, isJsOn, isCssOn, isLibOn, paths } = item;

    const ID_SUFFIX: string = `${itemLvl}-${idx}`;
    const isParent = itemLvl === 0;
    const isRowExp = isParent && id === expdRowId;
    const parentCtxIdx: number = parentItemCtx?.ctxIdx;

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
                        onChange={() => onRowSelectToggle(ctxIdx)}
                        />}
                </td><td>{ isParent &&
                    <SliderSwitch
                        id={`https-${ID_SUFFIX}`}
                        checked={isHttps}
                        disabled={isDelDisabled}
                        onChange={() => onRowHttpsToggle(ctxIdx)}
                        />}
                </td><td>
                    <div>{ isParent && <>
                        <IconBtn
                            icon="arrow-rt"
                            clsSuffix={`arrow-rt ${isRowExp ? 'open': ''}`}
                            disabled={!paths.length}
                            onClick={() => onRowExpand({[id]: itemLvl})}
                            />
                        { InclStaticNumBadge(paths.length) } </>}
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
                        onChange={() => onRowJsToggle(ctxIdx)}
                        />
                </td><td>
                    <SliderSwitch
                        id={`css-${ID_SUFFIX}`}
                        defaultChecked={isCssOn}
                        disabled={isDelDisabled}
                        onChange={() => onRowCssToggle(ctxIdx)}
                        />
                </td><td>
                    <SliderSwitch
                        id={`lib-${ID_SUFFIX}`}
                        defaultChecked={isLibOn}
                        disabled={isDelDisabled}
                        onChange={() => onRowLibToggle(ctxIdx)}
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
                        onClick={() => onDelModal(ctxIdx, parentCtxIdx)}
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