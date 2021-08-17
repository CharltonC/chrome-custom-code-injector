import { HostRule, LibRule, PathRule } from '../../model/rule';
import * as TRuleConfig from '../../model/rule/type';
import { IRuleIdCtx, IRuleIdxCtx, ISliceIdxCtx, AAnyRule, AHostPathRule } from './type';

export class DataHandle {
    //// GET
    getRuleIdxCtxFromIdCtx(rules: HostRule[], idCtx: IRuleIdCtx): IRuleIdxCtx {
        const { hostId, pathId, libId } = idCtx;
        const hostIdx = rules.findIndex(({ id }) => id === hostId);
        const host = rules[hostIdx];
        const paths = host?.paths;

        const pathIdx = pathId
            ? paths.findIndex(({ id }) => id === pathId)
            : null;

        // libraries exists in both host and path
        // - if path exists, getting its libraries is prioritized over host's libraries
        const libIdx = libId
            ? pathId
                ? paths[pathIdx].libs.findIndex(({ id }) => id === libId)
                : host.libs.findIndex(({ id }) => id === libId)
            : null;
        return { hostIdx, pathIdx, libIdx };
    }

    getRuleFromIdxCtx(rules: HostRule[], idxCtx: IRuleIdxCtx): AAnyRule {
        const { hostIdx, pathIdx, libIdx } = idxCtx;
        const host = rules[hostIdx];

        const isPath = Number.isInteger(pathIdx);
        const path = isPath ? host?.paths[pathIdx] : null;

        // libraries exists in both host and path
        // - if path exists, getting its libraries is prioritized over host's libraries
        const isLib = Number.isInteger(libIdx);
        const lib = isLib
            ? path
                ? path.libs[libIdx]
                : host.libs[libIdx]
            : null;

        return lib || path || host;
    }

    getRuleFromIdCtx(rules: HostRule[], idCtx: IRuleIdCtx): AAnyRule {
        const { hostId, pathId, libId } = idCtx;

        const host = rules.find(({ id }) => id === hostId);
        const path = pathId
            ? host?.paths.find(({ id }) => id === pathId)
            : null;

        // libraries exists in both host and path
        // - if path exists, getting its libraries is prioritized over host's libraries
        const lib = libId
            ? path
                ? path?.libs.find(({ id }) => id === libId)
                : host.libs.find(({ id }) => id === libId)
            : null;

        return lib ? lib : path ? path : host;
    }

    getFilteredRules(rules: HostRule[], filterText: string): HostRule[] {
        const trimText = filterText.trim().toLowerCase();
        if (!trimText) return rules;

        const texts = trimText.toLowerCase().split(/\s+/);
        return rules.filter(host => {
            const { title, value, paths } = host;
            const hostTitle = title.toLowerCase();
            const hostValue = value.toLowerCase();

            // Check title, Value in both Host or Path
            return (
                texts.some(
                    (text) =>
                        hostTitle.includes(text) || hostValue.includes(text)
                ) ||
                paths.some((path) => {
                    const { title: subTitle, value: subValue } = path;
                    const pathTitle = subTitle.toLowerCase();
                    const pathValue = subValue.toLowerCase();
                    return texts.some(
                        (text) =>
                            pathTitle.includes(text) || pathValue.includes(text)
                    );
                })
            );
        });
    }

    getLibs(host: HostRule, pathIdx?: number): LibRule[] {
        // libraries exists in both host and path
        // - if path exists, getting its libraries is prioritized over host's libraries
        const isPath = Number.isInteger(pathIdx);
        const { libs } = isPath ? host.paths[pathIdx] : host;
        return libs;
    }

    // Get the Next available def/active Rule id context when a host/path is removed
    getNextAvailRuleIdCtx(rules: HostRule[], ruleIdCtx: IRuleIdCtx): IRuleIdCtx {
        const isHost = !ruleIdCtx.pathId;
        const { hostIdx, pathIdx } = this.getRuleIdxCtxFromIdCtx(rules, ruleIdCtx);

        // If a host is deleted, set the active host back to the 1st, else use the existing active host (if path is deleted)
        const nextHostIdx = isHost ? 0 : hostIdx;
        const nextHost = rules[nextHostIdx];
        const hostId = nextHost?.id;

        // Get the next path Id, if paths remain in the next host
        const nextPaths = nextHost.paths;
        const nextPathIdx = isHost ? pathIdx : (nextPaths.length ? 0 : null);
        const pathId = nextPaths[nextPathIdx]?.id;

        return { hostId, pathId };
    }

    //// TOGGLE/SET
    setProps<T = AAnyRule>(rules: HostRule[], idCtx: IRuleIdCtx, props: Partial<T>) {
        const item = this.getRuleFromIdCtx(rules, idCtx);
        Object.assign(item, props)
    }

    setTitle(rules: HostRule[], idCtx: IRuleIdCtx, val: string): void {
        const item = this.getRuleFromIdCtx(rules, idCtx);
        item.title = val;
    }

    setValue(rules: HostRule[], idCtx: IRuleIdCtx, val: string): void {
        const item = this.getRuleFromIdCtx(rules, idCtx);
        item.value = val;
    }

