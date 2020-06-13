import { TLsItem, TStrSortOrder } from './type';

export class DefSorter {
    readonly noOrder: TStrSortOrder = 0;
    readonly baOrder: TStrSortOrder = 1;
    readonly abOrder: TStrSortOrder = -1;

    constructor(){}

    objList(list: TLsItem[], key: string, isAsc: boolean = true, hsLocale: boolean = false): TLsItem[] {
        return list.slice(0).sort((a: TLsItem, b: TLsItem) => {
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
}
