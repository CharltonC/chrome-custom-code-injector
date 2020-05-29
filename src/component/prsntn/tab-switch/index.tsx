import React, { Component, memo, ReactElement } from "react";

import { staticIconElem } from '../../static/icon/';
import { IProps, IState, ITabItem } from './type';

class _TabSwitch extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const { list, activeIdx } = props;
        this.state = {
            activeTab: list.length ? ((activeIdx && list[activeIdx]) ? list[activeIdx] : list[0]) : null
        };

        this.onRdoChange = this.onRdoChange.bind(this);
        this.onCheckboxChange = this.onCheckboxChange.bind(this);
    }

    onRdoChange(evt: React.ChangeEvent<HTMLInputElement>, activeTab: ITabItem): void {
        const { onTabActive } = this.props;
        const isCurrActive: boolean = activeTab === this.state.activeTab;

        if (onTabActive) onTabActive(evt, activeTab, isCurrActive);
        if (!isCurrActive) this.setState({activeTab});
    }

    onCheckboxChange(evt: React.ChangeEvent<HTMLInputElement>, activeTab: ITabItem, idx: number): void {
        const { onTabEnable } = this.props;
        if (onTabEnable) onTabEnable(evt, activeTab, idx);
    }

    render() {
        const { id, list } = this.props;
        const { activeTab } = this.state;

        // List item
        const liBaseCls: string = 'tab-switch__item';
        const liAtvCls: string = `${liBaseCls} ${liBaseCls}--active`;

        // Radio & Checkbox
        const rdoCls = 'tab-switch__rdo';
        const cbCls = 'tab-switch__checkbox';

        // Icon Elem
        const powerIcon: ReactElement = staticIconElem('power');

        return (
            <ul className="tab-switch">
                {list.map((tab: ITabItem, idx: number) => {
                    const rowId: string = `${id}-${idx}`;
                    const rowCls: string = (tab === activeTab) ? liAtvCls : liBaseCls;
                    const rowRdoId: string = `rdo-${rowId}`;
                    const rowCbId: string = `checkbox-${rowId}`;

                    return (
                        <li key={rowId} className={rowCls}>
                            <input
                                type="radio"
                                name={id}
                                id={rowRdoId}
                                onChange={(e) => {
                                    this.onRdoChange(e, tab);
                                }}
                                />
                            <label htmlFor={rowRdoId} className={rdoCls}>{tab.name}</label>
                            <input
                                type="checkbox"
                                id={rowCbId}
                                defaultChecked={tab.isEnable}
                                onChange={(e) => {
                                    this.onCheckboxChange(e, tab, idx);
                                }}
                                />
                            <label htmlFor={rowCbId} className={cbCls}>{powerIcon}</label>
                        </li>
                    );

                })}
            </ul>
        );
    }
}

export const TabSwitch = memo(_TabSwitch);