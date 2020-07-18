import React, { Component, memo } from "react";

export class _ExpandableWrapper extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
            </>
        );
    }
}

export const Expandable = memo(_ExpandableWrapper);