import React, { ReactElement } from "react";
import { MemoComponent } from '../../extendable/memo-component';
import { inclStaticIcon } from '../../static/icon';
import { NumBadge } from '../num-badge';
import { IProps, IState } from './type';

const $rtArrowIcon: ReactElement = inclStaticIcon('arrow-rt');
const $dnArrowIcon: ReactElement = inclStaticIcon('arrow-dn');

export class SideNav extends MemoComponent<IProps, IState> {
    readonly BASE_CLS: string = 'side-nav';
    readonly PARENT_CLS_SUFFIX: string = 'parent';
    readonly CHILD_CLS_SUFFIX: string = 'child';

    render() {
        const { BASE_CLS, PARENT_CLS_SUFFIX, cssCls, props } = this;
        const { list } = props;
        const LIST_CLS: string = cssCls(`${BASE_CLS}__list`, PARENT_CLS_SUFFIX);

        return (
            <aside className={BASE_CLS}>
                <ul className={LIST_CLS}>
                    {list.map((item: AObj, idx: number) => this.renderParentListItem(item, idx))}
                </ul>
            </aside>
        );
    }

    // TODO:
    // - Use Radio checkboxes with prefix, e.g. side-nav-list-<cmp-instance-idx>-<parentIdx>-<childIdx>
    //
    // - default to 0 index when parent is selected (incl. error handling)
    //
    // - active indexes [ parentIdx, childIdx ]
    //   keys: [ parentKey, childKey ]

    renderParentListItem(item: AObj, idx: number): ReactElement {
        const { props, BASE_CLS, PARENT_CLS_SUFFIX, CHILD_CLS_SUFFIX, cssCls } = this;
        const { activeIdx, activeChildIdx, itemKeys, childKey } = props;
        const [ idKey ] = itemKeys;

        const nestedItems = item[childKey];
        const nestedItemsTotal = nestedItems?.length;
        const isActive = idx === activeIdx;
        const showNestedItems = isActive && typeof activeChildIdx !== 'undefined';

        const ITEM_TITLE: string = item[idKey];
        const ITEM_KEY = `${BASE_CLS}__item-${PARENT_CLS_SUFFIX}-${idx}`;
        const ITEM_CLS = cssCls(`${BASE_CLS}__item`, PARENT_CLS_SUFFIX + (isActive ? ' atv' : ''));
        const ITEM_TIER_CLS = `${BASE_CLS}__tier`;
        const ITEM_TITLE_CLS = `${BASE_CLS}__title`;
        const NESTED_LIST_CLS = cssCls(`${BASE_CLS}__list`, CHILD_CLS_SUFFIX);

        const $arrowIcon = (isActive || showNestedItems) ? $dnArrowIcon : $rtArrowIcon;
        const childListStyle = { maxHeight: showNestedItems ? '320px' : '0' };

        return (
            <li
                className={ITEM_CLS}
                key={ITEM_KEY}
                onClick={(evt) => this.onClick({ evt, item, idx })}
                >
                    <p className={ITEM_TIER_CLS}>
                        {$arrowIcon}
                        <span className={ITEM_TITLE_CLS}>{ITEM_TITLE}</span>
                        <NumBadge total={nestedItemsTotal} />
                    </p>
                    {/* TODO: render only if subList exists */}
                    <ul
                        className={NESTED_LIST_CLS}
                        style={childListStyle}
                        >{ showNestedItems &&
                        nestedItems.map((childItem: AObj, childIdx: number) => this.renderChildListItem(childItem, childIdx)) }
                    </ul>
            </li>
        );
    }

    renderChildListItem(item: AObj, idx: number): ReactElement {
        const { props, BASE_CLS, CHILD_CLS_SUFFIX, cssCls } = this;
        const { activeChildIdx, itemKeys } = props;
        const [ childIdKey ] = itemKeys;

        const isActive = idx === activeChildIdx;
        const ITEM_TITLE: string = item[childIdKey];
        const ITEM_KEY = `${BASE_CLS}__item-${CHILD_CLS_SUFFIX}-${idx}`;
        const ITEM_CLS = cssCls(`${BASE_CLS}__item`, CHILD_CLS_SUFFIX + (isActive ? ' atv' : ''));
        const ITEM_TITLE_CLS = `${BASE_CLS}__title`;
        const evtArg = { item, idx, isChild: true };

        return (
            <li
                className={ITEM_CLS}
                key={ITEM_KEY}
                onClick={(evt) => this.onClick({ ...evtArg, evt })}>
                <span className={ITEM_TITLE_CLS}>{ITEM_TITLE}</span>
            </li>
        );
    }

    onClick(arg) {
        arg.evt.stopPropagation();
        this.props.onItemClick?.(arg);
    }
}