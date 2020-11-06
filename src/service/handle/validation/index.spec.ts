import { validationHandle } from ".";

describe('Validation Rules', () => {
    describe('3 or more alphabets only', () => {
        const { rule } = validationHandle.gte3Char;

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

    describe('host of a URL', () => {
       const { rule } = validationHandle.urlHost;

        it('shold test truthy when value is valid', () => {
            expect(rule.test('www.google.com')).toBeTruthy();
            expect(rule.test('google.com')).toBeTruthy();
        });

        it('shold test falsy when value is invalid', () => {
            expect(rule.test('google')).toBeFalsy();
            expect(rule.test('google.com/abc')).toBeFalsy();
        });
    });

    describe('path of a URL', () => {
        const { rule } = validationHandle.urlPath;

        it('shold test truthy when value is valid', () => {
            expect(rule.test('/a')).toBeTruthy();
            expect(rule.test('/abc/')).toBeTruthy();
        });

        it('shold test falsy when value is invalid', () => {
            expect(rule.test('/')).toBeFalsy();
            expect(rule.test('abc/')).toBeFalsy();
        });
    });

    describe('empty file', () => {
        const { rule } = validationHandle.isEmptyFile;

        it('should return true if file is not empty', () => {
            expect(rule({ size: 1 } as File)).toBeTruthy();
        });

        it('should return false if file is empty', () => {
            expect(rule({ size: 0 } as File)).toBeFalsy();
        });
    });

    describe('file siz eless than 2mb', () => {
        const { rule } = validationHandle.isFileLte2Mb;

        it('should return true if less than or equal to2mb', () => {
            expect(rule({ size: 1 } as File)).toBeTruthy();
        });

        it('should return false if larger than 2mb', () => {
            expect(rule({ size: 3*1024*1024 } as File)).toBeFalsy();
        });
    });
});