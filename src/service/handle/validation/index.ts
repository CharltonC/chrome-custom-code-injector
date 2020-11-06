class ValidationHandle {
    readonly gte3Char = {
        rule: /^[a-zA-Z0-9]{3,}$/,
        msg: 'must be 3 or more characters without whitespace'
    };

    readonly urlHost = {
        rule: /^(www\.)?(([a-z0-9]+(-|_)?)+\.)+[a-z0-9]+$/,
        msg: 'must be a domain, e.g. www.google.com'
    };

    readonly urlPath = {
        rule: /^\/([^?\/]+)/,
        msg: 'must be Url path, e.g. /home'
    };

    readonly nonEmptyFile = {
        rule: ({ size }: File) => !!size,
        msg: 'file selected has no content'
    };

    readonly maxFileSize = {
        rule: ({ size }: File) => size <= 2097152,
        msg: 'file selected has size larger than 2mb'
    };

    readonly
}

export const validationHandle = new ValidationHandle();