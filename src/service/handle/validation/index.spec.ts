import { IValidationRule } from './type';
import { validationHandle } from ".";

describe('Validation Rules', () => {
    let gte3Char: IValidationRule;
    let urlHost: IValidationRule;
    let urlPath: IValidationRule;
    let rule;

    beforeEach(() => {
        ({ gte3Char, urlHost, urlPath } = validationHandle);
    });

    describe('3 or more alphabets only', () => {
        beforeEach(() => {
            ({ rule } = gte3Char);
        });

        it('should test truthy when value has 3 or more alphabets only', () => {
            expect(rule.test('abc')).toBeTruthy();
        });

        it('should test falsy when value has less than 3 alphabets', () => {
            expect(rule.test('ab')).toBeFalsy();
        });

        it('should test falsy when value contains space or non-alpahbet character', () => {
            expect(rule.test('ab c')).toBeFalsy();
            expect(rule.test('ab-c')).toBeFalsy();
        });
    });

    describe('should test for host of a URL', () => {
        beforeEach(() => {
            ({ rule } = urlHost);
        });

        it('shold test truthy when value is valid', () => {
            expect(rule.test('www.google.com')).toBeTruthy();
            expect(rule.test('google.com')).toBeTruthy();
        });

        it('shold test falsy when value is invalid', () => {
            expect(rule.test('google')).toBeFalsy();
            expect(rule.test('google.com/abc')).toBeFalsy();
        });
    });

    describe('should test for path of a URL', () => {
        beforeEach(() => {
            ({ rule } = urlPath);
        });

        it('shold test truthy when value is valid', () => {
            expect(rule.test('/a')).toBeTruthy();
            expect(rule.test('/abc/')).toBeTruthy();
        });

        it('shold test falsy when value is invalid', () => {
            expect(rule.test('/')).toBeFalsy();
            expect(rule.test('abc/')).toBeFalsy();
        });
    });
});