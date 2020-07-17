import { IUiHandle } from '../../../asset/ts/type/ui-handle';
import {
    IOption,
    TLsItem, TStrSortOrder,
    TFn
} from './type';

export class SortHandle implements IUiHandle {
    readonly noOrder: TStrSortOrder = 0;
    readonly baOrder: TStrSortOrder = 1;
    readonly abOrder: TStrSortOrder = -1;

    //// Core
    sortByObjKey(list: TLsItem[], {key, isAsc, hsLocale}: IOption): TLsItem[] {
        return list.sort((a: TLsItem, b: TLsItem) => {
            const valA: any = a[key];
            const valB: any = b[key];
            const isNum: boolean = this.isValSameType(valA, valB, 'number');
            const isStr: boolean = this.isValSameType(valA, valB, 'string');
            const isLocaleStr: boolean = isStr && hsLocale;

            // only sort when value are same type of string/locale-string/number
            if (isNum) return this.compareNum(valA, valB, isAsc);
            if (isLocaleStr) return this.compareLocaleStr(valA, valB, isAsc);
            if (isStr) return this.compareStr(valA, valB, isAsc);
            return this.noOrder;
        });
    }

    compareNum(a: number, b: number, isAsc: boolean): number {
        const diff: number = a - b;
        return isAsc ? diff : -diff;
    }

    compareStr(a: string, b: string, isAsc: boolean): TStrSortOrder {
        const { noOrder, abOrder, baOrder } = this;
        const isCurrAsc: boolean = a < b;
        const isCurrDsc: boolean = a > b;

        if (isCurrAsc) return isAsc ? abOrder : baOrder;
        if (isCurrDsc) return isAsc ? baOrder : abOrder;
        return noOrder;
    }

    compareLocaleStr(a: string, b: string, isAsc: boolean): number {
        return isAsc ? a.localeCompare(b) : b.localeCompare(a);
    }

    isValSameType(valA: any, valB: any, type: string): boolean {
        return typeof valA === type && typeof valB === type;
    }

    shallSort({ key, isAsc }: IOption): boolean {
        return key && typeof isAsc !== 'undefined';
    }

    //// Option & State
    /**
     * Merge the updated option with existing option (either custom or default)
     */
    createOption(modOption: Partial<IOption>, existingOption?: IOption): IOption {
        const baseOption: IOption = existingOption ? existingOption : this.getDefOption();
        return { ...baseOption, ...modOption };
    }

    getDefOption(): IOption {
        return {
            key: null,
            isAsc: null,
            hsLocale: false,
            reset: false,
        };
    }

    // TODO: type
    // Make sure sortedData ? sortedData : originalData;
    createState(data: TLsItem[], option: IOption){
        const shallSort: boolean = this.shallSort(option);
        const dataCopy: TLsItem[] = data.slice(0);
        return {
            data:  shallSort ? this.sortByObjKey(dataCopy, option) : null
        };
    }

    getDefState() {
        return { data: null };
    }

    //// Generic UI Component Related
    // TODO: query type
    createGenericCmpAttr(query, sortKey: string) {
        const { data, option, callback } = query;
        const onEvt: TFn = this.getGenericCmpEvtHandler(data, option, callback);
        const sortBtnAttr = this.createSortBtnAttr(onEvt, option, sortKey);
        return { sortBtnAttr };
    }

    // TODO: query & return type
    createSortBtnAttr(onEvt: TFn, { key, isAsc, reset }: IOption, sortKey: string) {
        const isCurrTh: boolean = sortKey === key;
        const shallClear: boolean = reset && !isAsc;

        return {
            // up/dn arrow highlight state for the sort btn
            // - no highlight state for non-current header or if current header sort is temp. off
            isAsc: isCurrTh ? isAsc : null,

            // handler for sort btn
            onClick: () => onEvt({
                key: isCurrTh ? (shallClear ? null : sortKey) : sortKey,
                isAsc: isCurrTh ? (shallClear ? null : !isAsc) : true
            })
        };
    }

    // TODO: type for sortState
    getGenericCmpEvtHandler(data: TLsItem[], option: IOption, callback?: TFn): TFn {
        return ((modOption: Partial<IOption>): void => {
            const sortOption: IOption = this.createOption(modOption, option);
            const sortState = this.createState(data, sortOption);
            if (callback) callback({ sortOption, sortState });
        }).bind(this);
    }
}
