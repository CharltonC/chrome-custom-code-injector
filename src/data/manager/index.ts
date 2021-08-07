import { HostRuleConfig, LibRuleConfig, PathRuleConfig } from '../model/rule-config';
import * as TRuleConfig from '../model/rule-config/type';
import { IRuleIdCtx, IRuleIdxCtx, ISliceIdxCtx, AAnyRule, AHostPathRule } from './type';

export class DataManager {
    //// GET
    getRuleIdxCtxFromIdCtx(rules: HostRuleConfig[], idCtx: IRuleIdCtx): IRuleIdxCtx {
        const { hostId, pathId, libId } = idCtx;
        const hostIdx = rules.findIndex(({ id }) => id === hostId);
        const host = rules[hostIdx];
        const paths = host.paths;

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

    getRuleFromIdxCtx(rules: HostRuleConfig[], idxCtx: IRuleIdxCtx): AAnyRule {
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

    getRuleFromIdCtx(rules: HostRuleConfig[], idCtx: IRuleIdCtx): AAnyRule {
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

    getFilteredRules(rules: HostRuleConfig[], filterText: string): HostRuleConfig[] {
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

    getLibs(host: HostRuleConfig, pathIdx?: number): LibRuleConfig[] {
        // libraries exists in both host and path
        // - if path exists, getting its libraries is prioritized over host's libraries
        const isPath = Number.isInteger(pathIdx);
        const { libs } = isPath ? host.paths[pathIdx] : host;
        return libs;
    }

    //// TOGGLE/SET
    setProps<T = AAnyRule>(rules: HostRuleConfig[], idCtx: IRuleIdCtx, props: Partial<T>) {
        const item = this.getRuleFromIdCtx(rules, idCtx);
        Object.assign(item, props)
    }

    setTitle(rules: HostRuleConfig[], idCtx: IRuleIdCtx, val: string): void {
        const item = this.getRuleFromIdCtx(rules, idCtx);
        item.title = val;
    }

    setValue(rules: HostRuleConfig[], idCtx: IRuleIdCtx, val: string): void {
        const item = this.getRuleFromIdCtx(rules, idCtx);
        item.value = val;
    }

    toggleHttpsSwitch(rules: HostRuleConfig[], idCtx: IRuleIdCtx): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as HostRuleConfig;
        item.isHttps = !item.isHttps;
    }

    toggleRegexSwitch(rules: HostRuleConfig[], idCtx: IRuleIdCtx): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as HostRuleConfig;
        item.isRegex = !item.isRegex;
    }

    toggleJsExecStep(rules: HostRuleConfig[], idCtx: IRuleIdCtx, val: number): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as AHostPathRule;
        item.jsExecPhase = val as TRuleConfig.AJsExecPhase;
    }

    setLastActiveTab(rules: HostRuleConfig[], idCtx: IRuleIdCtx, val: number): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as AHostPathRule;
        item.activeTabIdx = val as TRuleConfig.AActiveTabIdx;
    }

