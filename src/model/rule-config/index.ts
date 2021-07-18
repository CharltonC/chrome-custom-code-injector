/**
 * Since JS doesnt allow multiple inheritance, some properties are inevitably repeated
 * e.g. id, value, isHttps, isRegex
 */
import { AJsExecPhase } from './type';

export class BaseRuleConfig {
    isJsOn: boolean = false;
    isCssOn: boolean = false;
    isLibOn: boolean = false;
    jsExecPhase: AJsExecPhase = 1;
}

export class PathRuleConfig extends BaseRuleConfig {
    title: string  = '';
    value: string = '';
    jsCode: string = '';
    cssCode: string = '';
    libs: LibRuleConfig[] = [];
    activeTabIdx: 0 | 1 | 2 = 0;

    constructor(title: string, value: string) {
        super();
        this.title = title;
        this.value = value;
    }
}

export class HostRuleConfig extends PathRuleConfig {
    isHttps: boolean = false;
    paths: PathRuleConfig[] = [];
}

export class LibRuleConfig {
    title: string  = '';
    value: string = '';
    isOn: boolean = false;
    isAsync: boolean = true;

    constructor(title: string, value: string) {
        this.title = title;
        this.value = value;
    }
}
