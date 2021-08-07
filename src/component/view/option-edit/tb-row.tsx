import React, { memo } from 'react';

import { IconBtn } from '../../base/btn-icon';
import { Checkbox } from '../../base/checkbox';
import { SliderSwitch } from '../../base/checkbox-slider-switch';

import { IAppState } from '../../../state/model/type';

// TODO: Type for props
export const TbRow: React.FC<any> = memo((props) => {
    const { dataSrc, idx, itemLvl, item, classNames, commonProps } = props;
    const { appState, appStateManager } = commonProps;
    const { REG_ROW } = classNames;

    const {
        onLibRowSelectToggle,
        onLibAsyncToggle,
        onLibIsOnToggle,
        onEditLibModal,
        onDelLibModal,
    } = appStateManager;

    // Item
    const { id, title, value, isOn, isAsync } = item;
    const ID_SUFFIX = `${itemLvl}-${idx}`;

    //// STATE
    const { localState } = appState as IAppState;

    // Data Grid State
    const { selectState } = localState.editView.dataGrid;
    const { areAllRowsSelected, selectedRowKeyCtx } = selectState;
    const isSelected = areAllRowsSelected || id in selectedRowKeyCtx;

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
                {/* TODO: Trim title if too long */}
                <td>{title}</td>
                <td>{value}</td>
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