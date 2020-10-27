import { ValidationHandle } from ".";

describe('Validation Rules', () => {
    let gte3Char: RegExp;
    let urlHost: RegExp;

    beforeEach(() => {
        ({ gte3Char, urlHost } = new ValidationHandle());
    });

    describe('3 or more alphabets only', () => {
        it('should test truthy when value has 3 or more alphabets only', () => {
            expect(gte3Char.test('abc')).toBeTruthy();
        });

        it('should test falsy when value has less than 3 alphabets', () => {
            expect(gte3Char.test('ab')).toBeFalsy();
        });

        it('should test falsy when value contains space or non-alpahbet character', () => {
            expect(gte3Char.test('ab c')).toBeFalsy();
            expect(gte3Char.test('ab-c')).toBeFalsy();
        });
    });

    describe('should test for host of a URL', () => {
        it('shold test truthy when value is valid', () => {
            expect(urlHost.test('www.google.com')).toBeTruthy();
            expect(urlHost.test('google.com')).toBeTruthy();
        });

        it('shold test falsy when value is invalid', () => {
            expect(urlHost.test('google')).toBeFalsy();
            expect(urlHost.test('google.com/abc')).toBeFalsy();
        });
    });
});