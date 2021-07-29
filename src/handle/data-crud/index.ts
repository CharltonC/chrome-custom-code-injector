import { HostRuleConfig, LibRuleConfig, PathRuleConfig, AActiveTabIdx } from '../../model/rule-config';
import { HandlerHelper } from '../app-state/helper';
import * as TRuleConfig from '../../model/rule-config/type';
import { IRuleIdCtx, IRuleIdxCtx } from './type';

export const DataCrudHandle = {
    //// GET
    getRuleIdxCtx(rules: HostRuleConfig[], idCtx: IRuleIdCtx): IRuleIdxCtx {
        const { hostId, pathId, libId } = idCtx;
        const hostIdx = rules.findIndex(({ id }) => id === hostId);
        const paths = rules[hostIdx]?.paths;
        const pathIdx = pathId
            ? paths.findIndex(({ id }) => id === pathId)
            : null;
        const libIdx = libId
            ? paths[pathIdx].libs.findIndex(({ id }) => id === libId)
            : null;
        return { hostIdx, pathIdx, libIdx };
    },

    getRuleFromIdxCtx(rules: HostRuleConfig[], idxCtx: IRuleIdxCtx):  HostRuleConfig | PathRuleConfig | LibRuleConfig {
        const { hostIdx, pathIdx, libIdx } = idxCtx;
        const host = rules[hostIdx];
        const isPath = Number.isInteger(pathIdx);
        const path = isPath ? host?.paths[pathIdx] : null;
        const isLib = path && Number.isInteger(libIdx);
        const lib = isLib ? path?.libs[libIdx] : null;
        return isLib ? lib : (isPath ? path : host);
    },

    getRuleFromIdCtx(rules: HostRuleConfig[], idCtx: IRuleIdCtx): HostRuleConfig | PathRuleConfig | LibRuleConfig {
        const { hostId, pathId, libId  } = idCtx;
        const host = rules.find(({ id }) => id === hostId);
        const path = pathId ? host?.paths.find(({ id }) => id === pathId) : null;
        const lib = path && libId ? path?.libs.find(({ id }) => id === libId) : null;
        return lib ? lib : (path ? path : host);
    },

    //// TOGGLE/SET
    toggleJsExecStep(item: HostRuleConfig | PathRuleConfig, idx: number): void {
        item.jsExecPhase = idx as TRuleConfig.AJsExecPhase;
    },

    setLastActiveTab(item: HostRuleConfig | PathRuleConfig, idx: number): void {
        item.activeTabIdx = idx as AActiveTabIdx;
    },

    toggleJsSwitch(item: HostRuleConfig | PathRuleConfig): void {
        item.isJsOn = !item.isJsOn;
    },

    toggleCssSwitch(item: HostRuleConfig | PathRuleConfig): void {
        item.isCssOn = !item.isCssOn;
    },

    toggleLibSwitch(item: HostRuleConfig | PathRuleConfig): void {
        item.isLibOn = !item.isLibOn;
    },

    setJsCode(item: HostRuleConfig | PathRuleConfig, val: string): void {
        item.jsCode = val;
    },

    setCssCode(item: HostRuleConfig | PathRuleConfig, val: string): void {
        item.cssCode = val;
    },

    toggleLibAsyncSwitch(item: LibRuleConfig): void {
        item.isAsync = !item.isAsync;
    },

    toggleLibIsOnSwitch(item: LibRuleConfig): void {
        item.isOn = !item.isOn;
    },

    //// REMOVE SINGLE
    rmvHost(rules: HostRuleConfig[], idCtx: IRuleIdCtx): void {
        const { hostIdx } = this.getRuleIdxCtx({ rules, ...idCtx });
        rules.splice(hostIdx, 1);
    },

    rmvPath(rules: HostRuleConfig[], idCtx: IRuleIdCtx): void {
        const { hostIdx, pathIdx } = this.getRuleIdxCtx({ rules, ...idCtx });
        rules[hostIdx]?.paths.splice(pathIdx, 1);
    },

    rmvLib(rules: HostRuleConfig[], idCtx: IRuleIdCtx): void {
        const { hostIdx, pathIdx, libIdx } = this.getRuleIdxCtx({ rules, ...idCtx });
        rules[hostIdx]?.paths[pathIdx]?.libs.splice(libIdx, 1);
    },

    //// REMOVE MULTIPLE
    rmvPartialHosts(rules: HostRuleConfig[], selectedRowKeyCtx: {[k: string]: boolean}): void {
        Object
            .getOwnPropertyNames(selectedRowKeyCtx)
            .forEach(rowId => {
                const idx = rules.findIndex(({ id }) => id === rowId);
                rules.splice(idx, 1);
            });
    },

    rmvPartialLibs(libRules: LibRuleConfig[], selectedRowKeyCtx: {[k: string]: boolean}): void {
        Object
            .getOwnPropertyNames(selectedRowKeyCtx)
            .forEach(rowId => {
                const idx = libRules.findIndex(({ id }) => id === rowId);
                libRules.splice(idx, 1);
            });
    },

    //// REMOVE ALL
    rmvAllHosts(rules: HostRuleConfig[], ruleDataGrid): void {
        const { pgnOption, pgnState } = ruleDataGrid;
        const { startRowIdx, endRowIdx } = HandlerHelper.getPgnRowIdxCtx(
            rules.length,
            pgnOption,
            pgnState
        );
        rules
            .slice(startRowIdx, endRowIdx)
            .forEach(({ id: rowId }) => {
                const idx = rules.findIndex(({ id }) => id === rowId);
                rules.splice(idx, 1);
            });
    },

    rmvAllLibs(libRules: LibRuleConfig[], libDataGrid): void {
        const { pgnOption, pgnState } = libDataGrid;
        const { startRowIdx, endRowIdx } = HandlerHelper.getPgnRowIdxCtx(
            libRules.length,
            pgnOption,
            pgnState
        );
        libRules
            .slice(startRowIdx, endRowIdx)
            .forEach(({ id: rowId }) => {
                const idx = libRules.findIndex(({ id }) => id === rowId);
                libRules.splice(idx, 1);
            });
    },
};