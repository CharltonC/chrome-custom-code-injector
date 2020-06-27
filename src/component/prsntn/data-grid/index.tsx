import React, { Component, memo, ReactElement } from "react";

import { IRawRowConfig, IItemCtx } from '../../../service/handle/collapse/type';
import { ClpsHandle } from '../../../service/handle/collapse';

import { IProps, IRow, TCmpCls, TFn, TNestState, IClpsProps, IState } from './type';

export class _DataGrid extends Component<IProps, IState> {
    readonly clpsHandle = new ClpsHandle();

    constructor(props: IProps) {
        super(props);
        this.state = {
            nestState: {}
        };
    }

    UNSAFE_componentWillReceiveProps({data}): void {
        const { data: currData, rows } = this.props;

        // When there are nested rows and when data changes, reset the nesting state
        if (rows.length <= 1 || data === currData) return;
        this.setState({...this.state, nestState: {}});
    }

    render() {
        const { data, rows: rowsConfig, nestingOption, type } = this.props;
        const { showInitial: visiblePath } = nestingOption;
        const rows: IRawRowConfig[] = this.getMappedConfig(rowsConfig);
        const rowElems: ReactElement[] = this.clpsHandle.getClpsState({data, rows, visiblePath});
        return (type === 'table') ? this.renderTable(rowElems) : this.renderList(rowElems);
    }

    renderList(items: ReactElement[]): ReactElement {
        return (
            <ul>
                {items}
            </ul>
        );
    }

    renderTable(items: ReactElement[]): ReactElement {
        return (
            <table>
                <tbody>
                    {items}
                </tbody>
            </table>
        );
    }

    getMappedConfig(rows: IRow[]): IRawRowConfig[] {
        return rows.map((row: IRow, idx: number) => {
            const is1stRowConfig: boolean = idx === 0 && typeof row[0] === 'function';
            const transformFnIdx: number = is1stRowConfig ? 0 : 1;
            const transformFn = this.getCmpTransformFn(row[transformFnIdx]);
            return (is1stRowConfig ? [transformFn] : [row[0], transformFn]) as IRawRowConfig;
        });
    }

    getCmpTransformFn(Cmp: TCmpCls): TFn {
        return (itemCtx: IItemCtx) => {
            const { nestState } = this.state;
            const { nestingOption } = this.props;
            const { itemPath, nestedItems } = itemCtx;
            const hsClpsProps: boolean = nestedItems && nestingOption;
            const clpsProps: IClpsProps = hsClpsProps ? this.getItemClpsProps(itemCtx, nestState) : {};
            return <Cmp key={itemPath} {...itemCtx} {...clpsProps} />;
        };
    }

    //// Collapse Relevant
    getItemClpsProps(itemCtx: IItemCtx, nestState: TNestState): IClpsProps {
        const { itemPath, isDefNestedOpen } = itemCtx;

        // Only Set the state for each Item during Initialization, if not use the existing one
        const isInClpsState: boolean = typeof nestState[itemPath] !== 'undefined';
        if (!isInClpsState) this.setItemInitialClpsState(nestState, itemCtx);

        const isNestedOpen: boolean = isInClpsState ? nestState[itemPath] : isDefNestedOpen;
        const onCollapseChanged = this.getItemOnClpsChangedFn(itemCtx, isNestedOpen);

        return { isNestedOpen, onCollapseChanged };
    }

    setItemInitialClpsState(nestState: TNestState, {itemPath, isDefNestedOpen}: IItemCtx): void {
        nestState[itemPath] = isDefNestedOpen;
    }

    getItemOnClpsChangedFn(itemCtx: IItemCtx, isNestedOpen: boolean): TFn {
        const { nestState } = this.state;
        const { showOnePerLvl } = this.props.nestingOption;

        return (() => {
            // Find the items that are at the same level and if they are open (true), close them (set them to false)
            const impactedItemsState: TNestState = showOnePerLvl ? this.getImpactedItemsClpsState(nestState, itemCtx) : {};
            const itemState: TNestState = {[itemCtx.itemPath]: !isNestedOpen};
            this.setState({
                ...this.state,
                nestState: {
                    ...nestState,
                    ...impactedItemsState,
                    ...itemState
                }
            });
        }).bind(this);
    }

    getImpactedItemsClpsState(nestState: TNestState, {itemLvl, itemKey, parentPath}: IItemCtx): TNestState {
        const itemPaths: string[] = Object.getOwnPropertyNames(nestState);
        const isRootLvlItem: boolean = itemLvl === 0;
        const relCtx: string = isRootLvlItem ? '' : `${parentPath}/${itemKey}:`;
        const relCtxPattern: RegExp = new RegExp(relCtx + '\\d+$');

        const impactedItemPaths: string[] = itemPaths.filter((ctx: string) => {
            return isRootLvlItem ?
                Number.isInteger(Number(ctx)) :
                relCtxPattern.test(ctx);
        });

        return impactedItemPaths.reduce((impactedState: TNestState, ctx: string) => {
            const isImpactedItemOpen: boolean = nestState[ctx];
            return isImpactedItemOpen ? {...impactedState, [ctx]: false} : impactedState;
        }, {});
    }
}

export const DataGrid = memo(_DataGrid);