    toggleJsSwitch(rules: HostRuleConfig[], idCtx: IRuleIdCtx): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as AHostPathRule;
        item.isJsOn = !item.isJsOn;
    }

    toggleCssSwitch(rules: HostRuleConfig[], idCtx: IRuleIdCtx): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as AHostPathRule;
        item.isCssOn = !item.isCssOn;
    }

    toggleLibSwitch(rules: HostRuleConfig[], idCtx: IRuleIdCtx): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as AHostPathRule;
        item.isLibOn = !item.isLibOn;
    }

    setJsCode(rules: HostRuleConfig[], idCtx: IRuleIdCtx, val: string): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as AHostPathRule;
        item.jsCode = val;
    }

    setCssCode(rules: HostRuleConfig[], idCtx: IRuleIdCtx, val: string): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as AHostPathRule;
        item.cssCode = val;
    }

    toggleLibAsyncSwitch(rules: HostRuleConfig[], idCtx: IRuleIdCtx): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as LibRuleConfig;
        item.isAsync = !item.isAsync;
    }

    toggleLibIsOnSwitch(rules: HostRuleConfig[], idCtx: IRuleIdCtx): void {
        const item = this.getRuleFromIdCtx(rules, idCtx) as LibRuleConfig;
        item.isOn = !item.isOn;
    }

    //// ADD
    addHost(rules: HostRuleConfig[], host: HostRuleConfig): void {
        // Relative to `rules`
        rules.push(host);
    }

    addPath(rules: HostRuleConfig[], idCtx: IRuleIdCtx, path: PathRuleConfig): void {
        // Relative to target/current host
        const { hostIdx } = this.getRuleIdxCtxFromIdCtx(rules, idCtx);
        rules[hostIdx].paths.push(path);
    }

    addLib(rules: HostRuleConfig[], idCtx: IRuleIdCtx, lib: LibRuleConfig): void {
        // Relative to target/current path
        const { hostIdx, pathIdx } = this.getRuleIdxCtxFromIdCtx(rules, idCtx);
        const host = rules[hostIdx];
        const libs = this.getLibs(host, pathIdx);
        libs.push(lib);
    }

    //// REMOVE SINGLE
    rmvHost(rules: HostRuleConfig[], idCtx: IRuleIdCtx): void {
        const { hostIdx } = this.getRuleIdxCtxFromIdCtx(rules, idCtx);
        rules.splice(hostIdx, 1);
    }

    rmvPath(rules: HostRuleConfig[], idCtx: IRuleIdCtx): void {
        const { hostIdx, pathIdx } = this.getRuleIdxCtxFromIdCtx(rules, idCtx);
        rules[hostIdx]?.paths.splice(pathIdx, 1);
    }

    rmvLib(rules: HostRuleConfig[], idCtx: IRuleIdCtx): void {
        const idxCtx = this.getRuleIdxCtxFromIdCtx(rules, idCtx);
        const { hostIdx, pathIdx, libIdx } = idxCtx;
        const host = rules[hostIdx];
        const libs = this.getLibs(host, pathIdx);
        libs.splice(libIdx, 1);
    }

    //// REMOVE MULTIPLE
    rmvHostsFromIds(rules: HostRuleConfig[], ids: string[]): void {
        ids.forEach(rowId => {
            const idx = rules.findIndex(({ id }) => id === rowId);
            if (idx === -1) return;
            rules.splice(idx, 1);
        });
    }

    rmvPartialHosts(rules: HostRuleConfig[], selectedRowKeyCtx: { [k: string]: boolean }): void {
        Object.getOwnPropertyNames(selectedRowKeyCtx).forEach((rowId) => {
            const idx = rules.findIndex(({ id }) => id === rowId);
            if (idx === -1) return;
            rules.splice(idx, 1);
        });
    }

    rmvPartialLibs(rules: HostRuleConfig[], selectedRowKeyCtx: { [k: string]: boolean }, idCtx: IRuleIdCtx): void {
        const { libs } = this.getRuleFromIdCtx(rules, idCtx) as AHostPathRule;
        Object.getOwnPropertyNames(selectedRowKeyCtx).forEach((rowId) => {
            const idx = libs.findIndex(({ id }) => id === rowId);
            if (idx === -1) return;
            libs.splice(idx, 1);
        });
    }

    //// REMOVE ALL
    rmvAllHosts(rules: HostRuleConfig[], sliceIdxCtx: ISliceIdxCtx): void {
        const { startIdx, endIdx } = sliceIdxCtx;
        rules.slice(startIdx, endIdx).forEach(({ id: rowId }) => {
            const idx = rules.findIndex(({ id }) => id === rowId);
            rules.splice(idx, 1);
        });
    }

    rmvAllLibs(rules: HostRuleConfig[], idCtx: IRuleIdCtx): void {
        // Since there will be no pagination in libraries table, we dont need the pattern like in `rmvAllHosts`
        const { libs } = this.getRuleFromIdCtx(rules, idCtx) as AHostPathRule;
        libs.length = 0;
    }
}

export const dataManager = new DataManager();
