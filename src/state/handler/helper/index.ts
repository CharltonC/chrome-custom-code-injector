import { AppState } from '../../model';

export const HandlerHelper = {
    getTextlInputChangeState(arg): Partial<AppState> {
        const {
            rules, localState,
            isInModal, inputKey, key,
            val, isValid, errMsg
        } = arg;

        // If Text input is inside Modal, Check valid state of other text inputs within the same Modal
        let modalConfirmState = {};
        if (isInModal) {
            const inputKeys = ['modalTitleInput', 'modalValueInput'];
            modalConfirmState = {
                isModalConfirmBtnEnabled: isValid && inputKeys
                    .filter(key => key !== inputKey)
                    .every(key => localState[key].isValid)
            };
        }

        const baseState = {
            localState: {
                ...localState,
                ...modalConfirmState,
                [inputKey]: {
                    isValid,
                    errMsg,
                    value: val
                }
            }
        };

        // For both Modal and Non-Modal
        // - If not vaild, we only update the temporary value of the input
        if (!isValid || isInModal) return baseState;

        // For Non-Modal only
        // - If valid value, set/sync the item title or value
        const { item } = localState.activeRule;
        item[key] = val;
        return {
            ...baseState,
            rules: [...rules], // force rerender for Side Nav
        };
    },

    hsText(vals: string[], text: string): boolean {
        return vals.some((val: string) => (val.toLowerCase().indexOf(text) !== -1));
    },
}