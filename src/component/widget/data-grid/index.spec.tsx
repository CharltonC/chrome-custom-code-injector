import React, { ReactElement } from 'react';
import { TMethodSpy } from '../../../asset/ts/test-util/type';
import { TestUtil } from '../../../asset/ts/test-util';
import { UtilHandle } from '../../../service/handle/util/index';
import { RowExpdHandle } from '../../../service/handle/row-expand-handle';
import { RowTransformHandle } from '../../../service/handle/row-transform-handle';
import { SortHandle } from '../../../service/handle/sort';
import { PgnHandle } from '../../../service/handle/pagination-handle';
import { HeaderGrpHandle } from '../../../service/handle/header-group-handle';
import { Pagination } from '../../group/pagination';
import { GridHeader } from '../../group/grid-header';
import { DataGrid } from '.';
import { IProps, IState, TShallResetState } from './type';


describe('Component - Data Grid', () => {
    const MockPagination = () => <div className="pagination"/>;
    const MockGridHeader = () => <div className="header"/>;
    let mockProps: any;
    let mockState: any;
    let cmp: DataGrid;
    let spy: TMethodSpy<DataGrid>;
    let utilHandleSpy: TMethodSpy<UtilHandle>;
    let rowTransformHandleSpy: TMethodSpy<RowTransformHandle>;
    let rowExpdHandleSpy: TMethodSpy<RowExpdHandle>;
    let sortHandleSpy: TMethodSpy<SortHandle>;
    let pgnHandleSpy: TMethodSpy<PgnHandle>;
    let headerGrpHandleSpy: TMethodSpy<HeaderGrpHandle>;
    let mockStateProps: (...args: any[]) => void;

    beforeEach(() => {
        mockProps = { type: 'table' };
        mockState = { isTb: true };

        utilHandleSpy = TestUtil.spyProtoMethods(UtilHandle);
        rowTransformHandleSpy = TestUtil.spyProtoMethods(RowTransformHandle);
        rowExpdHandleSpy = TestUtil.spyProtoMethods(RowExpdHandle);
        sortHandleSpy = TestUtil.spyProtoMethods(SortHandle);
        pgnHandleSpy = TestUtil.spyProtoMethods(PgnHandle);
        headerGrpHandleSpy = TestUtil.spyProtoMethods(HeaderGrpHandle);
        spy = TestUtil.spyProtoMethods(DataGrid, ['setState']);
        spy.createState.mockReturnValue(mockState);
        cmp = new DataGrid(mockProps);
        mockStateProps = TestUtil.getStatePropsMocker(cmp);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        mockStateProps(null, null);
    });

    describe('Buildin API', () => {
        describe('constructor', () => {
            it('should initialize', () => {
                expect(cmp.state).toEqual(mockState);
                expect(spy.createState).toHaveBeenCalledWith(mockProps);
            });
        });

        describe('Lifecycle - UNSAFE_componentWillReceiveProps', () => {
            const mockShallResetState = { isTb: false };
            const mockModProps = { type: 'list' } as IProps;
            const mockModState = { isTb: true } as IState;

            beforeEach(() => {
                mockStateProps(mockProps, mockState);
                spy.shallResetState.mockReturnValue(mockShallResetState);
                spy.createState.mockReturnValue(mockModState);
                spy.setState.mockImplementation(() => {});
            });

            it('should check and set state based on the modified props', () => {
                cmp.UNSAFE_componentWillReceiveProps(mockModProps);
                expect(spy.shallResetState).toHaveBeenCalledWith(mockModProps, mockProps);
                expect(spy.createState).toHaveBeenCalledWith(mockModProps, mockShallResetState);
                expect(spy.setState).toHaveBeenCalledWith({ ...mockState, ...mockModState });
            });
        });

        describe('render', () => {
            const mockSortedData = ['a', 'b'];
            const mockElem = null;
            let $elem: ReactElement;

            beforeEach(() => {
                mockProps = {
                    type: 'table',
                    expand: {},
                    component: {},
                    rowKey: 'id'
                };

                utilHandleSpy.cssCls.mockReturnValue('lorem');
                spy.getSortedData.mockReturnValue(mockSortedData);
                spy.getPgnCmpProps.mockReturnValue({ pgn: '' });
                spy.getHeaderProps.mockReturnValue({});
                spy.getRowElems.mockReturnValue(mockElem);
                spy.getGridBodyElem.mockReturnValue(mockElem);
                spy.getPreferredCmp.mockReturnValue({
                    Header: MockGridHeader,
                    Pagination: MockPagination,
                });
            });

            it('should render table if it is table', () => {
                mockStateProps(mockProps, { isTb: true });
                $elem = cmp.render();

                expect($elem.props.children[1].type).toBe('table');
            });

            it('should render list if it is list ', () => {
                mockStateProps(mockProps, { isTb: false });
                $elem = cmp.render();

                expect($elem.props.children[1]).toBeFalsy();
            });

            it('should render header if there is contextual headers', () => {
                mockStateProps(mockProps, { headerCtx: true });
                $elem = cmp.render();

                expect(spy.getGridBodyElem.mock.calls[0][1]).toBeTruthy();
            });

            it('should render pagination if pagination option is provided', () => {
                mockStateProps(mockProps, { pgnState: true });
                $elem = cmp.render();

                expect($elem.props.children.length).toBe(2);
            });

            it('should triggers calls', () => {
                mockStateProps(mockProps, mockState);
                $elem = cmp.render();

                expect(utilHandleSpy.cssCls).toHaveBeenCalledWith(cmp.BASE_CLS, mockProps.type);
                expect(spy.getSortedData).toHaveBeenCalled();
                expect(spy.getHeaderProps).toHaveBeenCalledWith(mockSortedData);
                expect(spy.getPgnCmpProps).toHaveBeenCalledWith(mockSortedData);
                expect(spy.getPreferredCmp).toHaveBeenCalledWith(mockProps.component);
                expect(spy.getRowElems).toHaveBeenCalledWith(mockSortedData);
                expect(spy.getGridBodyElem).toHaveBeenCalledWith(mockState.isTb, null, mockElem);
            });
        });
    });

    describe('State related', () => {
        describe('Method - createState: Create initial or updated state', () => {
            const mockBaseResultState = {
                rowsOption: 'rows',
                sortOption: 'sort-option',
                sortState: 'sort-state',
                pgnOption: 'pgn-option',
                pgnState: 'pgn-state',
                expdState: 'expd-state'
            };

            beforeEach(() => {
                mockProps = {
                    header: [],
                    component: {
                        rows: [...Array(2)]
                    },
                    data: [],
                    sort: {},
                    paginate: {},
                    expand: {},
                } as IProps;

                spy.createState.mockRestore();
                spy.transformRowOption.mockReturnValue('rows');
                sortHandleSpy.createOption.mockReturnValue('sort-option');
                sortHandleSpy.createState.mockReturnValue('sort-state');
                pgnHandleSpy.createOption.mockReturnValue('pgn-option');
                pgnHandleSpy.createState.mockReturnValue('pgn-state');
                rowExpdHandleSpy.createState.mockReturnValue('expd-state')
                headerGrpHandleSpy.getCtxTbHeaders.mockReturnValue('tb-header');
                headerGrpHandleSpy.getCtxListHeaders.mockReturnValue('list-header');
            });

            it('should return state for table when all options are provided', () => {
                expect(cmp.createState({
                    ...mockProps,
                    type: 'table',
                })).toEqual({
                    ...mockBaseResultState,
                    isTb: true,
                    headerCtx: 'tb-header',
                });
                expect(headerGrpHandleSpy.getCtxTbHeaders).toHaveBeenCalled();
            });

            it('should return state for list when all options are provided', () => {
                expect(cmp.createState({
                    ...mockProps,
                    type: 'list',
                })).toEqual({
                    ...mockBaseResultState,
                    isTb: false,
                    headerCtx: 'list-header',
                });
                expect(headerGrpHandleSpy.getCtxListHeaders).toHaveBeenCalled();
            });

            it('should return state when all options are not provided', () => {
                expect(cmp.createState({
                    component: {},
                } as IProps)).toEqual({
                    isTb: true,
                    headerCtx: null,
                    rowsOption: null,
                    sortOption: null,
                    sortState: null,
                    pgnOption: null,
                    pgnState: null,
                    expdState: null
                });
            });

            it('should return filtered state when provided which part of state should be reset', () => {
                const mockShallResetState = { isTb: true, headerCtx: false } as TShallResetState;
                expect(cmp.createState(
                    { ...mockProps, type: 'table' },
                     mockShallResetState
                )).toEqual({ isTb: true });
            });
        });

        describe('Method - shallResetState: Determine which states should be updated/re-created', () => {
            const { shallResetState } = DataGrid.prototype;

            beforeEach(() => {
                mockProps = {
                    type: '',
                    header: [],
                    data: [],
                    component: { rows: [] },
                    expand: {},
                    paginate: {},
                    sort: {}
                };
            });

            it('should check if need to reset expand state', () => {
                expect(shallResetState(mockProps, {
                    ...mockProps,
                    expand: false,
                }).expdState).toEqual(true);

                expect(shallResetState(mockProps, {
                    ...mockProps,
                    component: { rows: [1, 2]},
                }).expdState).toEqual(true);

                expect(shallResetState(mockProps, {
                    ...mockProps,
                    data: [1, 2]
                }).expdState).toEqual(true);
            });

            it('should check if need to reset sort option/state', () => {
                expect(shallResetState(mockProps, {
                    ...mockProps,
                    sort: false,
                }).sortState).toEqual(true);

                expect(shallResetState(mockProps, {
                    ...mockProps,
                    data: [1, 2]
                }).sortState).toEqual(true);

                expect(shallResetState(mockProps, {
                    ...mockProps,
                    header: [1, 2]
                }).sortState).toEqual(true);

                expect(shallResetState(mockProps, {
                    ...mockProps,
                    sort: false,
                }).sortOption).toEqual(true);
            });

            it('should check if need to reset paginate option/state', () => {
                expect(shallResetState(mockProps, {
                    ...mockProps,
                    paginate: false,
                }).pgnState).toEqual(true);

                expect(shallResetState(mockProps, {
                    ...mockProps,
                    data: [1, 2]
                }).pgnState).toEqual(true);

                expect(shallResetState(mockProps, {
                    ...mockProps,
                    paginate: false,
                }).pgnOption).toEqual(true);
            });

            it('should check if need to reset rows option', () => {
                expect(shallResetState(mockProps, {
                    ...mockProps,
                    component: { rows: [1, 2]},
                }).rowsOption).toEqual(true);

                expect(shallResetState(mockProps, {
                    ...mockProps,
                    expand: false
                }).rowsOption).toEqual(true);
            });

            it('should check if need to reset table type', () => {
                expect(shallResetState(mockProps, {
                    ...mockProps,
                    type: 'list'
                }).isTb).toEqual(true);
            });

            it('should check if need to reset header context', () => {
                expect(shallResetState(mockProps, {
                    ...mockProps,
                    header: [1, 2]
                }).headerCtx).toEqual(true);
            });

            it('should not reset when props are the same', () => {
                const isFalsy = Object.entries(shallResetState(mockProps, {...mockProps})).every(([key, val]) => !val);
                expect(isFalsy).toBe(true);
            });
        });
    });

    describe('Row and Row Transform', () => {
        describe('Method - transformRowOption: Transform the Row to return User Provided Row component', () => {
            it('should return transform row option', () => {
                const mockRtnFn: jest.Mock = jest.fn();
                const mockCmp: jest.Mock = jest.fn();
                spy.getRowTransformFn.mockReturnValue(mockRtnFn);

                expect(cmp.transformRowOption([
                    [ mockCmp ],
                    [ 'lorem', mockCmp ]
                ])).toEqual([
                    [ mockRtnFn ],
                    [ 'lorem', mockRtnFn ]
                ]);
            });
        });

        describe('Method - getRowTransformFn: Get the Transform Function which returns a Row Component', () => {
            it('should return the function', () => {
                mockProps = {} as IProps;
                const MockCmp = () => <h1>lorem</h1>;

                spy.getRowCmpProps.mockReturnValue({});
                const cmpTransformFn = cmp.getRowTransformFn(MockCmp);
                const { type: childType, props } = TestUtil.renderShallow(cmpTransformFn());
                expect(childType).toBe('h1');
                expect(props.children).toBe('lorem');
            });
        });

        describe('Method - getRowCmpProps: Get Props for Row component', () => {
            const mockBaseItemCtx: any = { itemId: 'itemId' };
            const MOCK_CLS: string = 'lorem';
            const mockExpdProps: string = 'expd';

            beforeEach(() => {
                mockProps = { component: {} } as IProps;
                mockState = { isTb: true, headerCtx: { colTotal: 1 }} as IState;
                spy.getRowCmpExpdProps.mockReturnValue(mockExpdProps);
                utilHandleSpy.cssCls.mockReturnValue(MOCK_CLS);
            });

            it('should return props when it is table', () => {
                mockStateProps(mockProps, {
                    ...mockState,
                    isTb: false,
                    headerCtx: { colTotal: 1 }
                });
                const { rowColStyle } = cmp.getRowCmpProps(mockBaseItemCtx);

                expect(rowColStyle).toEqual({ '--cols': 1 });
            });

            it('should return props when it is not table', () => {
                mockStateProps(mockProps, mockState);
                const { rowColStyle } = cmp.getRowCmpProps(mockBaseItemCtx);
                expect(rowColStyle).toBeFalsy();
            });

            it('should return props containing the sorted data', () => {
                const mockData = [];
                spy.getSortedData.mockReturnValue(mockData);
                mockStateProps(mockProps, mockState);

                const { data } = cmp.getRowCmpProps(mockBaseItemCtx);
                expect(data).toBe(mockData);
            });

            it('should return props when there are nested items', () => {
                mockStateProps( mockProps, mockState);
                const mockItemCtx = { ...mockBaseItemCtx, nestedItems: [] };
                const { expandProps, nestedItems, classNames } = cmp.getRowCmpProps(mockItemCtx);

                expect(expandProps).toEqual(mockExpdProps)
                expect(nestedItems).toEqual([]);
                expect(classNames).toEqual({
                    REG_ROW: MOCK_CLS,
                    NESTED_ROW: MOCK_CLS,
                    NESTED_GRID: MOCK_CLS
                })
                expect(spy.getRowCmpExpdProps).toHaveBeenCalledWith(mockItemCtx);
            });

            it('should return props when there is no nested items', () => {
                mockStateProps( mockProps, mockState);
                const { expandProps, nestedItems, classNames, ...rest } = cmp.getRowCmpProps(mockBaseItemCtx);

                expect(expandProps).toBeFalsy();
                expect(nestedItems).toBeFalsy();
                expect(classNames).toEqual({
                    REG_ROW: MOCK_CLS,
                    NESTED_ROW: '',
                    NESTED_GRID: ''
                });
                expect(rest).toEqual({
                    itemId: mockBaseItemCtx.itemId,
                    key: mockBaseItemCtx.itemId,
                    commonProps: undefined,
                    rowColStyle: null
                })
            });
        });

        describe('Method - getRowsElem: Get all the row elements', () => {
            const mockSortedData = [];
            const mockSlicedData = [1];
            const mockRtnRows = [];
            let sliceSpy: jest.SpyInstance;

            beforeEach(() => {
                mockProps = {
                    rowKey: 'lorem',
                    expand: { showAll: true }
                } as IProps;

                mockState = {
                    rowsOption: [ [''] ],
                    pgnState: { startIdx: 0, endIdx: 1}
                } as IState;

                sliceSpy = jest.spyOn(mockSortedData, 'slice' as any);
                sliceSpy.mockReturnValue(mockSlicedData);
                rowTransformHandleSpy.createCtxRows.mockReturnValue(mockRtnRows);
            });

            it('should return row elements when there is paginate state', () => {
                mockStateProps(mockProps, mockState);
                expect(cmp.getRowElems(mockSortedData)).toEqual(mockRtnRows);
                expect(rowTransformHandleSpy.createCtxRows).toHaveBeenCalledWith({
                    pgnStartIdx: 0,
                    data: mockSlicedData,
                    rows: mockState.rowsOption,
                    rowIdKey: mockProps.rowKey,
                    showAll: mockProps.expand.showAll
                });
            });

            it('should return row elements when there is no paginate state', () => {
                mockStateProps({ ...mockProps, expand: null }, { ...mockState, pgnState: null });
                expect(cmp.getRowElems(mockSortedData)).toEqual(mockRtnRows);
                expect(rowTransformHandleSpy.createCtxRows).toHaveBeenCalledWith({
                    data: mockSortedData,
                    rows: mockState.rowsOption,
                    rowIdKey: mockProps.rowKey,
                    showAll: undefined
                });
            });
        });
    });

    describe('Get Conditional Components', () => {
        describe('Method getGridBodyElem: Get the wrapped body element for grid', () => {
            const mockElem = null;
            const MOCK_CLS: string = 'lorem';

            beforeEach(() => {
                utilHandleSpy.cssCls.mockReturnValue(MOCK_CLS)
            });

            it('should return wrapped element when it is table', () => {
                const { props }: ReactElement = cmp.getGridBodyElem(true, mockElem, mockElem);
                const bodyElem: ReactElement = props.children[1];
                expect(bodyElem.type).toBe('tbody');
                expect(bodyElem.props.className).toBe(MOCK_CLS);
            });

            it('should return wrapped element when its not table', () => {
                const { props } = cmp.getGridBodyElem(false, mockElem, mockElem);
                const bodyElem: ReactElement = props.children[1];
                expect(bodyElem.type).toBe('ul');
                expect(bodyElem.props.className).toBe(MOCK_CLS);
            });
        });

        describe('Method - getPreferredCmp: Get User provided component or Default builtin component for header and pagination', () => {
            it('should return builtin components when there is no User provided components', () => {
                expect(cmp.getPreferredCmp({})).toEqual({
                    Header: GridHeader,
                    Pagination,
                });
            });

            it('should return User provided components when there is any', () => {
                const mockUserCmp = {
                    Header: jest.fn(),
                    Pagination: jest.fn()
                };
                expect(cmp.getPreferredCmp(mockUserCmp)).toEqual({ ...mockUserCmp });
            });
        });
    });


    describe('Header, Sort, Expand, Pagination', () => {
        let mockRtnHandler: jest.Mock;

        beforeEach(() => {
            mockRtnHandler = jest.fn();
        });

        describe('Method - getSortedData: Get either the raw or sorted data', () => {
            const mockRawData = [];
            const sortedData = [ {} ];

            beforeEach(() => {
                mockProps = { data: mockRawData };
                mockState = { sortState: { data: sortedData } };
            });

            it('should return sorted data if exists', () => {
                mockStateProps(mockProps, mockState);
                expect(cmp.getSortedData()).toBe(sortedData);
            });

            it('should return raw data if sorted data doesnt exist', () => {
                mockStateProps(mockProps, {});
                expect(cmp.getSortedData()).toBe(mockRawData);
            });
        });

        describe('Method - getHeaderProps: Get Props for Grid Header component', () => {
            const mockData = [];
            const mockRtnSortBtnProps = {};

            beforeEach(() => {
                mockProps = { type: 'table' };
                mockState = { headerCtx: {} };
            });

            it('should return props', () => {
                mockStateProps(mockProps, mockState);
                spy.getSortCmpProps.mockReturnValue(mockRtnSortBtnProps);
                const { sortBtnProps, ...props } = cmp.getHeaderProps(mockData);

                expect(props).toEqual({
                    data: mockData,
                    type: mockProps.type,
                    rows: mockState.headerCtx
                });
                expect(sortBtnProps('lorem')).toBe(mockRtnSortBtnProps);
            });
        });

        describe('Method - getSortCmpProps: Get the sorting related props used in Grid Header Component', () => {
            const mockRtnSortBtnAttr = {};
            const mockSortKey = '';
            const mockData = [];
            let mockCallback: jest.Mock;

            beforeEach(() => {
                mockCallback = jest.fn();
                mockProps = {
                    callback: { onSortChange: mockCallback }
                };
                spy.getOnStateChangeHandler.mockReturnValue(mockRtnHandler);
                sortHandleSpy.createGenericCmpAttr.mockReturnValue({ sortBtnAttr: mockRtnSortBtnAttr });
            });

            it('should return props when there is sort option and user callback exists', () => {
                mockStateProps(mockProps, { sortOption: {}})
                expect(cmp.getSortCmpProps(mockData, mockSortKey)).toBe(mockRtnSortBtnAttr);
                expect(spy.getOnStateChangeHandler).toHaveBeenCalledWith(mockCallback);
            });

            it('should return props when there is sort option and user callback doesnt exists', () => {
                mockStateProps({}, { sortOption: {}})
                expect(cmp.getSortCmpProps(mockData, mockSortKey)).toBe(mockRtnSortBtnAttr);
                expect(spy.getOnStateChangeHandler).toHaveBeenCalledWith(undefined);
            });

            it('should return null when there isnt sort option', () => {
                mockStateProps(mockProps, { sortOption: null})
                expect(cmp.getSortCmpProps(mockData, mockSortKey)).toBe(null);
            });
        });

        describe('Method - getRowCmpExpdProps: Get the expand related props for Row Component', () => {
            const mockItemCtx: any = {};
            const mockRtnProps = {};
            let mockCallback: jest.Mock;

            beforeEach(() => {
                mockState = { expdState: {} };
                mockCallback = jest.fn();
                mockProps = { expand: {}, callback: { onExpandChange: mockCallback } };
                spy.getOnStateChangeHandler.mockReturnValue(mockRtnHandler);
                rowExpdHandleSpy.getExpdBtnAttr.mockReturnValue(mockRtnProps);
            });

            it('should return props when user callback exists', () => {
                mockStateProps(mockProps, mockState);
                expect(cmp.getRowCmpExpdProps(mockItemCtx)).toEqual(mockRtnProps);
                expect(spy.getOnStateChangeHandler).toHaveBeenCalledWith(mockCallback);
            });

            it('should return props when user callback doesnt exists', () => {
                mockStateProps({}, mockState);
                expect(cmp.getRowCmpExpdProps(mockItemCtx)).toEqual(mockRtnProps);
                expect(spy.getOnStateChangeHandler).toHaveBeenCalledWith(undefined);
            });
        });

        describe('Method - getPgnCmpProps: Get the props for Pagination Component', () => {
            const mockData = [];
            const mockRtnProps = { sum: 2 };
            let mockCallback: jest.Mock;

            beforeEach(() => {
                mockState = { pgnOption: {}, pgnState: { lorem: 1 } };
                mockCallback = jest.fn();
                mockProps = { callback: { onPaginateChange: mockCallback } };
                spy.getOnStateChangeHandler.mockReturnValue(mockRtnHandler);
                pgnHandleSpy.createGenericCmpAttr.mockReturnValue(mockRtnProps);
            });

            it('should return props when there is paginate option and user callback exists', () => {
                mockStateProps(mockProps, mockState);
                expect(cmp.getPgnCmpProps(mockData)).toEqual({
                    ...mockState.pgnState,
                    ...mockRtnProps
                });
                expect(spy.getOnStateChangeHandler).toHaveBeenCalledWith(mockCallback);
            });

            it('should return props when there is paginate option and user callback doenst exist', () => {
                mockStateProps({}, mockState);
                expect(cmp.getPgnCmpProps(mockData)).toEqual({
                    ...mockState.pgnState,
                    ...mockRtnProps
                });
                expect(spy.getOnStateChangeHandler).toHaveBeenCalledWith(undefined);
            });

            it('should return null when there isnt paginate option', () => {
                mockStateProps(mockProps, {...mockState, pgnOption: null});
                expect(cmp.getPgnCmpProps(mockData)).toBe(null);
            });
        });

        describe('Method - getOnStateChangeHandler: Get Handler for state changes', () => {
            const mockModState = { isTb: false };
            let mockUserCallback: jest.Mock;

            beforeEach(() => {
                mockState = { isTb: true, rowsOption: [] };
                mockUserCallback = jest.fn();
                spy.setState.mockImplementation(() => {});
                cmp.state = mockState;
            });

            it('should return the handler when provided user callback', () => {
                const handler = cmp.getOnStateChangeHandler(mockUserCallback);

                handler(mockModState);
                expect(spy.setState).toHaveBeenCalledWith({
                    ...mockState,
                    ...mockModState
                });
                expect(mockUserCallback).toHaveBeenCalledWith(mockModState);
            });

            it('should return the handler when not provided user callback', () => {
                const handler = cmp.getOnStateChangeHandler(null);

                handler(mockModState);
                expect(spy.setState).toHaveBeenCalledWith({
                    ...mockState,
                    ...mockModState
                });
                expect(mockUserCallback).not.toHaveBeenCalled();
            });
        });
    });
});

