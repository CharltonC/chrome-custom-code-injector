export class UtilHandle {
    cssCls(baseCls: string, clsSuffix: string): string {
        return `${baseCls} ${baseCls}--${clsSuffix}`;
    }
}