import { TextInputState } from '../text-input-state';
import { ActiveRuleState } from '../active-rule-state';

export class ModalState {
    currentId: string = null;
    ruleIdCtx = new ActiveRuleState();
    exportFileInput = new TextInputState();
    importFileInput: File = null;
    titleInput = new TextInputState();
    valueInput = new TextInputState();
    isConfirmBtnEnabled: boolean = false;
}