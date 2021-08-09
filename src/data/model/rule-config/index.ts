/**
 * Since JS doesnt allow multiple inheritance, some properties are inevitably repeated
 * e.g. id, value, isHttps, isExact
 */
import { UtilHandle } from '../../../handle/util';
import { ACodeExecPhase, AActiveTabIdx, ALibType } from './type';

export class BaseRuleConfig {
    isJsOn = false;
    isCssOn = false;
    isLibOn = false;
    codeExecPhase: ACodeExecPhase = 0;
}

export class PathRuleConfig extends BaseRuleConfig {
    id: string;
    isHost: boolean;
    isExact = false;
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
    type: ALibType = 'js';
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
