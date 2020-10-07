export interface IGlobalEvtConfig {
    targetType: string;
    evtType: string;
    handler: (...args: any[]) => any;
}