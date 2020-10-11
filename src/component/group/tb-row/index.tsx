import React, { memo } from 'react';
import { IconBtn } from '../../base/icon-btn';
import { Checkbox } from '../../base/checkbox';
import { SliderSwitch } from '../../base/slider-switch';
import { Dropdown } from '../../base/dropdown';
// import { IProps } from './type';

// TODO: Move to def. value/state
const dropdownValues = [
    'before page script',
    'dom content ready',
    'after page script',
    'after page load'
];

// TODO: Type for props
export const TbRow: React.FC<any> = memo(({ item, nestedItems , classNames, expandProps }) => {
    const { REG_ROW, NESTED_ROW, NESTED_GRID } = classNames;
    const { isOpen, onClick }: any = nestedItems ? expandProps : {};
    // TODO: Renamed the state prop
    const { https, id, addr, script_exec, script_js, script_css, script_lib, paths } = item;

    return <>
            {/* Index required for each id */}
            <tr className={REG_ROW}>
                <td><Checkbox id="check" /></td>
                <td>{ paths?.length &&
                    <SliderSwitch id="https" defaultChecked={https} />}
                </td>
                <td>
                    <IconBtn icon="arrow-rt" onClick={onClick} />
                    {id}
                </td>
                <td>{addr}</td>
                <td><Dropdown id="" list={dropdownValues} selectIdx={script_exec} /></td>
                <td><SliderSwitch id="js" defaultChecked={script_js} /></td>
                <td><SliderSwitch id="css" defaultChecked={script_css} /></td>
                <td><SliderSwitch id="lib" defaultChecked={script_lib} /></td>
                <td><IconBtn icon="add" /></td>
                <td><IconBtn icon="edit" /></td>
                <td><IconBtn icon="delete" /></td>
            </tr>{ nestedItems && isOpen &&
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