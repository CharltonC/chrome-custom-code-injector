import React, { Component, memo, ReactElement } from "react";

import { staticIconElem } from '../../static/icon/';
import { IProps, IState, ITabItem } from './type';

class _TabSwitch extends Component<IProps, IState> {
    hsList: boolean;
    hsAtvIdx: boolean;

    constructor(props: IProps) {
        super(props);

        const { list, activeIdx } = props;
        this.hsList = !!list.length;
        this.hsAtvIdx = typeof activeIdx !== 'undefined' && !!list[activeIdx];
        this.state = {
            activeTab: this.hsList ? (this.hsAtvIdx ? list[activeIdx] : list[0]) : null
        };

        this.onRdoChecked = this.onRdoChecked.bind(this);
        this.onCheckboxChanged = this.onCheckboxChanged.bind(this);
    }

    onRdoChecked(evt: React.ChangeEvent<HTMLInputElement>, activeTab: ITabItem, idx: number): void {
        const { onTabActive } = this.props;
        const isCurrActive: boolean = this.state.activeTab === activeTab;
        if (!isCurrActive) this.setState({activeTab});
        if (onTabActive) onTabActive(evt, activeTab, idx, isCurrActive);
    }

    onCheckboxChanged(evt: React.ChangeEvent<HTMLInputElement>, tab: ITabItem, idx: number): void {
        const { onTabEnable } = this.props;
        const isCurrActive: boolean = this.state.activeTab === tab;
        if (onTabEnable) onTabEnable(evt, tab, idx, !tab.isEnable, isCurrActive);
    }

    render() {
        const { hsList, hsAtvIdx } = this;
        const { id, list, activeIdx } = this.props;
        const { activeTab } = this.state;

        // List item
        const liBaseCls: string = 'tab-switch__item';
        const liAtvCls: string = `${liBaseCls} ${liBaseCls}--active`;

        // Radio & Checkbox
        const rdoCls = 'tab-switch__rdo';
        const cbCls = 'tab-switch__checkbox';

        // Icon Elem
        const powerIcon: ReactElement = staticIconElem('power');

        return hsList ?
            <ul className="tab-switch">
                {list.map((tab: ITabItem, idx: number) => {
                    // Use `activeIdx` if it is provided/valid  to compare if Tab is active
                    const isRowAtv: boolean = hsAtvIdx ? (activeIdx === idx) : (tab === activeTab);
                    const rowId: string = `${id}-${idx}`;
                    const rowCls: string = isRowAtv ? liAtvCls : liBaseCls;
                    const rowRdoId: string = `rdo-${rowId}`;
                    const rowCbId: string = `checkbox-${rowId}`;

                    return (
                        <li key={rowId} className={rowCls}>
                            <input
                                type="radio"
                                name={id}
                                id={rowRdoId}
                                defaultChecked={isRowAtv}
                                onChange={(e) => this.onRdoChecked(e, tab, idx)}
                                />
                            <label htmlFor={rowRdoId} className={rdoCls}>{tab.name}</label>
                            <input
                                type="checkbox"
                                id={rowCbId}
                                defaultChecked={tab.isEnable}
                                onChange={(e) => this.onCheckboxChanged(e, tab, idx)}
                                />
                            <label htmlFor={rowCbId} className={cbCls}>{powerIcon}</label>
                        </li>
                    );

                })}
            </ul> :
            null;
    }
}

export const TabSwitch = memo(_TabSwitch);