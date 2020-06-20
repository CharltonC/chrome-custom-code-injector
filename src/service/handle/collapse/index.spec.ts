import { TClpsShowTarget } from './type';
import { ClpsHandle } from './';

describe('Service - Collapse Handle', () => {
    let handle: ClpsHandle;


    beforeEach(() => {
        handle = new ClpsHandle();
    });

    describe('Method - isNestedRowOpen: Check if a row should open/collapse its nested rows', () => {
        const { isNestedRowOpen } = ClpsHandle.prototype;

        describe('when show target context is an array of contexts', () => {
            const mockShowTargetCtx: TClpsShowTarget = [ 'a', 'a/b' ];

            it('should return false if row context is found in the show target context', () => {
                expect(isNestedRowOpen('a/b/c', mockShowTargetCtx)).toBe(false);
            });

            it('should return true if row context is found in the show target context', () => {
                expect(isNestedRowOpen('a/b', mockShowTargetCtx)).toBe(true);
            });
        });

        describe('when show target context is `ALL` or `NONE`', () => {
            it('should return true if show target context is show all', () => {
                expect(isNestedRowOpen('', 'ALL')).toBe(true);
            });

            it('should return false if show target context is show none', () => {
                expect(isNestedRowOpen('', 'NONE')).toBe(false);
            });
        });

    });

});