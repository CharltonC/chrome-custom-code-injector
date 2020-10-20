import React, { memo } from 'react';
import { IconBtn } from '../../base/icon-btn';
import { Checkbox } from '../../base/checkbox';
import { SliderSwitch } from '../../base/slider-switch';
import { Dropdown } from '../../base/dropdown';
import { InclStaticNumBadge } from '../../static/num-badge';
// import { IProps } from './type';

// TODO: Move to def. value/state
const dropdownValues = [
    'before page script',
    'dom content ready',
    'after page script',
    'after page load'
];

// TODO: Type for props
export const TbRow: React.FC<any> = memo((props) => {
    const { idx, itemLvl, item, nestedItems , classNames, expandProps } = props;
    const { REG_ROW, NESTED_ROW, NESTED_GRID } = classNames;
    const { isOpen, onClick }: any = nestedItems ? expandProps : {};
    // TODO: Renamed the state prop
    const { https, id, addr, script_exec, script_js, script_css, script_lib, paths } = item;
    const ID_SUFFIX: string = `${itemLvl}-${idx}`;

    return <>
            {/* Index required for each id */}
            <tr className={REG_ROW}>
                <td><Checkbox id={`check-${ID_SUFFIX}`} /></td>
                <td>{ nestedItems &&
                    <SliderSwitch
                        id={`https-${ID_SUFFIX}`}
                        defaultChecked={https}
                        />}
                </td>
                <td>
                    <div>{ nestedItems && <>
                        <IconBtn
                            icon="arrow-rt"
                            clsSuffix={`arrow-rt ${isOpen ? 'open': ''}`}
                            onClick={onClick}
                            />
                        { InclStaticNumBadge(paths.length) } </>}
                        <span>{id}</span>
                    </div>
                </td>
                <td>{addr}</td>
                <td>
                    <Dropdown
                        id={`select-${ID_SUFFIX}`}
                        list={dropdownValues}
                        selectIdx={script_exec}
                        className="dropdown__select--cell"
                        />
                </td>
                <td><SliderSwitch id={`js-${ID_SUFFIX}`} defaultChecked={script_js} /></td>
                <td><SliderSwitch id={`css-${ID_SUFFIX}`} defaultChecked={script_css} /></td>
                <td><SliderSwitch id={`lib-${ID_SUFFIX}`} defaultChecked={script_lib} /></td>
                <td><IconBtn icon="add" theme="gray" /></td>
                <td><IconBtn icon="edit" theme="gray" /></td>
                <td><IconBtn icon="delete" theme="gray" /></td>
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