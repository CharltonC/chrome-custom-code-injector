import { AppState } from '../model';
import { createMockRules } from '../../data/mock';

export const createMockAppState = () => {
    const baseAppState = new AppState();
    return {
        ...baseAppState,
        rules: createMockRules()
    };
};