import React, { Component, memo, ReactElement } from "react";

import { inclStaticIcon } from '../../static/icon/';
import { IProps, IState, ITabItem } from './type';

export class _TabSwitch extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        const { list, activeIdx } = props;
        this.state = this.getInitialState(list, activeIdx);
        this.onRdoChecked = this.onRdoChecked.bind(this);
        this.onCheckboxChanged = this.onCheckboxChanged.bind(this);
    }

    getInitialState(list: ITabItem[], activeIdx: number): IState {
        const hsList: boolean = typeof list !== 'undefined' && !!list.length;
        const hsAtvIdx: boolean = typeof activeIdx !== 'undefined' && !!list[activeIdx];
        return {
            hsList,
            hsAtvIdx,
            activeTab: hsList ? (hsAtvIdx ? list[activeIdx] : list[0]) : null
        };
    }

    onRdoChecked(evt: React.ChangeEvent<HTMLInputElement>, activeTab: ITabItem, idx: number): void {
        const { onTabActive } = this.props;
        const isActive: boolean = this.state.activeTab === activeTab;
        if (!isActive) this.setState({activeTab});
        if (onTabActive) onTabActive({evt, activeTab, idx, isActive});
    }

    onCheckboxChanged(evt: React.ChangeEvent<HTMLInputElement>, tab: ITabItem, idx: number): void {
        const { onTabEnable } = this.props;
        const isActive: boolean = this.state.activeTab === tab;
        const isEnable: boolean = !tab.isEnable;
        if (onTabEnable) onTabEnable({evt, tab, idx, isEnable, isActive});
    }

    render() {
        const { id, list, activeIdx } = this.props;
        const { hsList, hsAtvIdx, activeTab } = this.state;

        // List item
        const liBaseCls: string = 'tab-switch__item';
        const liAtvCls: string = `${liBaseCls} ${liBaseCls}--active`;

        // Radio & Checkbox
        const rdoCls = 'tab-switch__rdo';
        const cbCls = 'tab-switch__checkbox';

        // Icon Elem
        const powerIcon: ReactElement = inclStaticIcon('power');

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