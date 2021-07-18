import { ValidationHandle } from '../../handle/validation';

const { gteChar, nonEmptyFile, maxFileSize, fileName, urlHost, urlPath, url } = new ValidationHandle();

export const validationRule = {
    ruleId: [ gteChar(2) ],
    ruleUrlHost: [ urlHost ],
    ruleUrlPath: [ urlPath ],
    libUrl: [ url ],
    importConfig: [ nonEmptyFile, maxFileSize ],
    exportConfig: [ fileName ],
};