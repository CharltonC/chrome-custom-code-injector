export interface IUiHandle {
    createState: AFn;
    getDefState: AFn;
    createOption: AFn;
    getDefOption: AFn;
    createGenericCmpAttr?: AFn;
    getGenericCmpEvtHandler?: AFn;
}

type AFn = (...args: any[]) => any;