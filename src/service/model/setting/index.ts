import { BaseRuleConfig } from '../rule-config';

export class Setting extends BaseRuleConfig {
    showDeleteModal: boolean = true;
    paginatePerPage: number = 20;
    isHttps: boolean = false;
    isRegex: boolean = false;
}