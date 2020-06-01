import React, { Component, memo, ReactElement } from "react";
import { IProps, IState, INestList, IList } from './type';
import { inclStaticIcon } from '../../static/icon/';

export class _SideNav extends Component<IProps, IState> {
    hsList: boolean;

    constructor(props: IProps) {
        super(props);

        const { list } = props;
        this.hsList = typeof list !== 'undefined' && list.length > 0;
        this.state = {
            atvLsIdx: this.hsList ? 0 : null,
            atvNestLsIdx: null,
        };

        this.onClick = this.onClick.bind(this);
    }

    getLsCls(baseCls: string, isAtv: boolean): string {
        return isAtv ? `${baseCls} ${baseCls}--atv` : baseCls;
    }

    getBadgeTxt(total: number): string {
        return total > 9 ? '9+' : `${total}`;
    }

    onClick(evt: React.MouseEvent<HTMLElement, MouseEvent>, atvLsIdx: number, atvNestLsIdx: number = null): void {
        evt.stopPropagation();

        const { state } = this;
        const isAtvList: boolean = atvLsIdx === state.atvLsIdx;
        const isNotSameNestedList = atvNestLsIdx !== state.atvNestLsIdx;

        if (!isAtvList) this.setState({
            atvLsIdx,
            atvNestLsIdx: null
        });

        if (isAtvList && isNotSameNestedList) this.setState({
            atvNestLsIdx
        });
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

                    /* TODO: `key attr` */

                    return <li className={lsCls} key={lsKey} onClick={(e) => {this.onClick(e, lsIdx);}}>
                            <p>
                                {isAtvIdx ? dnIconElem : rtIconElem}
                                <a className="side-nav__title">{id}</a>
                                <span className="badge">{lsTotalTxt}</span>
                            </p>
                            {
                                isAtvIdx ?
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
}

export const SideNav = memo(_SideNav);