import React, { Component, memo, ReactElement } from "react";
import { IProps, IState, IList } from './type';
import { inclStaticIcon } from '../../static/icon/';

export class _SideNav extends Component<IProps, IState> {
    hsList: boolean;

    constructor(props: IProps) {
        super(props);

        const { list } = props;
        this.hsList = typeof list !== 'undefined';
        this.state = {
            atvIdx: this.hsList ? 0 : null
        };
    }

    onListClick(evt): void {

    }

    render() {
        const { list } = this.props;
        const { atvIdx } = this.state;

        const lsCls: string = 'side-nav__ls';

        const rtIconElem: ReactElement = inclStaticIcon('arrow-rt');
        const dnIconElem: ReactElement = inclStaticIcon('arrow-dn');
        // TODO: static badge


        return (
            <nav className="side-nav">
                <ul>{list.map(({name, nestedList}: IList, idx: number) => {
                    const isAtv: boolean = atvIdx === idx;
                    const listCls: string = isAtv ? `${lsCls} ${lsCls}--atv` : lsCls;
                    const totalList: number = nestedList.length;
                    const totalListTxt: string = totalList > 9 ? '9+' : `${totalList}`;
                    /* TODO: `key attr` */

                    return (<li className={listCls}>
                            <p>
                                {isAtv ? dnIconElem : rtIconElem}
                                <span className="side-nav__title">{name}</span>
                                <span className="badge">{totalListTxt}</span>
                            </p>
                            <ul>{nestedList.map((lsName: string, idx: number) => {
                                return (
                                    <li className="side-nav__nls">{lsName}</li>
                                );
                            })}</ul>
                    </li>);
                })}</ul>
            </nav>
        );
    }
}

export const SideNav = memo(_SideNav);