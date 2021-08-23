import { jsonSchemaHandle } from '.';
import { HostRule, PathRule } from '../../model/rule';

describe('Json Schema Handle', () => {
    describe('Method - isValid', () => {
        it('should return true if data is valid', () => {
            const mockData = [ new HostRule('lorem', 'sum') ];
            const isValid = jsonSchemaHandle.isValid(mockData);

            expect(isValid).toBe(true);
            expect(jsonSchemaHandle.validator.errors).toBeFalsy();
        });

        it('should return errors if data type is not valid', () => {
            const mockData = {};
            const isValid = jsonSchemaHandle.isValid(mockData);

            expect(isValid).toBe(false);
            expect(jsonSchemaHandle.validator.errors?.length).toBeTruthy();
        });

        it('should return errors if nested data is not valid', () => {
            const mockData = [ new PathRule('lorem', 'sum') ];
            const isValid = jsonSchemaHandle.isValid(mockData);

            expect(isValid).toBe(false);
            expect(jsonSchemaHandle.validator.errors?.length).toBeTruthy();
        });
    });

    describe('Method (getter) - errors', () => {
        it('should return the last validation error array', () => {
            expect(jsonSchemaHandle.errors).toBe(jsonSchemaHandle.validator.errors);
        });
    });
});
