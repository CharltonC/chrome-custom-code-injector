import React from "react";
import { MemoComponent } from '../../extendable/memo-component';
import { inclStaticIcon } from '../../static/icon';
import { IProps, IState } from './type';

const $switchIcon = inclStaticIcon('power');
const ITEM_BASE_CLS = 'tab-switch__item';
const TAB_CLS = 'tab-switch__rdo';
const TAB_SWITCH_CLS = 'tab-switch__checkbox';
export const MSG_PROP_ERR = '`dataKeyMap` must be defined if `data` is an object';

export class TabSwitch extends MemoComponent<IProps, IState> {
    static defaultProps: Partial<IProps> = {
        activeTabIdx: 0,
        tabKey: 'id',
        tabEnableKey: 'isOn'
    };

    render() {
        const { cssCls, list, props } = this;
        const { id, activeTabIdx, tabKey, tabEnableKey, onTabActive, onTabEnable } = props;
        const ITEM_ACTIVE_CLS = cssCls(ITEM_BASE_CLS, 'active');

        return list.length && (
            <ul className="tab-switch">{ list.map((tab: Record<string, any>, idx: number) => {
                const isActive = activeTabIdx === idx;
                const ITEM_ID = `${id}-${idx}`;
                const ITEM_CLS = isActive ? ITEM_ACTIVE_CLS : ITEM_BASE_CLS;
                const TAB_ID = `rdo-${ITEM_ID}`;
                const TAB_SWITCH_ID = `checkbox-${ITEM_ID}`;
                const TAB_TITLE = tab[tabKey];
                const isTabSwitchOn = tab[tabEnableKey];
                const baseEvtArg = { tab, idx };

                return (
                    <li key={ITEM_ID} className={ITEM_CLS}>
                        <input
                            type="radio"
                            name={id}
                            id={TAB_ID}
                            checked={isActive}
                            onChange={evt => onTabActive?.({ evt, ...baseEvtArg })}
                            />
                        <label
                            htmlFor={TAB_ID}
                            className={TAB_CLS}
                            >
                            {TAB_TITLE}
                        </label>
                        <input
                            type="checkbox"
                            id={TAB_SWITCH_ID}
                            checked={isTabSwitchOn}
                            onChange={evt => onTabEnable?.({ evt, ...baseEvtArg })}
                            />
                        <label
                            htmlFor={TAB_SWITCH_ID}
                            className={TAB_SWITCH_CLS}
                            >
                            {$switchIcon}
                        </label>
                    </li>);
                })}
            </ul>
        );
    }

    get list() {
        const { data, dataKeyMap, tabKey, tabEnableKey } = this.props;

        if (Array.isArray(data)) return data;

        if (!dataKeyMap) throw new Error(MSG_PROP_ERR);

        return dataKeyMap.map(([tabName, tabSwitchEnabledKey]) => {
            return {
                [tabKey]: tabName,
                [tabEnableKey]: data[tabSwitchEnabledKey]
            };
        });
    }
}