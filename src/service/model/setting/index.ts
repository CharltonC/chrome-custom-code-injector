import { BaseRuleConfig } from '../rule-config';

export class Setting extends BaseRuleConfig {
    showDeleteModal: boolean = true;
    resultsPerPageIdx: number = 0;
    isHttps: boolean = false;
    isRegex: boolean = false;
}