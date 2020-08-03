export class UtilHandle {
    cssCls(baseCls: string, clsSuffix: string | string[]): string {
        const BASE_PREFIX: string = `${baseCls} ${baseCls}--`;
        return Array.isArray(clsSuffix) ?
            `${BASE_PREFIX}` + clsSuffix.join(` ${baseCls}--`) :
            `${BASE_PREFIX}${clsSuffix}`;
    }
}