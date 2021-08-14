import React, { memo } from 'react';
import { libTypeList } from '../../../constant/lib-type-list';

import { IconBtn } from '../../base/btn-icon';
import { Checkbox } from '../../base/checkbox';
import { SliderSwitch } from '../../base/checkbox-slider-switch';
import { Dropdown } from '../../base/select-dropdown';

import { AppState } from '../../../model/app-state';

// TODO: Type for props
export const TbRow: React.FC<any> = memo((props) => {
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
    const isSelected = areAllRowsSelected || id in selectedRowKeyCtx;
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
                        id="lib-type"
                        list={libTypeList}
                        selectIdx={libTypeIdx}
                        onSelect={arg => onLibTypeChange({ ...arg, id })}
                        />
                </td>
                <td>
                    <SliderSwitch
                        id={`lib-async-${ID_SUFFIX}`}
                        checked={isAsync}
                        disabled={isSelected}
                        onChange={() => onLibAsyncToggle({ id })}
                        />
                </td>
                <td>
                    <SliderSwitch
                        id={`lib-active-${ID_SUFFIX}`}
                        checked={isOn}
                        disabled={isSelected}
                        onChange={() => onLibIsOnToggle({ id })}
                        />
                </td>
                <td>
                    <IconBtn
                        icon="edit"
                        theme="gray"
                        disabled={isSelected}
                        onClick={() => onEditLibModal({ id })}
                    />
                </td>
                <td>
                    <IconBtn
                        icon="delete"
                        theme="gray"
                        disabled={isSelected}
                        onClick={() => onDelLibModal({ id })}
                        />
                </td>
            </tr>
    </>;
});