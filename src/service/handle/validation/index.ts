import { IValidationRule } from './type';

class ValidationHandle {
    readonly gte3Char: IValidationRule = {
        rule: /^[a-zA-Z0-9]{3,}$/,
        msg: 'must be 3 or more characters without whitespace'
    };

    readonly urlHost: IValidationRule = {
        rule: /^(www\.)?(([a-z0-9]+(-|_)?)+\.)+[a-z0-9]+$/,
        msg: 'must be a domain, e.g. www.google.com'
    };

    readonly urlPath: IValidationRule = {
        rule: /^\/([^?\/]+)/,
        msg: 'must be Url path, e.g. /home'
    };
}

export const validationHandle = new ValidationHandle();