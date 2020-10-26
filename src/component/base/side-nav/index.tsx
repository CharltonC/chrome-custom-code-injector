import React, { ReactElement } from "react";
import { MemoComponent } from '../../extendable/memo-component';
import { inclStaticIcon } from '../../static/icon';
import { InclStaticNumBadge } from '../../static/num-badge';
import { IProps, IState, IObj } from './type';

const rtIconElem: ReactElement = inclStaticIcon('arrow-rt');
const dnIconElem: ReactElement = inclStaticIcon('arrow-dn');

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
                    {list.map((item: IObj, idx: number) => this.getListItem(item, idx))}
                </ul>
            </aside>
        );
    }

    getListItem(item: IObj, idx: number, parentIdx?: number): ReactElement {
        const { props, BASE_CLS, PARENT_CLS_SUFFIX, CHILD_CLS_SUFFIX, cssCls } = this;
        const { activeItem, itemKeys, childKey } = props;
        const [ idKey, childIdKey ] = itemKeys;

        const isParent: boolean = typeof parentIdx === 'undefined';
        const nestedItems = item[childKey];
        const nestedItemsTotal: number = nestedItems?.length;
        const isActive: boolean = item === activeItem;
        const showNestedItems: boolean = isActive || (nestedItems?.indexOf(activeItem) !== -1);

        const ITEM_TITLE: string = item[isParent ? idKey : childIdKey];
        const ITEM_KEY: string = `${BASE_CLS}__item${isParent ? `-${PARENT_CLS_SUFFIX}` : `-${CHILD_CLS_SUFFIX}`}-${idx}`;
        const ITEM_CLS: string = cssCls(`${BASE_CLS}__item`, (isParent ? PARENT_CLS_SUFFIX : CHILD_CLS_SUFFIX) + (isActive ? ' atv' : ''));
        const ITEM_TIER_CLS: string = `${BASE_CLS}__tier`;
        const ITEM_TITLE_CLS: string = `${BASE_CLS}__title`;
        const NESTED_LIST_CLS: string = cssCls(`${BASE_CLS}__list`, CHILD_CLS_SUFFIX);
        const itemTitle: ReactElement = <span className={ITEM_TITLE_CLS}>{ITEM_TITLE}</span>;

        return (
            <li
                className={ITEM_CLS}
                key={ITEM_KEY}
                onClick={(e) => this.onClick(e, { item, idx, parentIdx })}
                >{ isParent ?
                <>
                    <p className={ITEM_TIER_CLS}>
                        { isActive ? dnIconElem : rtIconElem }
                        { itemTitle }
                        { InclStaticNumBadge(nestedItemsTotal) }
                    </p>
                    <ul
                        className={NESTED_LIST_CLS}
                        style={{ maxHeight: showNestedItems ? '320px' : '0' }}
                        >
                        {/* only render nested list under active list for performance */}
                        { showNestedItems && nestedItems.map((childItem: IObj, childIdx: number) => this.getListItem(childItem, childIdx, idx)) }
                    </ul>
                </> :
                itemTitle }
            </li>
        );
    }

    onClick(evt: React.MouseEvent, arg: unknown) {
        evt.stopPropagation();
        this.props.onItemClick?.(evt, arg);
    }
}