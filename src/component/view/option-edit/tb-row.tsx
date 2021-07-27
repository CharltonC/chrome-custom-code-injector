import React, { memo } from 'react';
import { IconBtn } from '../../base/btn-icon';
import { Checkbox } from '../../base/checkbox';
import { SliderSwitch } from '../../base/checkbox-slider-switch';
import { AppState } from '../../../model/app-state';

// TODO: Type for props
export const TbRow: React.FC<any> = memo((props) => {
    const { dataSrc, idx, itemLvl, item, classNames, commonProps } = props;
    const { appState, appStateHandler } = commonProps;
    const { REG_ROW } = classNames;

    //// ITEM
    const { title, value, isOn, isAsync } = item;
    const ID_SUFFIX = `${itemLvl}-${idx}`;

    //// STATE
    const { localState } = appState as AppState;

    // Data Grid State
    const { selectState } = localState.libDataGrid;
    const { areAllRowsSelected, selectedRowKeys } = selectState;
    const isSelected = areAllRowsSelected || idx in selectedRowKeys;
    const isDelDisabled = areAllRowsSelected || !!Object.entries(selectedRowKeys).length;

    //// STATE HANDLER
    const {
        onLibRowSelectToggle,
        onItemLibSwitchToggle,
        onEditLibModal,
        onDelLibModal,
    } = appStateHandler;

    return <>
            {/* TODO: Index required for each id */}
            <tr className={REG_ROW}>
                <td>
                    <Checkbox
                        id={`lib-check-${ID_SUFFIX}`}
                        clsSuffix=""
                        checked={isSelected}
                        onChange={() => onLibRowSelectToggle(idx, dataSrc.length)}
                        />
                </td>
                {/* TODO: Trim id if too long */}
                <td>{title}</td>
                <td>{value}</td>
                <td>
                    <SliderSwitch
                        id={`lib-async-${ID_SUFFIX}`}
                        checked={isAsync}
                        disabled={isDelDisabled}
                        onChange={() => onItemLibSwitchToggle({
                            key: 'isAsync',
                            lib: item
                        })}
                        />
                </td>
                <td>
                    <SliderSwitch
                        id={`lib-active-${ID_SUFFIX}`}
                        checked={isOn}
                        disabled={isDelDisabled}
                        onChange={() => onItemLibSwitchToggle({
                            key: 'isOn',
                            lib: item
                        })}
                        />
                </td>
                <td>
                    <IconBtn
                        icon="edit"
                        theme="gray"
                        disabled={isDelDisabled}
                        onClick={() => onEditLibModal({
                            libIdx: idx,
                            lib: item
                        })}
                    />
                </td>
                <td>
                    <IconBtn
                        icon="delete"
                        theme="gray"
                        disabled={isDelDisabled}
                        onClick={onDelLibModal}
                        />
                </td>
            </tr>
    </>;
});