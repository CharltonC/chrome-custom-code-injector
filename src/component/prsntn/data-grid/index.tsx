import React, { Component, memo, ReactElement } from "react";
import { ClpsHandle } from '../../../service/handle/collapse';

import { IProps, IRow, TCmpCls, TFn } from './type';


export class _DataGrid extends Component<IProps, any> {
    readonly clpsHandle = new ClpsHandle();
    rowConfigs;
    mappedItems: ReactElement[];

    constructor(props) {
        super(props);
        const { data, rows } = props;
        const rowConfigs = this.createMappedConfig(rows);
        this.rowConfigs = rowConfigs;
        this.mappedItems = this.clpsHandle.getClpsState({data, rowConfigs});
    }

    UNSAFE_componentWillReceiveProps({data}: IProps) {
        // Reconstruct the mappedItems when data changes
        this.mappedItems = this.clpsHandle.getClpsState({data, rowConfigs: this.rowConfigs});
    }

    createMappedConfig(rowConfigs: IRow[]) {
        return rowConfigs.map((row: IRow, idx: number) => {
            const is1stRowConfig: boolean = idx === 0 && typeof row[0] === 'function';
            const transformFnIdx: number = is1stRowConfig ? 0 : 1;
            const transformFn = this.createTransformFn(row[transformFnIdx]);
            return is1stRowConfig ? [ transformFn ] : [ row[0], transformFn ];
        });
    }

    createTransformFn(Cmp: TCmpCls): TFn {
        /**
         * Case 1 - For user provided key
         * onClpsChange = () => {
                item[key] = !item[key];
                return data.slice(0);
            * }
            */
        return (props) => <Cmp key={props.itemCtx} {...props} />;
    }

    render() {
        return (
            <ul>
                {this.mappedItems}
            </ul>
        );
    }
}

export const DataGrid = memo(_DataGrid);