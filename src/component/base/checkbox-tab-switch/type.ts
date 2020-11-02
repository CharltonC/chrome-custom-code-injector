export interface IProps extends React.HTMLAttributes<HTMLElement> {
    id: string;
    list: ITabItem[];
    activeIdx?: number;
    onTabActive?: (...args: any[]) => any;
    onTabEnable?: (...args: any[]) => any;
}

export interface IState {
    hsList: boolean;
    hsAtvIdx: boolean;
    activeTab: ITabItem;
}

export interface ITabItem {
    name: string;
    isEnable: boolean;
}
