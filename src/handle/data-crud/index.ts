import { HostRuleConfig, LibRuleConfig, PathRuleConfig, AActiveTabIdx } from "../../model/rule-config";
import { HandlerHelper } from "../app-state/helper";
import * as TRuleConfig from "../../model/rule-config/type";
import * as TPgnType from "../pagination/type";
import { IRuleIdCtx, IRuleIdxCtx } from "./type";

type AAnyRule = HostRuleConfig | PathRuleConfig | LibRuleConfig;
type AHostPathRule = HostRuleConfig | PathRuleConfig;

export class DataCrudHandle {
    //// GET
    getRuleIdxCtxFromIdCtx(arg: {
        rules: HostRuleConfig[];
        idCtx: IRuleIdCtx;
    }): IRuleIdxCtx {
        const { rules, idCtx } = arg;
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
    }

    getRuleFromIdxCtx(arg: {
        rules: HostRuleConfig[];
        idxCtx: IRuleIdxCtx;
    }): AAnyRule {
        const { rules, idxCtx } = arg;
        const { hostIdx, pathIdx, libIdx } = idxCtx;
        const host = rules[hostIdx];
        const isPath = Number.isInteger(pathIdx);
        const path = isPath ? host?.paths[pathIdx] : null;
        const isLib = path && Number.isInteger(libIdx);
        const lib = isLib ? path?.libs[libIdx] : null;
        return isLib ? lib : isPath ? path : host;
    }

    getRuleFromIdCtx(arg: {
        rules: HostRuleConfig[];
        idCtx: IRuleIdCtx;
    }): AAnyRule {
        const { rules, idCtx } = arg;
        const { hostId, pathId, libId } = idCtx;
        const host = rules.find(({ id }) => id === hostId);
        const path = pathId
            ? host?.paths.find(({ id }) => id === pathId)
            : null;
        const lib =
            path && libId ? path?.libs.find(({ id }) => id === libId) : null;
        return lib ? lib : path ? path : host;
    }

    //// TOGGLE/SET
    toggleJsExecStep(arg: {
        rules: HostRuleConfig[];
        idCtx: IRuleIdCtx;
        val: number;
    }): void {
        const { rules, idCtx, val } = arg;
        const item = this.getRuleFromIdCtx({ rules, idCtx }) as AHostPathRule;
        item.jsExecPhase = val as TRuleConfig.AJsExecPhase;
    }

    setLastActiveTab(arg: {
        rules: HostRuleConfig[];
        idCtx: IRuleIdCtx;
        val: number;
    }): void {
        const { rules, idCtx, val } = arg;
        const item = this.getRuleFromIdCtx({ rules, idCtx }) as AHostPathRule;
        item.activeTabIdx = val as AActiveTabIdx;
    }

    toggleJsSwitch(arg: { rules: HostRuleConfig[]; idCtx: IRuleIdCtx }): void {
        const { rules, idCtx } = arg;
        const item = this.getRuleFromIdCtx({ rules, idCtx }) as AHostPathRule;
        item.isJsOn = !item.isJsOn;
    }

    toggleCssSwitch(arg: { rules: HostRuleConfig[]; idCtx: IRuleIdCtx }): void {
        const { rules, idCtx } = arg;
        const item = this.getRuleFromIdCtx({ rules, idCtx }) as AHostPathRule;
        item.isCssOn = !item.isCssOn;
    }

    toggleLibSwitch(arg: { rules: HostRuleConfig[]; idCtx: IRuleIdCtx }): void {
        const { rules, idCtx } = arg;
        const item = this.getRuleFromIdCtx({ rules, idCtx }) as AHostPathRule;
        item.isLibOn = !item.isLibOn;
    }

    setJsCode(arg: {
        rules: HostRuleConfig[];
        idCtx: IRuleIdCtx;
        val: string;
    }): void {
        const { rules, idCtx, val } = arg;
        const item = this.getRuleFromIdCtx({ rules, idCtx }) as AHostPathRule;
        item.jsCode = val;
    }

    setCssCode(arg: {
        rules: HostRuleConfig[];
        idCtx: IRuleIdCtx;
        val: string;
    }): void {
        const { rules, idCtx, val } = arg;
        const item = this.getRuleFromIdCtx({ rules, idCtx }) as AHostPathRule;
        item.cssCode = val;
    }

