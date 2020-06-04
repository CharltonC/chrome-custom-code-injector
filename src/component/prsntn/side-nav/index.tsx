import React, { Component, memo, ReactElement } from "react";
import { IProps, IState, INestList, IList } from './type';
import { inclStaticIcon } from '../../static/icon/';
import { inclStaticNumBadge } from '../../static/num-badge/';

export class _SideNav extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = this.getIntState(props.list);
        this.onClick = this.onClick.bind(this);
    }

    /**
     * Check if the active list is still in the new list
     * - if YES, make it still active
     * - if not, make the 1st list active by def
     */
    UNSAFE_componentWillReceiveProps({list}: IProps): void {
        const { props } = this;
        const { atvLsIdx } = this.state;

        // Only proceed when passed list is different
        if (list === props.list) return;
        const currAtvLs = props.list[atvLsIdx];
        const currAtvLsIdxInNewList: number = list.indexOf(currAtvLs);
        const isCurrAtvLsInNewList: boolean = currAtvLsIdxInNewList !== -1;
        const isCurrAtvLsIdxDiffInNewList: boolean = isCurrAtvLsInNewList && (currAtvLsIdxInNewList !== atvLsIdx);

        // If the active list is in the new passed list however not in the same index we update the active state
        if (isCurrAtvLsIdxDiffInNewList) {
            this.setState({atvLsIdx: currAtvLsIdxInNewList});

        // If the active list is NOT in the new passed list, by def. we just make the 1st (if exist) active
        } else if (!isCurrAtvLsInNewList) {
            const state: IState = this.getIntState(list);
            this.setState(state);
        }
    }

    getLsCls(baseCls: string, isAtv: boolean): string {
        return isAtv ? `${baseCls} ${baseCls}--atv` : baseCls;
    }

    /**
     * Config the active list when a new or diff. list is passed
     */
    getIntState(list: INestList[]): IState {
        const hsList: boolean = typeof list !== 'undefined' && list.length > 0;
        return {
            atvLsIdx: hsList ? 0 : null,
            atvNestLsIdx: null
        };
    }

    onClick(evt: React.MouseEvent<HTMLElement, MouseEvent>, atvLsIdx: number, atvNestLsIdx: number = null): void {
        evt.stopPropagation();
        const { state } = this;
        const { list, onAtvListChange } = this.props;
        const isAtvList: boolean = atvLsIdx === state.atvLsIdx;
        const isNotSameNestedList = atvNestLsIdx !== state.atvNestLsIdx;

        // If parent list is diff.
        if (!isAtvList) this.setState({
            atvLsIdx,
            atvNestLsIdx: null
        });

        // if parent list is same but child list is diff.
        if (isAtvList && isNotSameNestedList) this.setState({
            atvNestLsIdx
        });

        if (onAtvListChange) onAtvListChange(list, atvLsIdx, atvNestLsIdx);
    }

    render() {
        const { list } = this.props;
        const { atvLsIdx, atvNestLsIdx } = this.state;

        // List & List Item
        const lsBaseCls: string = 'side-nav__ls';
        const nstLsBaseCls: string = 'side-nav__nls';
        const lsItemBaseCls: string = `${lsBaseCls}-item`;
        const nstLsItemBaseCls: string = `${nstLsBaseCls}-item`;

        // List Item content: Row, Title Text, Dropdown Arrows
        const lsTierCls: string = `side-nav__tier`;
        const titleCls: string = 'side-nav__title';
        const rtIconElem: ReactElement = inclStaticIcon('arrow-rt');
        const dnIconElem: ReactElement = inclStaticIcon('arrow-dn');

        return (
            <nav className="side-nav">
                <ul>{list.map((ls: INestList, lsIdx: number) => {
                    const { id, nestList } = ls;
                    const isAtvIdx: boolean = atvLsIdx === lsIdx;
                    const lsTotal: number = nestList.length;
                    const isAtvWithChildLs: boolean = isAtvIdx && !!lsTotal;
                    const lsCls: string = this.getLsCls(lsItemBaseCls, (isAtvIdx && atvNestLsIdx === null));
                    const lsKey: string = `${lsItemBaseCls}-${lsIdx}`;

                    return (
                    <li className={lsCls} key={lsKey} onClick={(e) => {this.onClick(e, lsIdx);}}>
                        <p className={lsTierCls}>
                            { isAtvIdx ? dnIconElem : rtIconElem }
                            <a className={titleCls}>{id}</a>
                            { inclStaticNumBadge(lsTotal) }
                        </p>
                        <ul className={nstLsBaseCls} style={{maxHeight: isAtvWithChildLs ? '320px' : '0'}}>
                            { /* only render nested list under active list for performance */
                            isAtvWithChildLs ?
                            nestList.map((nstLs: IList, nstLsIdx: number) => {
                                const nstLsCls: string = this.getLsCls(nstLsItemBaseCls, atvNestLsIdx === nstLsIdx);
                                const nstLsKey: string = `${nstLsItemBaseCls}-${nstLsIdx}`;

                                return (
                                <li className={nstLsCls} key={nstLsKey} onClick={(e) => {this.onClick(e, lsIdx, nstLsIdx);}}>
                                    <a className={titleCls}>
                                        {nstLs.id}
                                    </a>
                                </li>
                                );
                            }):
                            null }
                        </ul>
                    </li>
                    );
                })}</ul>
            </nav>
        );
    }
}

export const SideNav = memo(_SideNav);