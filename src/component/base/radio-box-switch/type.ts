export interface IProps {
    name: string;
    labels: string[];
    activeLabel: string;
    onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}
