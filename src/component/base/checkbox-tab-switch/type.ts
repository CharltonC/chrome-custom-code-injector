export interface IProps extends React.HTMLAttributes<HTMLElement> {
    id: string;
    data: ATab | ATab[];
    dataKeyMap?: [string, string][];
    activeTabIdx?: number;
    tabKey?: string;
    tabEnableKey: string;
    onTabActive?: (...args: any[]) => any;
    onTabEnable?: (...args: any[]) => any;
}

export interface IState {}

export interface IOnTabChange {
    evt: React.ChangeEvent<HTMLInputElement>;
    tab: ATab;
    idx: number;
}

type ATab = Record<string, any>;