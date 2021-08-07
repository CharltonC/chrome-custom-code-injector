import React, { ReactElement } from "react";
import { MemoComponent } from '../../extendable/memo-component';
import { inclStaticIcon } from '../../static/icon';
import { NumBadge } from '../num-badge';
import { IProps, IState, IClickEvtArg, IItemAttrsQuery, IItemAttrs } from './type';

const BASE_CLS = 'side-nav';
const PARENT_CLS_SFX = 'parent';
const CHILD_CLS_SFX = 'child';
const CHILD_LIST_MAX_HEIGHT = '320px';
const $rtArrowIcon: ReactElement = inclStaticIcon('arrow-rt');
const $dnArrowIcon: ReactElement = inclStaticIcon('arrow-dn');

export class SideNav extends MemoComponent<IProps, IState> {
    static defaultProps: Partial<IProps> = {
        listTitleKey: 'title',
        childListKey: 'list',
        childListTitleKey: 'title',
        activeItemIdx: 0,
    };

    render() {
        const { cssCls, props } = this;
        const { list } = props;
        const LIST_CLS = cssCls(`${BASE_CLS}__list`, PARENT_CLS_SFX);

        return (
            <aside className={BASE_CLS}>
                <ul className={LIST_CLS}>
                    {list.map((item: AObj, idx: number) => this.renderListItem(item, idx))}
                </ul>
            </aside>
        );
    }

    renderListItem(item: AObj, idx: number): ReactElement {
        const { props, cssCls } = this;
        const {
            listTitleKey,
            childListKey,
            activeItemIdx,
            activeChildItemIdx,
         } = props;

        const nestedItems = item[childListKey];
        const nestedItemsTotal = nestedItems?.length;
        const isActive = idx === activeItemIdx;
        const showNestedItems = isActive && !!nestedItemsTotal;
        const hasActiveChild = Number.isInteger(activeChildItemIdx);

        const { ITEM_KEY, ITEM_CLS, ITEM_TITLE_CLS } = this.getItemAttrs({
            idx,
            suffix: PARENT_CLS_SFX,
            isActive,
            hasActiveChild
        });
        const ITEM_TITLE: string = item[listTitleKey];
        const ITEM_HEADER_CLS = `${BASE_CLS}__item-header`;
        const NESTED_LIST_CLS = cssCls(`${BASE_CLS}__list`, CHILD_CLS_SFX);

        const $arrowIcon = (isActive || showNestedItems) ? $dnArrowIcon : $rtArrowIcon;
        const childListStyle = { maxHeight: showNestedItems ? CHILD_LIST_MAX_HEIGHT : '0' };

        return (
            <li
                className={ITEM_CLS}
                key={ITEM_KEY}
                onClick={(evt) => this.onClick({ evt, item, idx })}
                >
                <p className={ITEM_HEADER_CLS}>
                    {$arrowIcon}
                    <span className={ITEM_TITLE_CLS}>{ITEM_TITLE}</span>
                    <NumBadge total={nestedItemsTotal} />
                </p>{ showNestedItems &&
                <ul
                    className={NESTED_LIST_CLS}
                    style={childListStyle}
                    >{ nestedItems.map((childItem: AObj | string, childIdx: number) =>
                        this.renderChildListItem({
                            item: childItem,
                            idx: childIdx,
                            parentIdx: idx
                        })
                    )}
                </ul>}
            </li>
        );
    }

    renderChildListItem({ item, idx, parentIdx }): ReactElement {
        const { childListTitleKey, activeChildItemIdx } = this.props;

        const isActive = idx === activeChildItemIdx;
        const baseEvtArg = { item, idx, parentIdx, isChild: true };
        const ITEM_TITLE: string = item?.[childListTitleKey] || item as string
        const { ITEM_KEY, ITEM_CLS, ITEM_TITLE_CLS } = this.getItemAttrs({
            idx,
            suffix: CHILD_CLS_SFX,
            isActive
        });

        return (
            <li
                className={ITEM_CLS}
                key={ITEM_KEY}
                onClick={(evt) => this.onClick({ ...baseEvtArg, evt })}>
                <span className={ITEM_TITLE_CLS}>{ITEM_TITLE}</span>
            </li>
        );
    }

    onClick(arg: IClickEvtArg): void {
        arg.evt.stopPropagation();
        this.props.onClick?.(arg);
    }

    getItemAttrs({ idx, suffix, isActive, hasActiveChild }: IItemAttrsQuery): IItemAttrs {
        const ACTIVE_CLS = isActive
            ? ` atv${hasActiveChild ? ' atv-parent' : ''}`
            : '';

        return {
            ITEM_KEY: `${BASE_CLS}__item-${suffix}-${idx}`,
            ITEM_CLS: this.cssCls(`${BASE_CLS}__item`, suffix + ACTIVE_CLS),
            ITEM_TITLE_CLS: `${BASE_CLS}__title`,
        };
    }
}