import React, { ReactElement } from "react";
import { MemoComponent } from '../../extendable/memo-component';
import { inclStaticIcon } from '../../static/icon';
import { IProps, IState } from './type';

export class TabSwitch extends MemoComponent<IProps, IState> {
    readonly $switchIcon: ReactElement = inclStaticIcon('power');
    readonly itemBaseCls: string = 'tab-switch__item';
    readonly tabCls: string = 'tab-switch__rdo';
    readonly tabSwitchCls: string = 'tab-switch__checkbox';
    readonly propErrMsg: string = '`dataKeyMap` must be defined if `data` is an object';

    static defaultProps: Partial<IProps> = {
        activeTabIdx: 0,
        tabKey: 'id',
        tabEnableKey: 'isOn'
    };

    render() {
        const { itemBaseCls, tabCls, tabSwitchCls, $switchIcon, cssCls, list, props } = this;
        const { id, activeTabIdx, tabKey, tabEnableKey, onTabActive, onTabEnable } = props;
        const itemActiveCls: string = cssCls(itemBaseCls, 'active');

        return list.length && (
            <ul className="tab-switch">{ list.map((tab: Record<string, any>, idx: number) => {
                const isItemActive: boolean = activeTabIdx === idx;
                const itemId: string = `${id}-${idx}`;
                const itemCls: string = isItemActive ? itemActiveCls : itemBaseCls;
                const tabId: string = `rdo-${itemId}`;
                const tabSwitchId: string = `checkbox-${itemId}`;
                const tabName: string = tab[tabKey];
                const isTabSwitchOn: boolean = tab[tabEnableKey];

                return (
                    <li key={itemId} className={itemCls}>
                        <input
                            type="radio"
                            name={id}
                            id={tabId}
                            checked={isItemActive}
                            onChange={(e) => onTabActive?.(e, tab, idx)}
                            />
                        <label htmlFor={tabId} className={tabCls}>{tabName}</label>
                        <input
                            type="checkbox"
                            id={tabSwitchId}
                            checked={isTabSwitchOn}
                            onChange={(e) => onTabEnable?.(e, tab, idx)}
                            />
                        <label htmlFor={tabSwitchId} className={tabSwitchCls}>{$switchIcon}</label>
                    </li>);
                })}
            </ul>
        );
    }

    get list() {
        const { data, dataKeyMap, tabKey, tabEnableKey } = this.props;

        if (Array.isArray(data)) return data;

        if (!dataKeyMap) throw new Error(this.propErrMsg);

        return dataKeyMap.map(([tabName, tabSwitchEnabledKey]) => {
            return {
                [tabKey]: tabName,
                [tabEnableKey]: data[tabSwitchEnabledKey]
            };
        });
    }
}