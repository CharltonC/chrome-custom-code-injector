/**
 * Since JS doesnt allow multiple inheritance, some properties are inevitably repeated
 * e.g. id, value, isHttps, isRegex
 */
import { UtilHandle } from '../../handle/util';
import { AJsExecPhase } from './type';

export class BaseRuleConfig {
    isJsOn = false;
    isCssOn = false;
    isLibOn = false;
    jsExecPhase: AJsExecPhase = 1;
}

export class PathRuleConfig extends BaseRuleConfig {
    id: string;
    isHost: boolean;
    title = '';
    value = '';
    jsCode = '';
    cssCode = '';
    libs: LibRuleConfig[] = [];
    activeTabIdx: AActiveTabIdx = 0;

    constructor(title: string, value: string) {
        super();
        this.id = UtilHandle.createId();
        this.title = title;
        this.value = value;
    }
}

export class HostRuleConfig extends PathRuleConfig {
    isHost = true;
    isHttps = false;
    paths: PathRuleConfig[] = [];
}

export class LibRuleConfig {
    id: string;
    title = '';
    value = '';
    isOn = false;
    isAsync = true;

    constructor(title: string, value: string) {
        this.id = UtilHandle.createId();
        this.title = title;
        this.value = value;
    }
}

export type AActiveTabIdx = 0 | 1 | 2;