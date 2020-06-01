export interface IListItem {
    name: string;
}

export interface IList extends IListItem {
    nedstList?: IListItem[];
}

export interface IProps extends React.HTMLAttributes<HTMLElement> {
    // list: IList[];
}