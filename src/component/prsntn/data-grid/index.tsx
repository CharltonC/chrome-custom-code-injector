import React, { Component, memo, ReactElement } from "react";
import { ClpsHandle } from '../../../service/handle/collapse';

import { IProps, IRow, TCmpCls, TFn } from './type';


export class _DataGrid extends Component<IProps, any> {
    readonly clpsHandle = new ClpsHandle();

    constructor(props) {
        super(props);

        // TODO: only set collapse if rows.length >1
        this.state = {
            collapse: {
            }
        };
    }

    createMappedConfig(rowConfigs: IRow[]) {
        return rowConfigs.map((row: IRow, idx: number) => {
            const is1stRowConfig: boolean = idx === 0 && typeof row[0] === 'function';
            const transformFnIdx: number = is1stRowConfig ? 0 : 1;
            const transformFn = this.createTransformFn(row[transformFnIdx]);
            return is1stRowConfig ? [transformFn] : [row[0], transformFn];
        });
    }

    createIntCollapseProps(showCollapse, state, mappedProps) {
        const { collapse } = state;
        const { itemCtx, nestedItems } = mappedProps;

        if (!showCollapse || !nestedItems) return {};

        const isShowOneOnly: boolean = (typeof showCollapse === 'string' && showCollapse !== 'ALL' && showCollapse !== 'NONE');
        let isCollapsed: boolean = true;

        if (isShowOneOnly) {
            const keys = Object.getOwnPropertyNames(collapse);

            // 1st Initial call
            if (!keys.length) {
                isCollapsed = !this.clpsHandle.isNestedOpen(itemCtx, [showCollapse]);

            // 2nd call & onwards
            } else {
                const [key] = keys;
                const isLastClpsItemCollapsed: boolean = collapse[key];
                if (!isLastClpsItemCollapsed) {
                    isCollapsed = !this.clpsHandle.isNestedOpen(itemCtx, keys);
                }
            }

        } else {
            isCollapsed = collapse[itemCtx];
        }

        const onClpsChange = () => {
            const clpsState = isShowOneOnly ? {[itemCtx]: !isCollapsed} : {
                ...collapse,
                [itemCtx]: !isCollapsed
            };
            this.setState({
                ...state,
                collapse: clpsState
            });
        };
        return { isCollapsed, onClpsChange };
    }

    createTransformFn(Cmp: TCmpCls): TFn {
        return (mappedProps) => {
            const { state } = this;
            const { collapse } = state;
            const { showCollapse } = this.props;
            const { itemCtx, nestedItems } = mappedProps;

            // TODO: if one collapse effect one other (on a diff. hiearchy)

            /**
             * Case 1 - For user provided key
             *
            */
            if (typeof showCollapse === 'undefined') {
                // TODO:
                // onClpsChange = () => {
                //     item[key] = !item[key];
                //     return data.slice(0);
                // };
                return <Cmp key={itemCtx} {...mappedProps} />;

            /**
             * Case 2 - For internal generated collapse state
             *
             * Set based on user pref (i.e. "ALL", "NONE", ctx)
             */
            } else {
                // TODO: make this non-dependent on the state & do crud on state
                // Check if the state has been initially set, set it if not
                // Set Initial Collapse State based on user option if needed
                const isShowOneOnly: boolean = (typeof showCollapse === 'string' && showCollapse !== 'ALL' && showCollapse !== 'NONE');
                if (nestedItems) {
                    if (isShowOneOnly) {
                        if (!Object.getOwnPropertyNames(collapse).length && itemCtx === showCollapse) {
                            collapse[itemCtx] = false;
                        }
                    } else if (typeof collapse[itemCtx] === 'undefined') {
                        collapse[itemCtx] = !this.clpsHandle.isNestedOpen(itemCtx, showCollapse);
                    }
                }

                const collapseProps = this.createIntCollapseProps(showCollapse, state, mappedProps);

                return <Cmp
                    key={itemCtx}
                    {...mappedProps}
                    {...collapseProps}
                    />
            }
        };
    }

    render() {
        const { data, rows } = this.props;
        const rowConfigs = this.createMappedConfig(rows);
        return (
            <ul>
                {this.clpsHandle.getClpsState({data, rowConfigs})}
            </ul>
        );
    }
}

export const DataGrid = memo(_DataGrid);