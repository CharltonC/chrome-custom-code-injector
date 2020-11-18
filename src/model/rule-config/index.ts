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
    paths: PathRuleConfig[] = [];
}

export class LibRuleConfig {
    id: string  = '';
    value: string = '';
    isOn: boolean = false;
    isAsync: boolean = true;

    constructor(id: string, value: string) {
        this.id = id;
        this.value = value;
    }
}
