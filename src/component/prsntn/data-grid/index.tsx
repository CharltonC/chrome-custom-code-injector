import React, { Component, memo, ReactElement } from "react";
import { IProps, TRow } from './type';


export class _DataGrid extends Component<IProps, any> {
    constructor(props) {
        super(props);
    }

    getUpadedCollapsedData(data, ctx, collapseKey) {
        const newData = data.slice(0);
        const item2bModified = ctx.reduce((d, ctxItem) => {
            const {key, idx: itemIdx} = ctxItem;
            const hsKey = typeof key !== 'undefined';
            const hsIdx = typeof itemIdx !== 'undefined';
            if (hsKey && hsIdx) return d[key][itemIdx];
            if (!hsKey && hsIdx) return d[itemIdx];
            return d;
        }, data);
        console.log(item2bModified);

        const isCollapsed: boolean = item2bModified[collapseKey];
        item2bModified[collapseKey] = !isCollapsed;
        return newData;
    }

    renderList(item: any, idx: number, nestLvlIdx: number = 0, ctx: any[]= [], ctxKey?: string): any {
        const { row } = this.props;
        const currRow = row[nestLvlIdx];
        if (!currRow) return null;

        ctx.push({key: ctxKey, idx});
        const [Cmp, nestedRowKey]: TRow = row[nestLvlIdx];
        // TODO: check nestedRowKey is defined
        const nestedData: any[] = item[nestedRowKey];
        const hsNestedData: boolean = Array.isArray(nestedData) && !!nestedData.length;
        const key: string = `ls-${nestLvlIdx}-${idx}`;
        let nestedRows: ReactElement[];

        // TODO: add active flag to determine if render is required for performance
        if (hsNestedData) {
            nestedRows = nestedData.map((subItem: any, subIdx: number) => this.renderList(subItem, subIdx, nestLvlIdx + 1, [...ctx], nestedRowKey));
        }

        const props = {key, item, nestLvlIdx, nestedRows, idx, ctx, getUpadedCollapsedData: this.getUpadedCollapsedData};

        return <Cmp {...props} />;
    }

    render() {
        const { data } = this.props;
        return (
            <ul>
                { data.map((item, idx) => this.renderList(item, idx, 0)) }
            </ul>
        );
    }
}

export const DataGrid = memo(_DataGrid);