import { ValidationHandle } from '../../service/validation-handle';

const { gteChar, nonEmptyFile, maxFileSize, fileName, urlHost, urlPath } = new ValidationHandle();

export const validationRule = {
    ruleId: [ gteChar(2) ],
    ruleUrlHost: [ urlHost ],
    ruleUrlPath: [ urlPath ],
    importConfig: [ nonEmptyFile, maxFileSize ],
    exportConfig: [ fileName ],
};