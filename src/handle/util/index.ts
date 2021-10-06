const isJest = !!process.argv.find(arg => arg.includes('jest'));
const isProd = process.env.NODE_ENV === 'production';

export const UtilHandle = {
    isJestOrProd: isJest || isProd,

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
    },

    createId(): string {
        const numberId = Math.random().toString(36).substr(2);
        const timeId = Date.now().toString(36);
        return numberId + timeId;
    }
}