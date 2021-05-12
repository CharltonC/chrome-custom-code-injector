import { IUiHandle } from '../../asset/ts/type/ui-handle';
import {
    IOption,
    IState,
    ICmpAttrQuery, ICmpAttr, ICmpSortBtnAttr,
    ALsItem, AStrSortOrder
} from './type';

export class SortHandle implements IUiHandle {
    readonly noOrder: AStrSortOrder = 0;
    readonly baOrder: AStrSortOrder = 1;
    readonly abOrder: AStrSortOrder = -1;

    //// Core
    sortByObjKey(list: ALsItem[], {key, isAsc, hsLocale}: IOption): ALsItem[] {
        return list.sort((a: ALsItem, b: ALsItem) => {
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

    // compareStr(a: string, b: string, isAsc: boolean): AStrSortOrder {
    //     const { noOrder, abOrder, baOrder } = this;
    //     const isCurrAsc: boolean = a < b;
    //     const isCurrDsc: boolean = a > b;

    //     if (isCurrAsc) return isAsc ? abOrder : baOrder;
    //     if (isCurrDsc) return isAsc ? baOrder : abOrder;
    //     return noOrder;
    // }

    compareStr(a: string, b: string, isAsc: boolean): number {
        const option = { sensitivity: 'base' };     // ignore case
        const locale = 'en';
        return isAsc ? a.localeCompare(b, locale, option) : b.localeCompare(a, locale, option);
    }

    compareLocaleStr(a: string, b: string, isAsc: boolean): number {
        return isAsc ? a.localeCompare(b) : b.localeCompare(a);
    }

    isValSameType(valA: any, valB: any, type: string): boolean {
        return typeof valA === type && typeof valB === type;
    }

    shallSort(data: ALsItem[], { key, isAsc }: IOption): boolean {
        return key && typeof isAsc !== 'undefined' && data.length > 1;
    }

    //// UI - Generic Option & State
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

    createState(data: ALsItem[], option: IOption): IState {
        const shallSort: boolean = this.shallSort(data, option);
        const dataCopy: ALsItem[] = data.slice(0);
        return {
            data: shallSort ? this.sortByObjKey(dataCopy, option) : null
        };
    }

    getDefState(): IState {
        return { data: null };
    }

    //// UI - Generic Component Attribute
    createGenericCmpAttr({ data, option, callback }: ICmpAttrQuery, sortKey: string): ICmpAttr {
        const dataTotal: number = data.length;
        const onEvt: AFn = this.getGenericCmpEvtHandler(data, option, callback);
        const sortBtnAttr = this.createSortBtnAttr({ dataTotal, onEvt, option, sortKey });
        return { sortBtnAttr };
    }

    createSortBtnAttr({ dataTotal, onEvt, option, sortKey }): ICmpSortBtnAttr {
        const { key, isAsc, reset } = option;
        const isCurrTh: boolean = sortKey === key;
        const shallClear: boolean = reset && !isAsc;

        return {
            disabled: dataTotal <= 1,
            isAsc: isCurrTh ? isAsc : null,
            onClick: () => onEvt({
                key: isCurrTh ? (shallClear ? null : sortKey) : sortKey,
                isAsc: isCurrTh ? (shallClear ? null : !isAsc) : true
            })
        };
    }

    getGenericCmpEvtHandler(data: ALsItem[], option: IOption, callback?: AFn): AFn {
        return ((modOption: Partial<IOption>): void => {
            const sortOption: IOption = this.createOption(modOption, option);
            const sortState: IState = this.createState(data, sortOption);
            if (callback) callback({ sortOption, sortState });
        });
    }
}
