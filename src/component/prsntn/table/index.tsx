import React, { Component, memo } from "react";

// TODO: Update Class name
export class _CmpCls extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                lorem
            </div>
        );
    }
}

export const CmpCls = memo(_CmpCls);