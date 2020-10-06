export interface ITabItem {
    name: string;
    isEnable: boolean;
}

export interface IProps extends React.HTMLAttributes<HTMLElement> {
    id: string;
    list: ITabItem[];
    activeIdx?: number;
    onTabActive?: (...args: any[]) => any;
    onTabEnable?: (...args: any[]) => any;
}

/**
 * Internal State only
 */
export interface IState {
    hsList: boolean;
    hsAtvIdx: boolean;
    activeTab: ITabItem;
}