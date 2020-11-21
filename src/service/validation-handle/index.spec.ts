import { ValidationHandle } from ".";

describe('Validation Rules', () => {
    let validationHandle: ValidationHandle;
    let rule;

    beforeEach(() => {
        validationHandle = new ValidationHandle();
    });

    describe('minimum number of alphabets only', () => {
        beforeEach(() => {
            ({ rule } = validationHandle.gteChar(3));
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

    describe('URL', () => {
        beforeEach(() => {
            ({ rule } = validationHandle.url);
        });

        it('should test truthy when value is valid', () => {
            expect(rule.test('www.google.com')).toBeTruthy();
            expect(rule.test('google.com')).toBeTruthy();
            expect(rule.test('https://google.com')).toBeTruthy();
            expect(rule.test('https://google.com/file.ext')).toBeTruthy();
            expect(rule.test('google.com/abc')).toBeTruthy();
        });

        it('should test falsy when value is invalid', () => {
            expect(rule.test('google')).toBeFalsy();
        });
    });

    describe('host of a URL', () => {
       beforeEach(() => {
           ({ rule } = validationHandle.urlHost);
       });

        it('should test truthy when value is valid', () => {
            expect(rule.test('www.google.com')).toBeTruthy();
            expect(rule.test('google.com')).toBeTruthy();
        });

        it('should test falsy when value is invalid', () => {
            expect(rule.test('google')).toBeFalsy();
            expect(rule.test('google.com/abc')).toBeFalsy();
        });
    });

    describe('path of a URL', () => {
        beforeEach(() => {
            ({ rule } = validationHandle.urlPath);
        });

        it('should test truthy when value is valid', () => {
            expect(rule.test('/a')).toBeTruthy();
            expect(rule.test('/abc/')).toBeTruthy();
        });

        it('should test falsy when value is invalid', () => {
            expect(rule.test('/')).toBeFalsy();
            expect(rule.test('abc/')).toBeFalsy();
        });
    });

    describe('empty file', () => {
        beforeEach(() => {
            ({ rule } = validationHandle.nonEmptyFile);
        });

        it('should return true if file is not empty', () => {
            expect(rule({ size: 1 } as File)).toBeTruthy();
        });

        it('should return false if file is empty', () => {
            expect(rule({ size: 0 } as File)).toBeFalsy();
        });
    });

    describe('file size less than 2mb', () => {
        beforeEach(() => {
            ({ rule } = validationHandle.maxFileSize);
        });

        it('should return true if less than or equal to 2mb', () => {
            expect(rule({ size: 1 } as File)).toBeTruthy();
        });

        it('should return false if larger than 2mb', () => {
            expect(rule({ size: 3*1024*1024 } as File)).toBeFalsy();
        });
    });

    describe('file name', () => {
        beforeEach(() => {
            ({ rule } = validationHandle.fileName);
        });

        it('should test true if file name is valid', () => {
            expect(rule.test('a')).toBeTruthy();
            expect(rule.test('a - bc')).toBeTruthy();
            expect(rule.test('ab - _')).toBeTruthy();
            expect(rule.test('_ab')).toBeTruthy();
        });

        it('should test false if file name starts/ends with space', () => {
            expect(rule.test('ab ')).toBeFalsy();
            expect(rule.test(' ab')).toBeFalsy();
        });
    });
});