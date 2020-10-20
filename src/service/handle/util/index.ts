export class UtilHandle {
    cssCls(baseCls: string, clsSuffix: string = ''): string {
        if (!clsSuffix) return baseCls;

        return clsSuffix
            .split(/\s+/)
            .reduce(
                (clsName: string, suffix: string) => {
                    return suffix ? `${clsName} ${baseCls}--${suffix}` : clsName;
                },
                baseCls
            );
    }
}