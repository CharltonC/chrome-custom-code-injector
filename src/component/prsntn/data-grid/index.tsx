import React, { Component, memo, ReactElement } from "react";
import { ClpsHandle } from '../../../service/handle/collapse';

import { IProps, IRow, TCmpCls, TFn } from './type';


export class _DataGrid extends Component<IProps, any> {
    readonly clpsHandle = new ClpsHandle();

    constructor(props) {
        super(props);

        // TODO: only set collapse if rows.length >1
        this.state = {
            collapse: {}
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

    createTransformFn(Cmp: TCmpCls): TFn {
        const { state } = this;
        const { collapse } = state;
        const { showCollapse } = this.props;

        return (props) => {
            const { itemCtx, nestedItems } = props;

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
                return <Cmp key={itemCtx} {...props} />;

            /**
             * Case 2 - For internal generated collapse state
             *
             * Set based on user pref (i.e. "ALL", "NONE", ctx)
             */
            } else {
                // Set Initial Collapse State based on user option if needed
                if (nestedItems && typeof collapse[itemCtx] === 'undefined') {
                    // TODO: also check if there is `nestedItems`
                    collapse[itemCtx] = !this.clpsHandle.isNestedOpen(itemCtx, showCollapse);
                }

                // Callback for Collapse state change
                const onClpsChange = () => {
                    if (!nestedItems) return;
                    // TODO: Check if there is nestedItems
                    this.setState({
                        ...state,
                        collapse: {
                            ...collapse,
                            [itemCtx]: !collapse[itemCtx]
                        }
                    });
                };

                return <Cmp
                    key={itemCtx}
                    {...props}
                    isCollapsed={this.state.collapse[itemCtx]}
                    onClpsChange={onClpsChange}
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