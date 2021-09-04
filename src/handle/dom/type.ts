export interface IGlobalEvtConfig {
    targetType: EGlobalTarget;
    evtType: string;
    handler: AFn;
}

export enum EGlobalTarget {
    WIN = 'win',
    DOC = 'doc',
    BODY = 'body',
}