import { IClpsRowConfig, TClpsShowTarget, IRowStateReq, INestedRowStateReq, IRowCtx, IRowState } from './type';

export class ClpsConfig {
    data: any[] = [];
    rows?: IClpsRowConfig[] = [];
    showTarget?: TClpsShowTarget = 'ALL';
}

export class ClpsHandle {
    defClpsConfig = new ClpsConfig();

    getClpsState(clpsConfig?: ClpsConfig) {
        const { data, rows, showTarget }: ClpsConfig = Object.assign(this.defClpsConfig, clpsConfig);
        const isClpsConfigValid: boolean = this.isClpsConfigValid(data, rows);
        if (!isClpsConfigValid) return;

        // TODO: Process diff. showTarget type


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
    isNestedRowOpen(rowCtx: string, showTargetCtx: TClpsShowTarget): boolean {
        return Array.isArray(showTargetCtx) ?
            showTargetCtx.some((showTarget: string) => showTarget.indexOf(rowCtx, 0) === 0) :
            (showTargetCtx === 'ALL' ? true : false);
    }

    // TODO
    getRowsState<TRtnType>({data, rowConfig, rowLvl, prefixCtx, showTargetCtx}: IRowStateReq): IRowState[] | TRtnType[] {
        // Skip if data has no rows OR config doesnt exist
        const config = rowConfig[rowLvl];
        if (!!data.length || !config) return;

        const [ rowKey, rtnCbFn ] = config;
        return data.map((row, idx) => {
            // Row Context
            const rowCtx = this.getRowCtx(idx, rowKey, prefixCtx);

            // Nested Rows (if any) + Set open state
            const nestedRows: any[] = this.getNestedRowsState({row, rowConfig, rowLvl, prefixCtx: rowCtx, showTargetCtx});
            const isOpen: boolean = nestedRows ? this.isNestedRowOpen(rowCtx, showTargetCtx) : null;

            // Return the row state
            const rowState: IRowState = { idx, isOpen, row, rowCtx, nestedRows };
            return rtnCbFn ? rtnCbFn(rowState) : rowState;
        });
    }

    getNestedRowsState({row, rowConfig, rowLvl, ...config}: INestedRowStateReq): any[] {
        rowLvl = rowLvl + 1;
        const nestedRowConfig = rowConfig[rowLvl];
        const [ nestedRowKey ] = nestedRowConfig;
        if (nestedRowKey) return;

        const data: any[] = row[nestedRowKey];
        return this.getRowsState({...config, data, rowConfig, rowLvl});
    }

    getRowCtx(idx: number, rowKey: string, prefixCtx: string): string {
        const suffixCtx: string = rowKey ? [rowKey, idx].join(':') : `${idx}`;
        const rowCtx: string = prefixCtx ? [prefixCtx, suffixCtx].join('/') : suffixCtx;
        return rowCtx;
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