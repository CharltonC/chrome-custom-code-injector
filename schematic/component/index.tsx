import React, { Component, memo } from "react";

// TODO: Update Class name
export class _CmpCls extends Component {
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

export const CmpCls = memo(_CmpCls);