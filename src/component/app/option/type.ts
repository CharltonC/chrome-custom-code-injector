import { AppState } from '../../../service/state';

export interface IProps {
    store: AppState;
    storeHandler: {
        [k: string]: (...args: any[]) => (Partial<AppState> | void)
    }
}