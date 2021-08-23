import React, { memo } from 'react';
import { libTypeList } from '../../../constant/lib-type-list';
import { hintTitleSet } from '../../../constant/hint-title-set';

import { IconBtn } from '../../base/btn-icon';
import { Checkbox } from '../../base/checkbox';
import { SliderSwitch } from '../../base/checkbox-slider-switch';
import { Dropdown } from '../../base/select-dropdown';

import { AppState } from '../../../model/app-state';
import { ITbRowProps } from './type';

export const TbRow: React.FC<any> = memo((props: ITbRowProps) => {
    const { dataSrc, idx, itemLvl, item, classNames, commonProps } = props;
    const { appState, appStateHandle } = commonProps;
    const { REG_ROW } = classNames;

    const {
        onLibRowSelectToggle,
        onLibTypeChange,
        onLibAsyncToggle,
        onLibIsOnToggle,
        onEditLibModal,
        onDelLibModal,
    } = appStateHandle;

    // Item
    const { id, title, type, value, isOn, isAsync } = item;
    const ID_SUFFIX = `${itemLvl}-${idx}`;

    //// STATE
    const { localState } = appState as AppState;

    // Data Grid State
    const { selectState } = localState.editView.dataGrid;
    const { areAllRowsSelected, selectedRowKeyCtx } = selectState;
    // TODO: Move these two lines to select handle
    const isSelected = areAllRowsSelected || id in selectedRowKeyCtx;
    const hasSelected = areAllRowsSelected || !!Object.getOwnPropertyNames(selectedRowKeyCtx).length;
    const libTypeIdx = libTypeList.indexOf(type);

    return <>
            <tr className={REG_ROW}>
                <td>
                    <Checkbox
                        id={`lib-check-${ID_SUFFIX}`}
                        clsSuffix=""
                        checked={isSelected}
                        onChange={() => onLibRowSelectToggle({
                            libs: dataSrc,
                            id
                        })}
                        />
                </td>
                <td>
                    <span className="datagrid__cell datagrid__cell--title">{title}</span>
                </td>
                <td>
                    <span className="datagrid__cell datagrid__cell--url">{value}</span>
                </td>
                <td>
                    <Dropdown
                        title={hintTitleSet.LIB_TYPE_SELECT}
                        id="lib-type"
                        disabled={hasSelected}
                        list={libTypeList}
                        selectIdx={libTypeIdx}
                        onSelect={arg => onLibTypeChange({ ...arg, id })}
                        />
                </td>
                <td>
                    <SliderSwitch
                        title={hintTitleSet.LIB_ASYNC_SWITCH}
                        id={`lib-async-${ID_SUFFIX}`}
                        checked={isAsync}
                        disabled={hasSelected}
                        onChange={() => onLibAsyncToggle({ id })}
                        />
                </td>
                <td>
                    <SliderSwitch
                        title={hintTitleSet.LIB_ACTIVE_SWITCH}
                        id={`lib-active-${ID_SUFFIX}`}
                        checked={isOn}
                        disabled={hasSelected}
                        onChange={() => onLibIsOnToggle({ id })}
                        />
                </td>
                <td>
                    <IconBtn
                        icon="edit"
                        theme="gray"
                        disabled={hasSelected}
                        onClick={() => onEditLibModal({ id })}
                    />
                </td>
                <td>
                    <IconBtn
                        icon="delete"
                        theme="gray"
                        disabled={hasSelected}
                        onClick={() => onDelLibModal({ id })}
                        />
                </td>
            </tr>
    </>;
});