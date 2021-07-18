import React, { memo } from 'react';
import { IconBtn } from '../../base/btn-icon';
import { Checkbox } from '../../base/checkbox';
import { SliderSwitch } from '../../base/checkbox-slider-switch';

// TODO: Type for props
export const TbRow: React.FC<any> = memo((props) => {
    const { idx, itemLvl, item, nestedItems , classNames, expandProps } = props;
    const { REG_ROW, NESTED_ROW, NESTED_GRID } = classNames;
    const { isOpen, onClick }: any = nestedItems ? expandProps : {};
    // TODO: Renamed the state prop
    const { https, title, value, script_exec, script_js, script_css, script_lib } = item;
    const ID_SUFFIX: string = `${itemLvl}-${idx}`;

    return <>
            {/* Index required for each id */}
            <tr className={REG_ROW}>
                <td><Checkbox id={`check-${ID_SUFFIX}`} /></td>
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