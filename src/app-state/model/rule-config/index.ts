/**
 * Since JS doesnt allow multiple inheritance, some properties are inevitably repeated
 * e.g. id, value, isHttps, isRegex
 */
import { AJsExecPhase } from './type';

export class BaseRuleConfig {
    isJsOn = false;
    isCssOn = false;
    isLibOn = false;
    jsExecPhase: AJsExecPhase = 1;
}

export class PathRuleConfig extends BaseRuleConfig {
    title = '';
    value = '';
    jsCode = '';
    cssCode = '';
    libs: LibRuleConfig[] = [];
    activeTabIdx: 0 | 1 | 2 = 0;

    constructor(title: string, value: string) {
        super();
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
    title = '';
    value = '';
    isOn = false;
    isAsync = true;

    constructor(title: string, value: string) {
        this.title = title;
        this.value = value;
    }
}
