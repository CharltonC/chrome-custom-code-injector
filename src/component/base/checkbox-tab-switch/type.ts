export interface IProps extends React.HTMLAttributes<HTMLElement> {
    id: string;
    data: Record<string, any> | Record<string, any>[];
    dataKeyMap?: [string, string][];
    activeTabIdx?: number;
    tabKey?: string;
    tabEnableKey: string;
    onTabActive?: (...args: any[]) => any;
    onTabEnable?: (...args: any[]) => any;
}

export interface IState {}