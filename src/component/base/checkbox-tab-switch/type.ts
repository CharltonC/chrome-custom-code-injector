export interface IProps extends React.HTMLAttributes<HTMLElement> {
    id: string;
    list: Record<string, any>[];
    activeTabIdx?: number;
    tabKey?: string;
    tabEnableKey: string;
    onTabActive?: (...args: any[]) => any;
    onTabEnable?: (...args: any[]) => any;
}

export interface IState {}