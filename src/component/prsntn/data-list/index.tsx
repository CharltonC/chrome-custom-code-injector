import React, { Component, memo, ReactElement } from "react";
import { IProps, TCmpCls, TRow, INestedRowProps } from './type';

export class _DataList extends Component<IProps, any> {
    constructor(props) {
        super(props);
    }

    renderList(item: any, idx: number, nestLvlIdx: number = 0): any {
        const { row } = this.props;
        const currRow = row[nestLvlIdx];
        if (!currRow) return null;

        const [itemKey, Cmp]: TRow = row[nestLvlIdx];
        const nestedData: any[] = item[itemKey];
        const hsNestedData: boolean = Array.isArray(nestedData) && !!nestedData.length;
        const key: string = `ls-${nestLvlIdx}-${idx}`;
        let cmp: ReactElement;
        let nestedRows: ReactElement[];

        if (hsNestedData) {
            nestedRows = nestedData.map((subItem: any, subIdx: number) => this.renderList(subItem, subIdx, nestLvlIdx + 1));
        }

        return <Cmp key={key} item={item} nestedRows={nestedRows} idx={idx}/>;
    }

    render() {
        const { data } = this.props;

        return (
            <ul>
                { data.map((item, idx) => this.renderList(item, idx)) }
            </ul>
        );
    }
}

export const DataList = memo(_DataList);