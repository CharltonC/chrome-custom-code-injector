/**
 * Since JS doesnt allow multiple inheritance, some properties are inevitably repeated
 * e.g. id, value, isHttps, isExactMatch
 */
import { UtilHandle } from '../../handle/util';
import { ACodeExecPhase, AActiveTabIdx, ALibType } from './type';

export class BaseRule {
    isJsOn = false;
    isCssOn = false;
    isLibOn = false;
    codeExecPhase: ACodeExecPhase = 0;
}

export class PathRule extends BaseRule {
    id: string;
    isHost: boolean;
    isExactMatch = false;
    title = '';
    value = '';
    jsCode = '';
    cssCode = '';
    libs: LibRule[] = [];
    activeTabIdx: AActiveTabIdx = 0;

    constructor(title: string, value: string) {
        super();
        this.id = UtilHandle.createId();
        this.title = title;
        this.value = value;
    }
}

export class HostRule extends PathRule {
    isHost = true;
    isHttps = false;
    paths: PathRule[] = [];
}

export class LibRule {
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

// JSON Schema generation only
type Rules = HostRule[];