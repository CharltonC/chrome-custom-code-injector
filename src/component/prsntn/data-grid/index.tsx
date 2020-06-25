import React, { Component, memo, ReactElement } from "react";
import { ClpsHandle } from '../../../service/handle/collapse';

import { IProps, IRow, TCmpCls, TFn, IState } from './type';


export class _DataGrid extends Component<IProps, any> {
    readonly clpsHandle = new ClpsHandle();

    constructor(props) {
        super(props);

        // TODO: only set collapse if rows.length >1
        this.state = {
            nestState: {}
        };
    }

    UNSAFE_componentWillReceiveProps({data}) {
        const { data: currData, rows } = this.props;

        // When there are nested rows and when data changes, reset the nesting state
        if (rows.length <= 1 || data === currData) return;
        this.setState({
            ...this.state,
            nestState: {}
        });
    }

    render() {
        const { data, rows, nestingOption } = this.props;
        const {  showInitial } = nestingOption;
        const rowConfigs = this.getMappedConfig(rows);
        return (
            <ul>
                {this.clpsHandle.getClpsState({data, rowConfigs, showTargetCtx: showInitial})}
            </ul>
        );
    }

    getMappedConfig(rowConfigs: IRow[]) {
        return rowConfigs.map((row: IRow, idx: number) => {
            const is1stRowConfig: boolean = idx === 0 && typeof row[0] === 'function';
            const transformFnIdx: number = is1stRowConfig ? 0 : 1;
            const transformFn = this.getCmpTransformFn(row[transformFnIdx]);
            return is1stRowConfig ? [transformFn] : [row[0], transformFn];
        });
    }

    getCmpTransformFn(Cmp: TCmpCls): TFn {
        return (mappedProps) => {
            const { nestState } = this.state;
            const { nestingOption } = this.props;
            const { itemCtx, nestedItems } = mappedProps;
            const hsClpsProps: boolean = nestedItems && nestingOption;
            // TODO: clpsProps type
            const clpsProps = hsClpsProps ? this.getClpsProps(mappedProps, nestState, nestingOption.showOnePerLvl) : {};
            return <Cmp key={itemCtx} {...mappedProps} {...clpsProps} />;
        };
    }

    getClpsProps(mappedProps, nestState: IState, showOnePerLvl: boolean) {
        // TODO: Renamed `isNestedOpen` to `isDefNestedOpen`
        const { itemCtx, itemKey, itemLvl, parentCtx, isNestedOpen: isDefNestedOpen } = mappedProps;
        const isInClpsState: boolean = typeof nestState[itemCtx] !== 'undefined';

        // Only Set the state for each Item during Initialization, if not use the existing one
        // TODO: separate method & move out of getClpsProps
        if (!isInClpsState) {
            nestState[itemCtx] = isDefNestedOpen;
        }
        const isNestedOpen: boolean = isInClpsState ? nestState[itemCtx] : isDefNestedOpen;

        // TODO: Separate method
        // Set the Collapse Fn
        const onCollapseChanged = () => {
            // TODO: Separate Method for getting impactedItemState
            // find the items that are at the same level and if they are open (true), set them to false
            let impactedItemsState = {};
            if (showOnePerLvl) {
                const itemCtxs: string[] = Object.getOwnPropertyNames(nestState);
                const isRootLvlItem: boolean = itemLvl === 0;
                const relCtx: string = isRootLvlItem ? '' : `${parentCtx}/${itemKey}:`;
                const relCtxPattern: RegExp = new RegExp(relCtx + '\\d+$');
                const impactedItemCtxs: string[] = itemCtxs.filter(ctx => {
                    return isRootLvlItem ?
                        Number.isInteger(Number(ctx)) :
                        relCtxPattern.test(ctx);
                });
                impactedItemsState = impactedItemCtxs.reduce((impactedState, ctx) => {
                    const isImpactedItemOpen: boolean = nestState[ctx];
                    return isImpactedItemOpen ? {
                        ...impactedState,
                        [ctx]: false
                    } : impactedState;
                }, {});
            }

            // Updates/Rerender
            this.setState({
                ...this.state,
                nestState: {
                    ...nestState,
                    ...impactedItemsState,
                    [itemCtx]: !isNestedOpen,
                }
            });
        };

        return { isNestedOpen, onCollapseChanged: onCollapseChanged.bind(this) };
    }
}

export const DataGrid = memo(_DataGrid);