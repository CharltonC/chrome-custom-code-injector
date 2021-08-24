import { JsonSchemaHandle } from '../json-schema';
import { FileHandle } from '../file';
import { HostRule } from '../../model/rule';

export class ValidationHandle {
    fileHandle = new FileHandle();
    jsonSchemaHandle = new JsonSchemaHandle();

    readonly url = {
        rule: /^(https?:\/\/)?(www\.)?(([a-z0-9]+(-|_)?)+\.)+[a-z0-9]+(\/([^?/]+))*$/i,
        msg: 'must be a url, e.g. www.xzy.com, www.xyz.com/file.ext'
    };

    readonly urlHost = {
        rule: /^(www\.)?(([a-z0-9]+(-|_)?)+\.)+[a-z0-9]+$/i,
        msg: 'must be a domain, e.g. www.google.com'
    };

    readonly urlPath = {
        rule: /^\/([^?/]+)/,
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

    readonly fileName = {
        rule: /^\w+(.*\w+)?$/,
        msg: 'file name must start/end with a character'
    };

    readonly jsonFileSchema = async (file: File): Promise<true | string[]> => {
        // Try get the parsed JSON
        let jsonData: HostRule[];
        try {
            jsonData = await this.fileHandle.readJson(file);
        } catch (e) {
            return [`${e.message}`];
        }

        // Check json format (graceful error)
        const isValid = this.jsonSchemaHandle.isValid(jsonData);
        return isValid
            ? true
            : this.jsonSchemaHandle.errors.map(err => {
                return `Import file data error: ${err['message']}`;
            });
    };

    gteChar(minChar: number) {
        if (!Number.isInteger(minChar) || minChar < 1) {
            throw new Error('`minChar` must be an positive integer larger or equal than 1');
        }

        return {
            rule: new RegExp(`^[a-zA-Z0-9]{${minChar},}$`),
            msg: `must be ${minChar} or more characters without whitespace`
        };
    }
}