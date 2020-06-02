import React, { Component, memo, ReactElement } from "react";
import { IProps, IState, INestList, IList } from './type';
import { inclStaticIcon } from '../../static/icon/';

export class _SideNav extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = this.getIntState(props.list);
        this.onClick = this.onClick.bind(this);
    }

    /**
     * ONLY After initial render and when a diff. props (list) is received
     * - this will def. the active item to be the top/1st list item
     */
    UNSAFE_componentWillReceiveProps({list}: IProps): void {
        if (list === this.props.list) return;
        let state: IState = this.getIntState(list);
        this.setState(state);
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

        const lsBaseCls: string = 'side-nav__ls';
        const nstLsBaseCls: string = 'side-nav__nls';

        const rtIconElem: ReactElement = inclStaticIcon('arrow-rt');
        const dnIconElem: ReactElement = inclStaticIcon('arrow-dn');
        // TODO: static badge

        return (
            <nav className="side-nav">
                <ul>{list.map((ls: INestList, lsIdx: number) => {
                    const { id, nestList } = ls;
                    const isAtvIdx: boolean = atvLsIdx === lsIdx;
                    const lsTotal: number = nestList.length;

                    const lsCls: string = this.getLsCls(lsBaseCls, (isAtvIdx && atvNestLsIdx === null));
                    const lsKey: string = `${lsBaseCls}-${lsIdx}`;
                    const lsTotalTxt: string = this.getBadgeTxt(lsTotal);

                    return <li className={lsCls} key={lsKey} onClick={(e) => {this.onClick(e, lsIdx);}}>
                            <p>
                                {isAtvIdx ? dnIconElem : rtIconElem}
                                <a className="side-nav__title">{id}</a>
                                <span className="badge">{lsTotalTxt}</span>
                            </p>
                            {/* only render nested list under active list for performance */}
                            {
                                isAtvIdx && lsTotal ?
                                <ul>{nestList.map((nstLs: IList, nstLsIdx: number) => {
                                    const nstLsCls: string = this.getLsCls(nstLsBaseCls, atvNestLsIdx === nstLsIdx);
                                    const nstLsKey: string = `${nstLsBaseCls}-${nstLsIdx}`;

                                    return (
                                    <li className={nstLsCls} key={nstLsKey} onClick={(e) => {this.onClick(e, lsIdx, nstLsIdx);}}>
                                        <a className="side-nav__title">
                                            {nstLs.id}
                                        </a>
                                    </li>
                                    );
                                })}</ul> :
                                null
                            }
                    </li>;
                })}</ul>
            </nav>
        );
    }

    getLsCls(baseCls: string, isAtv: boolean): string {
        return isAtv ? `${baseCls} ${baseCls}--atv` : baseCls;
    }

    getBadgeTxt(total: number): string {
        return total > 9 ? '9+' : `${total}`;
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
}

export const SideNav = memo(_SideNav);