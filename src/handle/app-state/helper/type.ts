import { HostRuleConfig } from "../../../model/rule-config";

export interface IGetActiveItemArg {
    rules: HostRuleConfig[];

    // For Active/Current Edit Item only
    isActiveItem?: boolean,     // if it is active/current edit item
    isHost?: boolean;           // if it is parent item
    idx?: number;              // parent item index
    pathIdx?: number;          // child item index (if any)

    // For Non Active/Current Edit Item
    parentCtxIdx?: number;     // parent item index (if any)
    ctxIdx?: number;           // item index (could be parent or child)
}