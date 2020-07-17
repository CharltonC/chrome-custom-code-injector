export interface IUiHandle {
    createState: TFn;
    getDefState: TFn;
    createOption: TFn;
    getDefOption: TFn;
    createGenericCmpAttr?: TFn;
    getGenericCmpEvtHandler?: TFn;
}

type TFn = (...args: any[]) => any;