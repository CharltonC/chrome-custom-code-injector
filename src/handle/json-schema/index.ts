import schema from '../../model/rule/schema.json';
import Ajv from 'ajv';

const jsonValidator = new Ajv().compile(schema);

export class JsonSchemaHandle {
    validator = jsonValidator;

    isValid(data: any): boolean {
        return this.validator(data);
    }

    get errors() {
        return this.validator.errors;
    }
}

export const jsonSchemaHandle = new JsonSchemaHandle();
