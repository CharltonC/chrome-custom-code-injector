import { TextInputState } from '../text-input-state';
import { RuleIdCtxState } from '../rule-id-ctx-state';

export class ModalState {
    currentId: string = null;
    ruleIdCtx = new RuleIdCtxState();
    exportFileInput = new TextInputState();
    importFileInput: File = null;
    titleInput = new TextInputState();
    valueInput = new TextInputState();
    isConfirmBtnEnabled: boolean = false;
}