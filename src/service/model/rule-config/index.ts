/**
 * Since JS doesnt allow multiple inheritance, some properties are inevitably repeated
 * e.g. id, value, isHttps, isRegex
 */
import { AJsExecPhase } from './type';

export class BaseRuleConfig {
    isJsOn: boolean = false;
    isCssOn: boolean = false;
    isLibOn: boolean = false;
    lastTabIdx: 0 | 1 | 2 = 0;         // last tab where user is on
    jsExecPhase: AJsExecPhase = 1;
    // jsExecInclSubframe: boolean = false;
}

export class PathRuleConfig extends BaseRuleConfig {
    id: string  = '';
    value: string = '';
    jsCode: string = '';
    cssCode: string = '';
    libs: LibRuleConfig[] = [];

    constructor(id: string, value: string) {
        super();
        this.id = id;
        this.value = value;
    }
}

export class HostRuleConfig extends PathRuleConfig {
    isHttps: boolean = false;
    isRegex: boolean = false;
    paths: PathRuleConfig[] = [];
}

export class LibRuleConfig {
    id: string  = '';
    value: string = '';
    isOn: boolean = false;
    isAsync: boolean = true;
    // isSubFrame: boolean = false;

    constructor(id: string, value: string) {
        this.id = id;
        this.value = value;
    }
}
