import React, { ReactElement } from "react";
import { MemoComponent } from '../../extendable/memo-component';
import { IProps, IState, INestList, IList } from './type';
import { inclStaticIcon } from '../../static/icon';
import { InclStaticNumBadge } from '../../static/num-badge';

export class SideNav extends MemoComponent<IProps, IState> {
    //// Element class name constants: list, list items, list item contents (Row, Title Text, Dropdown Arrows)
    readonly baseCls: string = 'side-nav';
    readonly lsBaseCls: string = `${this.baseCls}__ls`;
    readonly nstLsBaseCls: string = `${this.baseCls}__nls`;
    readonly lsItemBaseCls: string = `${this.lsBaseCls}-item`;
    readonly nstLsItemBaseCls: string = `${this.nstLsBaseCls}-item`;
    readonly lsTierCls: string = `${this.baseCls}__tier`;
    readonly titleCls: string = `${this.baseCls}__title`;

    constructor(props: IProps) {
        super(props);
        this.state = this.getIntitalState(props.list);
        this.onClick = this.onClick.bind(this);
    }

    /**
     * Check if the active list is still in the new list
     * - if YES, make it still active
     * - if not, make the 1st list active by def
     */
    UNSAFE_componentWillReceiveProps({list}: IProps): void {
        const { props } = this;
        const { atvLsIdx } = this.state;

        // Only proceed when passed list is different
        if (list === props.list) return;
        const currAtvLs = props.list[atvLsIdx];
        const currAtvLsIdxInNewList: number = list.indexOf(currAtvLs);
        const isCurrAtvLsInNewList: boolean = currAtvLsIdxInNewList !== -1;
        const isCurrAtvLsIdxDiffInNewList: boolean = isCurrAtvLsInNewList && (currAtvLsIdxInNewList !== atvLsIdx);

        // If the active list is in the new passed list however not in the same index we update the active state
        if (isCurrAtvLsIdxDiffInNewList) {
            this.setState({atvLsIdx: currAtvLsIdxInNewList});

        // If the active list is NOT in the new passed list, by def. we just make the 1st (if exist) active
        } else if (!isCurrAtvLsInNewList) {
            const state: IState = this.getIntitalState(list);
            this.setState(state);
        }
    }

    getLsCls(baseCls: string, isAtv: boolean): string {
        return isAtv ? `${baseCls} ${baseCls}--atv` : baseCls;
    }

    getNestedLsItems(nestList: IList[], lsIdx: number, atvNestLsIdx: number): ReactElement[] {
        const { nstLsItemBaseCls, titleCls } = this;

        return nestList.map((nstLs: IList, nstLsIdx: number) => {
            const nstLsCls: string = this.getLsCls(nstLsItemBaseCls, atvNestLsIdx === nstLsIdx);
            const nstLsKey: string = `${nstLsItemBaseCls}-${nstLsIdx}`;

            return (
            <li className={nstLsCls}
                key={nstLsKey}
                onClick={(e) => {this.onClick(e, lsIdx, nstLsIdx);}}
                >
                <span className={titleCls}>{nstLs.id}</span>
            </li>
            );
        })
    }

    /**
     * Config the active list when a new or diff. list is passed
     */
    getIntitalState(list: INestList[]): IState {
        const hsList: boolean = typeof list !== 'undefined' && list.length > 0;
        return {
            atvLsIdx: hsList ? 0 : null,
            atvNestLsIdx: null
        };
    }

    onClick(evt: React.MouseEvent<HTMLElement, MouseEvent>, atvLsIdx: number, atvNestLsIdx: number = null): void {
        evt.stopPropagation();
        const { state } = this;
        const { list, onAtvListChange } = this.props;
        const isAtvList: boolean = atvLsIdx === state.atvLsIdx;
        const isNotSameNestedList = atvNestLsIdx !== state.atvNestLsIdx;

        // If parent list is diff.
        if (!isAtvList) this.setState({
            atvLsIdx,
            atvNestLsIdx: null
        });

        // if parent list is same but child list is diff.
        if (isAtvList && isNotSameNestedList) this.setState({
            atvNestLsIdx
        });

        onAtvListChange?.(list, atvLsIdx, atvNestLsIdx);
    }

    render() {
        const { baseCls, lsBaseCls, nstLsBaseCls, lsItemBaseCls, lsTierCls, titleCls } = this;
        const { list } = this.props;
        const { atvLsIdx, atvNestLsIdx } = this.state;

        // Dropdown Arrows
        const rtIconElem: ReactElement = inclStaticIcon('arrow-rt');
        const dnIconElem: ReactElement = inclStaticIcon('arrow-dn');

        return (
            <aside className={baseCls}>
                <ul className={lsBaseCls}>{list.map((ls: INestList, lsIdx: number) => {
                    const { id, nestList } = ls;
                    const isAtvIdx: boolean = atvLsIdx === lsIdx;
                    const lsTotal: number = nestList?.length;
                    const isAtvWithChildLs: boolean = isAtvIdx && !!lsTotal;
                    const lsCls: string = this.getLsCls(lsItemBaseCls, (isAtvIdx && atvNestLsIdx === null));
                    const lsKey: string = `${lsItemBaseCls}-${lsIdx}`;

                    return (
                    <li className={lsCls} key={lsKey} onClick={(e) => {this.onClick(e, lsIdx);}}>
                        <p className={lsTierCls}>
                            { isAtvIdx ? dnIconElem : rtIconElem }
                            <span className={titleCls}>{id}</span>
                            { InclStaticNumBadge(lsTotal) }
                        </p>
                        <ul className={nstLsBaseCls} style={{maxHeight: isAtvWithChildLs ? '320px' : '0'}}>
                            {
                                /* only render nested list under active list for performance */
                                isAtvWithChildLs ? this.getNestedLsItems(nestList, lsIdx, atvNestLsIdx) : null
                            }
                        </ul>
                    </li>
                    );
                })}</ul>
            </aside>
        );
    }
}