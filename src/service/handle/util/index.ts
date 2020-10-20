export class UtilHandle {
    cssCls(baseCls: string, clsSuffix: string | string[]): string {
        if (!clsSuffix || !clsSuffix?.length) return baseCls;
        return Array.isArray(clsSuffix) ?
            clsSuffix.reduce((clsName: string, suffix: string) => clsName + (suffix ? ` ${baseCls}--${suffix}` : ''), baseCls) :
            `${baseCls} ${baseCls}--${clsSuffix}`;
    }
}