import { IClpsRowConfig, IClpsState, TClpsShowTarget } from './type';

export class ClpsConfig {
    data: any[] = [];
    rows?: IClpsRowConfig[] = [];
    showTarget?: TClpsShowTarget = 'ALL';
}

export class ClpsHandle {
    getClpsState(clpsConfig: ClpsConfig) {
        const { data, rows, showTarget }: ClpsConfig = this.getMergedConfig(clpsConfig);
        const isClpsConfigValid: boolean = this.isClpsConfigValid(data, rows);
        if (!isClpsConfigValid) return;

        // TODO: Process diff. showTarget type


    }

    getMergedConfig(clpsConfig: ClpsConfig): ClpsConfig {
        const defConfig = new ClpsConfig();
        return Object.assign({}, defConfig);
    }

    isClpsConfigValid<T>(data: T[], clpsRowsConfig: IClpsRowConfig[]): boolean {
        return !!data.length && !!clpsRowsConfig.length;
    }

    /**
     * Assume the Context of Current Collapse Item is:
     * "0/lvl1NestedKey:0/lvl2NestedKey:0",
     *
     * Then the Context of relevant parents items that should remain open (i.e. isOpen: true) are:
     * - "0",
     * - "0/lvl1NestedKey:0"
     *
     * So the collapse state for all relavant items should be:
     * {
     *      "0": true
     *      "0/lvl1NestedKey:0": true,
     *      "0/lvl1NestedKey:0/lvl2NestedKey:0": <oppositeOfPrevCollapseState>
     * }
     */
    isNestedRowOpen(ctx: string, showTargetCtx: TClpsShowTarget): boolean {
        return Array.isArray(showTargetCtx) ?
            showTargetCtx.some((showTarget: string) => showTarget.indexOf(ctx, 0) === 0) :
            (showTargetCtx === 'ALL' ? true : false);
    }

    // TODO
    getRowState(data: any[], rowConfig: any[], rowLvl: number, prefixCtx: string, showTargetCtx: TClpsShowTarget): any[] {
        // Skip if data has no rows OR config doesnt exist
        const config = rowConfig[rowLvl];
        if (!!data.length || !config) return;

        const [ rowKey, rtnCbFn ] = config;
        return data.map((item, idx) => {
            // Item Base State
            const { id, ctx, nestedRowCtx } = this.getRowItemBaseState({prefixCtx, rowKey, idx, rowLvl});

            // Nested Rows (if any) + Set open state (based on 'ALL' | 'NONE' | specific ctx)
            const nestedRows: any[] = this.getNestedRowState(item, rowConfig, rowLvl, nestedRowCtx, showTargetCtx);
            const isOpen: boolean = nestedRows ? this.isNestedRowOpen(ctx, showTargetCtx) : null;

            // Return the state
            const props = {item, idx, id, ctx, isOpen, nestedRowCtx, nestedRows};
            return rtnCbFn ? rtnCbFn(props) : props;
        });
    }

    getRowItemBaseState({rowKey, idx, rowLvl, prefixCtx}) {
        rowKey = rowKey ? rowKey : '';
        const id: string = `ls-${rowLvl}-${idx}`;
        const ctx: string = rowKey ? [rowKey, idx].join(';') : `${rowKey}`;
        const nestedRowCtx: string = prefixCtx ? [prefixCtx, ctx].join('/') : ctx;
        return { id, ctx, nestedRowCtx };
    }

    getNestedRowState(item: Record<string, any>, rowConfig: any[], rowLvl: number, prefixCtx: string, showTarget: TClpsShowTarget): any[] {
        const nestedRowLvl: number = rowLvl+1;
        const nestedRowConfig = rowConfig[nestedRowLvl];
        const [ nestedRowKey ] = nestedRowConfig;
        if (nestedRowKey) return;
        return this.getRowState(item[nestedRowKey], rowConfig, nestedRowLvl, prefixCtx, showTarget);
    }

    getClpsItemInData<T>(data: T[], clpsItemCtx: string): T {
        if (!data.length) return null;
        const dataCopy: T[] = data.slice(0);

        const contexts: string[] = clpsItemCtx.split('/');
        if (contexts.length <= 1) return null;

        const clpsItem: T | T[] = contexts.reduce((_data: T[], ctx: string) => {
            // 1st value is the entire match, 2nd value is 1st inner bracket captures the `\w:`
            const [, , key, _idx ] = ctx.match(/((\w+):)?(\d+)/);
            const hsKey: boolean = !!key;
            const idx: number = parseFloat(_idx);
            const hsIdx: boolean = !!_idx && this.isIntGteZero(idx);
            return (hsKey && hsIdx) ? _data[key][idx] : (hsIdx ? _data[idx] : _data);
        }, dataCopy);

        // If we ends up with the data itself, Means we can't find any matched item
        return (clpsItem !== dataCopy) ? clpsItem as T : null;
    }

    isIntGteZero(val: number): boolean {
       return Number.isInteger(val) && val >= 0;
    }
}