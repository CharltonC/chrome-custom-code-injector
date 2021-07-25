import React, { memo } from 'react';
import { IconBtn } from '../../base/btn-icon';
import { Checkbox } from '../../base/checkbox';
import { SliderSwitch } from '../../base/checkbox-slider-switch';

// TODO: Type for props
export const TbRow: React.FC<any> = memo((props) => {
    const { dataSrc, idx, itemLvl, item, classNames, commonProps } = props;
    const { REG_ROW } = classNames;

    // TODO: Renamed the state prop
    const { https, title, value, script_exec, script_js, script_css, script_lib } = item;
    const ID_SUFFIX: string = `${itemLvl}-${idx}`;

    const { appState, appStateHandler } = commonProps;

    //// STATE
    const { localState } = appState;

    // Row Select STate
    const { selectState } = localState.libDataGrid;
    const { areAllRowsSelected, selectedRowKeys } = selectState;
    const isSelected = areAllRowsSelected || idx in selectedRowKeys;

    //// STATE HANDLER
    const {
        onLibRowSelectToggle,
    } = appStateHandler;

    return <>
            {/* TODO: Index required for each id */}
            <tr className={REG_ROW}>
                <td>
                    <Checkbox
                        id={`check-${ID_SUFFIX}`}
                        clsSuffix=""
                        checked={isSelected}
                        onChange={() => onLibRowSelectToggle(idx, dataSrc.length)}
                        />
                </td>
                {/* TODO: Trim id if too long */}
                <td>{title}</td>
                <td>{value}</td>
                <td><SliderSwitch id={`js-${ID_SUFFIX}`} defaultChecked={script_js} /></td>
                <td><SliderSwitch id={`css-${ID_SUFFIX}`} defaultChecked={script_css} /></td>
                <td><SliderSwitch id={`lib-${ID_SUFFIX}`} defaultChecked={script_lib} /></td>
                <td><IconBtn icon="edit" theme="gray" /></td>
                <td><IconBtn icon="delete" theme="gray" /></td>
            </tr>
    </>;
});