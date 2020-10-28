import React, { memo } from 'react';
import { jsExecStage } from '../../../service/constant/js-exec-stage';
import { IconBtn } from '../../base/icon-btn';
import { Checkbox } from '../../base/checkbox';
import { SliderSwitch } from '../../base/slider-switch';
import { Dropdown } from '../../base/dropdown';
import { InclStaticNumBadge } from '../../static/num-badge';
import { ITbRowProps } from './type';

export const TbRow: React.FC<any> = memo((props: ITbRowProps) => {
    const { idx, itemLvl, item, nestedItems, classNames, parentItemCtx, expandProps, commonProps } = props;

    const { REG_ROW, NESTED_ROW, NESTED_GRID } = classNames;
    const { isHttps, id, value, jsExecPhase, isJsOn, isCssOn, isLibOn, paths } = item;
    const ID_SUFFIX: string = `${itemLvl}-${idx}`;

    const { store, storeHandler } = commonProps;
    const { localState } = store;
    const { isAllRowsSelected, expdRowId } = localState;

    const {
        onDelModal,
        onHttpsToggle, onJsToggle, onCssToggle, onLibToggle,
        onJsExecStageChange,
        onItemEdit, onItemExpd,
    } = storeHandler;

    const isParent = itemLvl === 0;
    const isRowExp = isParent && id === expdRowId;
    const parentIdx: number = parentItemCtx?.idx;

    // Allow both external state & internal state
    const isAllChecked = isAllRowsSelected ? isAllRowsSelected : null;

    return <>
            {/* Index required for each id */}
            <tr className={REG_ROW}>
                <td>
                    {/* TODO, check state */}
                    <Checkbox
                        id={`check-${ID_SUFFIX}`}
                        checked={isAllChecked}
                        />
                </td><td>{ isParent &&
                    <SliderSwitch
                        id={`https-${ID_SUFFIX}`}
                        checked={isHttps}
                        disabled={isAllChecked}
                        onClick={() => onHttpsToggle(idx)}
                        />}
                </td><td>
                    <div>{ isParent && <>
                        <IconBtn
                            icon="arrow-rt"
                            clsSuffix={`arrow-rt ${isRowExp ? 'open': ''}`}
                            disabled={!paths.length}
                            onClick={() => onItemExpd({[id]: itemLvl})}
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
                        disabled={isAllChecked}
                        onSelect={(...args) => onJsExecStageChange(idx, args[1])}
                        />
                </td><td>
                    <SliderSwitch
                        id={`js-${ID_SUFFIX}`}
                        defaultChecked={isJsOn}
                        disabled={isAllChecked}
                        onClick={() => onJsToggle(idx)}
                        />
                </td><td>
                    <SliderSwitch
                        id={`css-${ID_SUFFIX}`}
                        defaultChecked={isCssOn}
                        disabled={isAllChecked}
                        onClick={() => onCssToggle(idx)}
                        />
                </td><td>
                    <SliderSwitch
                        id={`lib-${ID_SUFFIX}`}
                        defaultChecked={isLibOn}
                        disabled={isAllChecked}
                        onClick={() => onLibToggle(idx)}
                        />
                </td><td>{ isParent &&
                    // TODO: action - add path
                    <IconBtn
                        icon="add"
                        theme="gray"
                        title="add path rule"
                        disabled={isAllChecked}
                        onClick={() => {}}
                        />}
                </td><td>
                    <IconBtn
                        icon="edit"
                        theme="gray"
                        disabled={isAllChecked}
                        onClick={() => onItemEdit(item) }
                        />
                </td><td>
                    <IconBtn
                        icon="delete"
                        theme="gray"
                        disabled={isAllChecked}
                        /* TODO: only if the flag is on, show modal */
                        onClick={() => onDelModal(idx, parentIdx)}
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