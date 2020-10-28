import { IValidationRule } from './type';

export const validationRules: Record<string, IValidationRule> = {
    gte3Char: {
        rule: /^[a-zA-Z]{3,}$/,
        msg: 'must be 3 or more characters without whitespace'
    },

    urlHost: {
        rule: /^(www\.)?(([a-z0-9]+(-|_)?)+\.)+[a-z0-9]+$/,
        msg: 'must be a domain, e.g. www.google.com'
    }
}