import { TMethodSpy } from '../../../test-util/type';
import { TestUtil } from '../../../test-util/';
import {
    IOption,
    IThColCtx,
    IThColCtxCache,
} from './type';
import { ThHandle } from './';

describe('Table Header Handle', () => {
    let handle: ThHandle;
    let spy: TMethodSpy<ThHandle>;

    beforeEach(() => {
        handle = new ThHandle();
        spy = TestUtil.spyMethods(handle);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Method - createDefThInfoCache: Create a new default cache', () => {
        it('should return a default cache value', () => {
            expect(handle.createDefThInfoCache()).toEqual({
                slots: [],
                colTotal: 0
            });
        });
    });

    describe('Method - createState: Create rows (`tr`) of header (`th`) context used for rendering', () => {
        it('should return the table header context (with mocks)', () => {
            const mockOption: any = ['lorem'];
            const mockThColCtx: any = [];
            const mockThSpanCtx: any = [[]];
            spy.createThColCtx.mockReturnValue(mockThColCtx);
            spy.createThSpanCtx.mockReturnValue(mockThSpanCtx);

            expect(handle.createState(mockOption)).toBe(mockThSpanCtx);
            expect(spy.createThColCtx).toHaveBeenCalledWith(mockOption);
            expect(spy.createThSpanCtx).toHaveBeenCalledWith(mockThColCtx);
        });

        it('should return the table header context (without mocks)', () => {
            const mockOption: IOption[] = [
                {title: 'a', subHeader: [
                    {title: 'a-1'},
                    {title: 'a-2'}
                ]},
                {title: 'b'},
            ];

            expect(handle.createState(mockOption)).toEqual([
                [
                    {title: 'a', colSpan: 2, rowSpan: 1, sortKey: undefined},
                    {title: 'b', colSpan: 1, rowSpan: 2, sortKey: undefined},
                ],
                [
                    {title: 'a-1', colSpan: 1, rowSpan: 1, sortKey: undefined},
                    {title: 'a-2', colSpan: 1, rowSpan: 1, sortKey: undefined},
                ]
            ]);
        });
    });

    describe('Method - createThColCtx: Create rows (`tr`) of header (`th`) context for descendent columns', () => {
        const { createThColCtx } = ThHandle.prototype;
        const mockOption: IOption[] = [
            {title: 'a', subHeader: [
                {title: 'a-1'},
                {title: 'a-2'}
            ]},
            {title: 'b'},
        ];
        let mockCache: IThColCtxCache;
        let createThColCtxClone;

        beforeEach(() => {
            mockCache = {
                colTotal: 0,
                slots: []
            };
            createThColCtxClone = createThColCtx.bind(handle);
            spy.createThColCtx.mockReturnValue([]);
            spy.setThColCtxCache.mockImplementation(() => {});
        });

        it('should return the column context when row level is 0', () => {
            const { subHeader } = mockOption[0];

            expect(createThColCtxClone(mockOption)).toEqual(mockCache.slots);
            expect(spy.createDefThInfoCache).toHaveBeenCalled();
            expect(spy.createThColCtx).toHaveBeenCalledWith(subHeader, 1, mockCache);
            expect(spy.createThColCtx).toHaveBeenCalledTimes(1);
            expect(spy.setThColCtxCache).toHaveBeenCalledTimes(3);
        });

        it('should return the column context when row level is not 0', () => {
            const { subHeader } = mockOption[0];

            expect(createThColCtxClone(mockOption, 1, mockCache)).toEqual([
                {title: 'a', ownColTotal: 0, sortKey: undefined},
                {title: 'b', ownColTotal: null, sortKey: undefined}
            ]);
            expect(spy.createThColCtx).toHaveBeenCalledWith(subHeader, 2, mockCache);
            expect(spy.createThColCtx).toHaveBeenCalledTimes(1);
            expect(spy.setThColCtxCache).toHaveBeenCalledTimes(2);
        });
    });

    describe('Method - createThSpanCtx: Create rows (`tr`) of header (`th`) context for row span and column span', () => {
        const { createThSpanCtx }  = ThHandle.prototype;
        const mockColCtxs: IThColCtx[][] = [
            [
                {title: 'a', ownColTotal: 3},
                {title: 'b'}
            ],
            [
                {title: 'a-1'},
                {title: 'a-2', ownColTotal: 2}
            ],
            [
                {title: 'a-2-1'},
                {title: 'a-2-2'}
            ],
        ];
        const [ mockColCtx1, mockColCtx2 ] = mockColCtxs;

        it('should return header context for row span and column span', () => {
            const [ colCtx1, colCtx2, colCtx3 ] = createThSpanCtx(mockColCtxs);

            expect(colCtx1[0]).toEqual(
                {title: 'a',
                rowSpan: 1,
                colSpan: mockColCtx1[0].ownColTotal
            });
            expect(colCtx1[1]).toEqual({
                title: 'b',
                rowSpan: mockColCtxs.length,
                colSpan: 1
            });
            expect(colCtx2[0]).toEqual({
                title: 'a-1',
                rowSpan: mockColCtxs.length-1,
                colSpan: 1
            });
            expect(colCtx2[1]).toEqual({
                title: 'a-2',
                rowSpan: 1,
                colSpan: mockColCtx2[1].ownColTotal
            });
            expect(colCtx3[0]).toEqual({
                title: 'a-2-1',
                rowSpan: mockColCtxs.length-2,
                colSpan: 1
            });
            expect(colCtx3[1]).toEqual({
                title: 'a-2-2',
                rowSpan: mockColCtxs.length-2,
                colSpan: 1
            });
        });
    });

    describe('Method - setThColCtxCache: Update the cache value during the process where `th` column context is being created', () => {
        const { setThColCtxCache }  = ThHandle.prototype;
        let mockCache: IThColCtxCache;

        beforeEach(() => {
            mockCache = {
                colTotal: 0,
                slots: []
            };
        });

        it('should increment the column total when column context isnt provided', () => {
            setThColCtxCache(mockCache, 1);
            expect(mockCache.colTotal).toBe(1);

            setThColCtxCache(mockCache, 0);
            expect(mockCache.colTotal).toBe(2);
        });

        it('should set the column context for that row level when row level is 0 and column context is provided', () => {
            const mockColCtx: IThColCtx[] = [];
            setThColCtxCache(mockCache, 0, mockColCtx);

            const { slots, colTotal } = mockCache;
            expect(slots[0]).toBe(mockColCtx);
            expect(slots.length).toBe(1);
            expect(colTotal).toBe(0);
        });

        it('should set the column context for that row level if not already exist when row level is not 0 and column context is provied', () => {
            const mockColCtx: IThColCtx[] = [];
            setThColCtxCache(mockCache, 1, mockColCtx);

            const { slots, colTotal } = mockCache;
            expect(slots[1]).toBe(mockColCtx);
            expect(slots.length).toBe(2);
            expect(colTotal).toBe(0);
        });

        it('should append to the existing column context for that row level when row level is not 0 and column context is provided', () => {
            // Fake the existing column context and context to be appended
            (mockCache.slots[1] as any) = ['a'];
            const mockColCtx: any = ['b'];
            setThColCtxCache(mockCache, 1, mockColCtx);

            const { slots, colTotal } = mockCache;
            expect(slots[1]).toEqual(['a', 'b']);
            expect(slots.length).toBe(2);
            expect(colTotal).toBe(0);
        });
    });
});