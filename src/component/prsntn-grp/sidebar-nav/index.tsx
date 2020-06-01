import React, { Component, memo } from "react";

export class _SidebarNav extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <nav>
                lorem
            </nav>
        );
    }
}

export const SidebarNav = memo(_SidebarNav);