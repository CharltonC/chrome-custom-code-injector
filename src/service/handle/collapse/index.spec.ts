import { ClpsHandle } from './';

describe('Service - Collapse Handle', () => {
    let handle: ClpsHandle;


    beforeEach(() => {
        handle = new ClpsHandle();
    });


    describe('Method - isNestedRowOpen: Check if a row should open/collapse its nested rows', () => {
        describe('when show target context is an array of contexts', () => {
            const mockShowTargetCtx: string[] = [ 'a', 'a/b' ];

            it('should return false if row context is found in the show target context', () => {
                const mockRowCtx: string = 'a/b/c';
                const isOpen: boolean = handle.isNestedRowOpen(mockRowCtx, mockShowTargetCtx);
                expect(isOpen).toBe(false);
            });

            it('should return true if row context is found in the show target context', () => {
                const mockRowCtx: string = 'a/b';
                const isOpen: boolean = handle.isNestedRowOpen(mockRowCtx, mockShowTargetCtx);
                expect(isOpen).toBe(true);
            });
        });

    });

});