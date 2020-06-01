import React, { Component, memo } from "react";
import { IProps } from './type';

export class _SideNav extends Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <nav className="side-nav">
                <ul className="side-nav__ls--top">
                    {/* TODO: `key attr` */}
                    <li>
                        <ul className="side-nav__ls--nst">
                            {/* TODO: `key attr` */}
                            <li>Path ID 1</li>
                            <li>Path ID 2</li>
                            <li>Path ID 3</li>
                        </ul>
                    </li>
                    <li>
                        <ul>
                            <li>Path ID 1</li>
                            <li>Path ID 2</li>
                            <li>Path ID 3</li>
                        </ul>
                    </li>
                    <li>
                        <ul>
                            <li>Path ID 1</li>
                            <li>Path ID 2</li>
                            <li>Path ID 3</li>
                        </ul>
                    </li>
                </ul>
            </nav>
        );
    }
}

export const SideNav = memo(_SideNav);