    toggleLibAsyncSwitch(arg: {
        rules: HostRuleConfig[];
        idCtx: IRuleIdCtx;
    }): void {
        const { rules, idCtx } = arg;
        const item = this.getRuleFromIdCtx({ rules, idCtx }) as LibRuleConfig;
        item.isAsync = !item.isAsync;
    }

    toggleLibIsOnSwitch(arg: {
        rules: HostRuleConfig[];
        idCtx: IRuleIdCtx;
    }): void {
        const { rules, idCtx } = arg;
        const item = this.getRuleFromIdCtx({ rules, idCtx }) as LibRuleConfig;
        item.isOn = !item.isOn;
    }

    //// REMOVE SINGLE
    rmvHost(arg: { rules: HostRuleConfig[]; idCtx: IRuleIdCtx }): void {
        const { rules, idCtx } = arg;
        const { hostIdx } = this.getRuleIdxCtxFromIdCtx({ rules, idCtx });
        rules.splice(hostIdx, 1);
    }

    rmvPath(arg: { rules: HostRuleConfig[]; idCtx: IRuleIdCtx }): void {
        const { rules, idCtx } = arg;
        const { hostIdx, pathIdx } = this.getRuleIdxCtxFromIdCtx({
            rules,
            idCtx,
        });
        rules[hostIdx]?.paths.splice(pathIdx, 1);
    }

    rmvLib(arg: { rules: HostRuleConfig[]; idCtx: IRuleIdCtx }): void {
        const { rules, idCtx } = arg;
        const idxCtx = this.getRuleIdxCtxFromIdCtx({ rules, idCtx });
        const { hostIdx, pathIdx, libIdx } = idxCtx;
        rules[hostIdx]?.paths[pathIdx]?.libs.splice(libIdx, 1);
    }

    //// REMOVE MULTIPLE
    rmvPartialHosts(arg: {
        rules: HostRuleConfig[],
        selectedRowKeyCtx: { [k: string]: boolean }
    }): void {
        const { rules, selectedRowKeyCtx } = arg;
        Object.getOwnPropertyNames(selectedRowKeyCtx).forEach((rowId) => {
            const idx = rules.findIndex(({ id }) => id === rowId);
            rules.splice(idx, 1);
        });
    }

    rmvPartialLibs(arg: {
        rules: HostRuleConfig[];
        selectedRowKeyCtx: { [k: string]: boolean };
        idCtx: IRuleIdCtx;
    }): void {
        const { rules, idCtx, selectedRowKeyCtx } = arg;
        const { libs } = this.getRuleFromIdCtx({
            rules,
            idCtx,
        }) as PathRuleConfig;
        Object.getOwnPropertyNames(selectedRowKeyCtx).forEach((rowId) => {
            const idx = libs.findIndex(({ id }) => id === rowId);
            libs.splice(idx, 1);
        });
    }

    //// REMOVE ALL
    rmvAllHosts(arg: {
        rules: HostRuleConfig[];
        pgnOption: TPgnType.IOption;
        pgnState: TPgnType.IState;
    }): void {
        const { rules, pgnOption, pgnState } = arg;
        const { startRowIdx, endRowIdx } = HandlerHelper.getPgnRowIdxCtx(
            rules.length,
            pgnOption,
            pgnState
        );
        rules.slice(startRowIdx, endRowIdx).forEach(({ id: rowId }) => {
            const idx = rules.findIndex(({ id }) => id === rowId);
            rules.splice(idx, 1);
        });
    }

    rmvAllLibs(arg: {
        rules: HostRuleConfig[];
        pgnOption: TPgnType.IOption;
        pgnState: TPgnType.IState;
        idCtx: IRuleIdCtx;
    }): void {
        const { rules, idCtx, pgnOption, pgnState } = arg;
        const { libs } = this.getRuleFromIdCtx({
            rules,
            idCtx,
        }) as PathRuleConfig;
        const { startRowIdx, endRowIdx } = HandlerHelper.getPgnRowIdxCtx(
            libs.length,
            pgnOption,
            pgnState
        );
        libs.slice(startRowIdx, endRowIdx).forEach(({ id: rowId }) => {
            const idx = libs.findIndex(({ id }) => id === rowId);
            libs.splice(idx, 1);
        });
    }
}

export const dataCrudHandle = new DataCrudHandle();