    toggleHttpsSwitch(rules: HostRule[], idCtx: IRuleIdCtx): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as HostRule;
        item.isHttps = !item.isHttps;
    }

    toggleExactSwitch(rules: HostRule[], idCtx: IRuleIdCtx): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as HostRule;
        item.isExactMatch = !item.isExactMatch;
    }

    toggleJsExecStep(rules: HostRule[], idCtx: IRuleIdCtx, val: number): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as AHostPathRule;
        item.codeExecPhase = val as TRuleConfig.ACodeExecPhase;
    }

    setLastActiveTab(rules: HostRule[], idCtx: IRuleIdCtx, val: number): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as AHostPathRule;
        item.activeTabIdx = val as TRuleConfig.AActiveTabIdx;
    }

    toggleJsSwitch(rules: HostRule[], idCtx: IRuleIdCtx): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as AHostPathRule;
        item.isJsOn = !item.isJsOn;
    }

    toggleCssSwitch(rules: HostRule[], idCtx: IRuleIdCtx): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as AHostPathRule;
        item.isCssOn = !item.isCssOn;
    }

    toggleLibSwitch(rules: HostRule[], idCtx: IRuleIdCtx): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as AHostPathRule;
        item.isLibOn = !item.isLibOn;
    }

    setJsCode(rules: HostRule[], idCtx: IRuleIdCtx, val: string): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as AHostPathRule;
        item.jsCode = val;
    }

    setCssCode(rules: HostRule[], idCtx: IRuleIdCtx, val: string): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as AHostPathRule;
        item.cssCode = val;
    }

    setLibType(rules: HostRule[], idCtx: IRuleIdCtx, type: TRuleConfig.ALibType) {
        const item = this.getRuleFromIdCtx(rules, idCtx) as LibRule;
        item.type = type;
    }

    toggleLibAsyncSwitch(rules: HostRule[], idCtx: IRuleIdCtx): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as LibRule;
        item.isAsync = !item.isAsync;
    }

    toggleLibIsOnSwitch(rules: HostRule[], idCtx: IRuleIdCtx): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as LibRule;
        item.isOn = !item.isOn;
    }

    //// ADD
    addHost(rules: HostRule[], host: HostRule): void {
        // Relative to `rules`
        rules.push(host);
    }

    addPath(rules: HostRule[], idCtx: IRuleIdCtx, path: PathRule): void {
        // Relative to target/current host
        const { hostIdx } = this.getRuleIdxCtxFromIdCtx(rules, idCtx);
        rules[hostIdx].paths.push(path);
    }

    addLib(rules: HostRule[], idCtx: IRuleIdCtx, lib: LibRule): void {
        // Relative to target/current path
        const { hostIdx, pathIdx } = this.getRuleIdxCtxFromIdCtx(rules, idCtx);
        const host = rules[hostIdx];
        const libs = this.getLibs(host, pathIdx);
        libs.push(lib);
    }

    //// REMOVE SINGLE
    rmvHost(rules: HostRule[], idCtx: IRuleIdCtx): void {
        const { hostIdx } = this.getRuleIdxCtxFromIdCtx(rules, idCtx);
        rules.splice(hostIdx, 1);
    }

    rmvPath(rules: HostRule[], idCtx: IRuleIdCtx): void {
        const { hostIdx, pathIdx } = this.getRuleIdxCtxFromIdCtx(rules, idCtx);
        rules[hostIdx]?.paths.splice(pathIdx, 1);
    }

    rmvLib(rules: HostRule[], idCtx: IRuleIdCtx): void {
        const idxCtx = this.getRuleIdxCtxFromIdCtx(rules, idCtx);
        const { hostIdx, pathIdx, libIdx } = idxCtx;
        const host = rules[hostIdx];
        const libs = this.getLibs(host, pathIdx);
        libs.splice(libIdx, 1);
    }

    //// REMOVE MULTIPLE
    rmvHostsFromIds(rules: HostRule[], ids: string[]): void {
        ids.forEach(rowId => {
            const idx = rules.findIndex(({ id }) => id === rowId);
            if (idx === -1) return;
            rules.splice(idx, 1);
        });
    }

    rmvPartialHosts(rules: HostRule[], selectedRowKeyCtx: { [k: string]: boolean }): void {
        Object.getOwnPropertyNames(selectedRowKeyCtx).forEach((rowId) => {
            const idx = rules.findIndex(({ id }) => id === rowId);
            if (idx === -1) return;
            rules.splice(idx, 1);
        });
    }

    rmvPartialLibs(rules: HostRule[], selectedRowKeyCtx: { [k: string]: boolean }, idCtx: IRuleIdCtx): void {
        const { libs } = this.getRuleFromIdCtx(rules, idCtx) as AHostPathRule;
        Object.getOwnPropertyNames(selectedRowKeyCtx).forEach((rowId) => {
            const idx = libs.findIndex(({ id }) => id === rowId);
            if (idx === -1) return;
            libs.splice(idx, 1);
        });
    }

    //// REMOVE ALL
    rmvAllHosts(rules: HostRule[], sliceIdxCtx: ISliceIdxCtx): void {
        const { startIdx, endIdx } = sliceIdxCtx;
        rules.slice(startIdx, endIdx).forEach(({ id: rowId }) => {
            const idx = rules.findIndex(({ id }) => id === rowId);
            rules.splice(idx, 1);
        });
    }

    rmvAllLibs(rules: HostRule[], idCtx: IRuleIdCtx): void {
        // Since there will be no pagination in libraries table, we dont need the pattern like in `rmvAllHosts`
        const { libs } = this.getRuleFromIdCtx(rules, idCtx) as AHostPathRule;
        libs.length = 0;
    }
}

export const dataHandle = new DataHandle();
