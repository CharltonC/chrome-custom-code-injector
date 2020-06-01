import React, { Component, memo, ReactElement } from "react";
import { IProps } from './type';
import { inclStaticIcon } from '../../static/icon/';

export class _SideNav extends Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        const rtIconElem: ReactElement = inclStaticIcon('arrow-rt');
        const dnIconElem: ReactElement = inclStaticIcon('arrow-dn');

        // TODO: static badge

        return (
            <nav className="side-nav">
                <ul>
                    {/* TODO: `key attr` */}
                    <li className="side-nav__ls">
                        <p>
                            {rtIconElem}
                            {dnIconElem}
                            <span>Host ID 1</span>
                        </p>
                        <ul>
                            <li className="side-nav__nls">Path ID 1</li>
                            <li className="side-nav__nls">Path ID 2</li>
                            <li className="side-nav__nls">Path ID 3</li>
                        </ul>
                    </li>
                    <li className="side-nav__ls side-nav__ls--atv">
                        <p>
                            {rtIconElem}
                            {dnIconElem}
                            <span>Host ID 2</span>
                       </p>
                        <ul>
                            {/* TODO: `key attr` */}
                            <li className="side-nav__nls">Path ID 1</li>
                            <li className="side-nav__nls">Path ID 2</li>
                            <li className="side-nav__nls">Path ID 3</li>
                        </ul>
                    </li>
                    <li className="side-nav__ls">
                        <p>
                            {rtIconElem}
                            {dnIconElem}
                            <span>Host ID 3</span>
                        </p>
                        <ul>
                            <li className="side-nav__nls">Path ID 1</li>
                            <li className="side-nav__nls">Path ID 2</li>
                            <li className="side-nav__nls">Path ID 3</li>
                        </ul>
                    </li>
                </ul>
            </nav>
        );
    }
}

export const SideNav = memo(_SideNav);