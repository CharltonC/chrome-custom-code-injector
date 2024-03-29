import { ValidationHandle } from '../../handle/validation';

const { ruleTitle, nonEmptyFile, maxFileSize, jsonFileSchema, fileName, urlHost, urlPath, url } = new ValidationHandle();

export const validationSet = {
    ruleId: [ ruleTitle ],
    ruleUrlHost: [ urlHost ],
    ruleUrlPath: [ urlPath ],
    libUrl: [ url ],
    importConfig: [ nonEmptyFile, maxFileSize, jsonFileSchema ],
    exportConfig: [ fileName ],
};