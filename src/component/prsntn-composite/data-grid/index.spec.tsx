import React, { ReactElement } from 'react';
import TestRenderer from 'react-test-renderer';
import { TMethodSpy } from '../../../asset/ts/test-util/type';
import { TestUtil } from '../../../asset/ts/test-util';
import { UtilHandle } from '../../../service/ui-handle/util/index';
import { ExpdHandle } from '../../../service/ui-handle/expand';
import { RowHandle } from '../../../service/ui-handle/row';
import { SortHandle } from '../../../service/ui-handle/sort';
import { PgnHandle } from '../../../service/ui-handle/pagination';
import { HeaderGrpHandle } from '../../../service/ui-handle/header-group';
import { Pagination } from '../../prsntn-grp/pagination';
import { GridHeader } from '../../prsntn-grp/grid-header';
import { DataGrid } from './';
import { IProps, IState, TShallResetState } from './type';


describe('Component - Data Grid', () => {
    const MockPagination = () => <div className="pagination"/>;
    const MockGridHeader = () => <div className="header"/>;
    let cmp: DataGrid;
    let spy: TMethodSpy<DataGrid>;
    let utilHandleSpy: TMethodSpy<UtilHandle>;
    let rowHandleSpy: TMethodSpy<RowHandle>;
    let expdHandleSpy: TMethodSpy<ExpdHandle>;
    let sortHandleSpy: TMethodSpy<SortHandle>;
    let pgnHandleSpy: TMethodSpy<PgnHandle>;
    let headerGrpHandleSpy: TMethodSpy<HeaderGrpHandle>;

    beforeEach(() => {
        spy = TestUtil.spyProtoMethods(DataGrid, ['setState']);
        utilHandleSpy = TestUtil.spyProtoMethods(UtilHandle);
        rowHandleSpy = TestUtil.spyProtoMethods(RowHandle);
        expdHandleSpy = TestUtil.spyProtoMethods(ExpdHandle);
        sortHandleSpy = TestUtil.spyProtoMethods(SortHandle);
        pgnHandleSpy = TestUtil.spyProtoMethods(PgnHandle);
        headerGrpHandleSpy = TestUtil.spyProtoMethods(HeaderGrpHandle);

        spy.createState.mockReturnValue({});
        cmp = new DataGrid({} as IProps);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Buildin API', () => {
        describe('constructor', () => {
            it('should initialize', () => {
                expect(cmp.state).toEqual({});
            });
        });

        describe('Lifecycle - UNSAFE_componentWillReceiveProps', () => {
            beforeEach(() => {
                spy.shallResetState.mockReturnValue({});
                spy.setState.mockImplementation(() => {});
            });

            it('should check and set state based on the modified props', () => {
                cmp.UNSAFE_componentWillReceiveProps({} as IProps);
                expect(spy.setState).toHaveBeenCalledWith({});
            });
        });

        describe('render', () => {
            const mockBaseProps = {
                type: 'table',
                expand: {},
                component: {},
                rowKey: 'id'
            } as IProps;

            beforeEach(() => {
                utilHandleSpy.cssCls.mockReturnValue('lorem');
                spy.getSortedData.mockReturnValue(['a', 'b']);
                spy.getPgnCmpProps.mockReturnValue({ pgn: '' });
                spy.getHeaderProps.mockReturnValue({});

                spy.getRowElems.mockReturnValue([]);
                spy.getGridBodyElem.mockReturnValue(null);
                spy.getPreferredCmp.mockReturnValue({
                    Header: MockGridHeader,
                    Pagination: MockPagination,
                });
            });

            it('should render table if it is table', () => {
                spy.createState.mockReturnValue({ isTb: true });
                const $elem: ReactElement = new DataGrid(mockBaseProps).render();
                expect($elem.props.children[1].type).toBe('table');
            });

            it('should render list if it is list ', () => {
                spy.createState.mockReturnValue({ isTb: false });
                const $elem: ReactElement = new DataGrid(mockBaseProps).render();
                expect($elem.props.children[1]).toBeFalsy();
            });

            it('should render header if there is contextual headers', () => {
                spy.createState.mockReturnValue({ headerCtx: true });
                new DataGrid(mockBaseProps).render();
                expect(spy.getGridBodyElem.mock.calls[0][1]).toBeTruthy();
            });

            it('should render pagination if pagination option is provided', () => {
                spy.createState.mockReturnValue({ pgnState: true });
                const $elem: ReactElement = new DataGrid(mockBaseProps).render();
                expect($elem.props.children.length).toBe(2);
            });
        });
    });

    describe('State related', () => {
        describe('Method - createState: Create initial or updated state', () => {
            const mockBaseProps = {
                header: [],
                component: {
                    rows: [...Array(2)]
                },
                data: [],
                sort: {},
                paginate: {},
                expand: {},
            } as IProps;

            const mockBaseResultState = {
                rowsOption: 'rows',
                sortOption: 'sort-option',
                sortState: 'sort-state',
                pgnOption: 'pgn-option',
                pgnState: 'pgn-state',
                expdState: 'expd-state'
            };

            beforeEach(() => {
                spy.createState.mockRestore();

                spy.transformRowOption.mockReturnValue('rows');
                sortHandleSpy.createOption.mockReturnValue('sort-option');
                sortHandleSpy.createState.mockReturnValue('sort-state');
                pgnHandleSpy.createOption.mockReturnValue('pgn-option');
                pgnHandleSpy.createState.mockReturnValue('pgn-state');
                expdHandleSpy.createState.mockReturnValue('expd-state')
                headerGrpHandleSpy.getCtxTbHeaders.mockReturnValue('tb-header');
                headerGrpHandleSpy.getCtxListHeaders.mockReturnValue('list-header');
            });

            it('should return state for table when all options are provided', () => {
                expect(cmp.createState({
                    ...mockBaseProps,
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
                    ...mockBaseProps,
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
                const mockProps: IProps = { ...mockBaseProps, type: 'table' };
                const mockShallResetState = { isTb: true, headerCtx: false } as TShallResetState;
                expect(cmp.createState(mockProps, mockShallResetState)).toEqual({ isTb: true });
            });
        });

        describe('Method - shallResetState: Determine which states should be updated/re-created', () => {
            const { shallResetState } = DataGrid.prototype;
            const mockBaseProps: any = {
                type: '',
                header: [],
                data: [],
                component: { rows: [] },
                expand: {},
                paginate: {},
                sort: {}
            };

            it('should check if need to reset expand state', () => {
                expect(shallResetState(mockBaseProps, {
                    ...mockBaseProps,
                    expand: false,
                }).expdState).toEqual(true);

                expect(shallResetState(mockBaseProps, {
                    ...mockBaseProps,
                    component: { rows: [1, 2]},
                }).expdState).toEqual(true);

                expect(shallResetState(mockBaseProps, {
                    ...mockBaseProps,
                    data: [1, 2]
                }).expdState).toEqual(true);
            });

            it('should check if need to reset sort option/state', () => {
                expect(shallResetState(mockBaseProps, {
                    ...mockBaseProps,
                    sort: false,
                }).sortState).toEqual(true);

                expect(shallResetState(mockBaseProps, {
                    ...mockBaseProps,
                    data: [1, 2]
                }).sortState).toEqual(true);

                expect(shallResetState(mockBaseProps, {
                    ...mockBaseProps,
                    header: [1, 2]
                }).sortState).toEqual(true);

                expect(shallResetState(mockBaseProps, {
                    ...mockBaseProps,
                    sort: false,
                }).sortOption).toEqual(true);
            });

            it('should check if need to reset paginate option/state', () => {
                expect(shallResetState(mockBaseProps, {
                    ...mockBaseProps,
                    paginate: false,
                }).pgnState).toEqual(true);

                expect(shallResetState(mockBaseProps, {
                    ...mockBaseProps,
                    data: [1, 2]
                }).pgnState).toEqual(true);

                expect(shallResetState(mockBaseProps, {
                    ...mockBaseProps,
                    paginate: false,
                }).pgnOption).toEqual(true);
            });

            it('should check if need to reset rows option', () => {
                expect(shallResetState(mockBaseProps, {
                    ...mockBaseProps,
                    component: { rows: [1, 2]},
                }).rowsOption).toEqual(true);

                expect(shallResetState(mockBaseProps, {
                    ...mockBaseProps,
                    expand: false
                }).rowsOption).toEqual(true);
            });

            it('should check if need to reset table type', () => {
                expect(shallResetState(mockBaseProps, {
                    ...mockBaseProps,
                    type: 'list'
                }).isTb).toEqual(true);
            });

            it('should check if need to reset header context', () => {
                expect(shallResetState(mockBaseProps, {
                    ...mockBaseProps,
                    header: [1, 2]
                }).headerCtx).toEqual(true);
            });

            it('should not reset', () => {
                const isFalsy = Object.entries(shallResetState(mockBaseProps, mockBaseProps)).every(([key, val]) => !val);
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
                const mockProps = {} as IProps;
                const MockCmp = () => <h1>lorem</h1>;

                spy.getRowCmpProps.mockReturnValue({});
                const cmpTransformFn = cmp.getRowTransformFn(MockCmp, mockProps);
                const { type, children } = TestRenderer.create(cmpTransformFn()).toJSON();
                expect(type).toBe('h1');
                expect(children[0]).toBe('lorem');
            });
        });

        describe('Method - getRowCmpProps: Get Props for Row component', () => {
            const mockBaseItemCtx: any = { itemId: 'itemId' };
            const mockBaseProps = { component: {} } as IProps;
            const mockBaseState = { isTb: true, headerCtx: { colTotal: 1 }} as IState;
            const MOCK_CLS: string = 'lorem';
            const mockExpdProps: string = 'expd';

            beforeEach(() => {
                spy.getRowCmpExpdProps.mockReturnValue(mockExpdProps);
                utilHandleSpy.cssCls.mockReturnValue(MOCK_CLS);
            });

            it('should return props when it is table', () => {
                const mockState = {
                    ...mockBaseState,
                    isTb: false,
                    headerCtx: { colTotal: 1 }
                } as IState;
                const { rowColStyle } = cmp.getRowCmpProps(mockBaseItemCtx, mockBaseProps, mockState);

                expect(rowColStyle).toEqual({ '--cols': 1 });
            });

            it('should return props when it is not table', () => {
                const { rowColStyle } = cmp.getRowCmpProps(mockBaseItemCtx, mockBaseProps, mockBaseState);
                expect(rowColStyle).toBeFalsy();
            });

            it('should return props when there are nested items', () => {
                const mockItemCtx = { ...mockBaseItemCtx, nestedItems: [] };
                const { expandProps, nestedItems, classNames } = cmp.getRowCmpProps(mockItemCtx, mockBaseProps, mockBaseState);

                expect(expandProps).toEqual(mockExpdProps)
                expect(nestedItems).toEqual([]);
                expect(classNames).toEqual({
                    REG_ROW: MOCK_CLS,
                    NESTED_ROW: MOCK_CLS,
                    NESTED_GRID: MOCK_CLS
                })
                expect(spy.getRowCmpExpdProps).toHaveBeenCalledWith(mockItemCtx, mockBaseProps, mockBaseState);
            });

            it('should return props when there is no nested items', () => {
                const { expandProps, nestedItems, classNames, ...rest } = cmp.getRowCmpProps(mockBaseItemCtx, mockBaseProps, mockBaseState);

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
            const mockBaseProps = {
                rowKey: 'lorem',
                expand: { showAll: true }
            } as IProps;

            const mockBaseState = {
                rowsOption: [ [''] ],
                pgnState: { startIdx: 0, endIdx: 1}
            } as IState;

            const mockSortedData = [];
            const mockSlicedData = [1];
            const mockRtnRows = [];
            let sliceSpy: jest.SpyInstance;

            beforeEach(() => {
                sliceSpy = jest.spyOn(mockSortedData, 'slice' as any);
                sliceSpy.mockReturnValue(mockSlicedData);
                rowHandleSpy.createCtxRows.mockReturnValue(mockRtnRows);
            });

            it('should return row elements when there is paginate state', () => {
                expect(cmp.getRowElems(mockSortedData, mockBaseProps, mockBaseState)).toEqual(mockRtnRows);
                expect(rowHandleSpy.createCtxRows).toHaveBeenCalledWith({
                    data: mockSlicedData,
                    rows: mockBaseState.rowsOption,
                    rowIdKey: mockBaseProps.rowKey,
                    showAll: mockBaseProps.expand.showAll
                });
            });

            it('should return row elements when there is no paginate state', () => {
                const mockState = { ...mockBaseState, pgnState: null };
                const mockProps = { ...mockBaseProps, expand: null };

                expect(cmp.getRowElems(mockSortedData, mockProps, mockState)).toEqual(mockRtnRows);
                expect(rowHandleSpy.createCtxRows).toHaveBeenCalledWith({
                    data: mockSortedData,
                    rows: mockBaseState.rowsOption,
                    rowIdKey: mockBaseProps.rowKey,
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
            const mockProps = { data: mockRawData };

            it('should return sorted data if exists', () => {
                const sortedData = [ {} ];
                const mockState = { sortState: { data: sortedData } };
                expect(cmp.getSortedData(mockProps, mockState)).toBe(sortedData);
            });

            it('should return raw data if sorted data doesnt exist', () => {
                expect(cmp.getSortedData(mockProps, {})).toBe(mockRawData);
            });
        });

        describe('Method - getHeaderProps: Get Props for Grid Header component', () => {
            const mockData = [];
            const mockProps = { type: 'table' } as IProps;
            const mockState = { headerCtx: {} } as IState;
            const mockRtnSortBtnProps = {};

            it('should return props', () => {
                spy.getSortCmpProps.mockReturnValue(mockRtnSortBtnProps);
                const { sortBtnProps, ...props } = cmp.getHeaderProps(mockData, mockProps, mockState);

                expect(props).toEqual({ type: mockProps.type, rows: mockState.headerCtx });
                expect(sortBtnProps('lorem')).toBe(mockRtnSortBtnProps);
            });
        });

        describe('Method - getSortCmpProps: Get the sorting related props used in Grid Header Component', () => {
            const mockRtnSortBtnAttr = {};
            const mockQuery: any = {
                sortKey: '',
                data: [],
                sortOption: {},
                onSortChange: jest.fn()
            };

            beforeEach(() => {
                spy.getOnStateChangeHandler.mockReturnValue(mockRtnHandler);
                sortHandleSpy.createGenericCmpAttr.mockReturnValue({ sortBtnAttr: mockRtnSortBtnAttr });
            });

            it('should return props when there is sort option', () => {
                expect(cmp.getSortCmpProps(mockQuery)).toBe(mockRtnSortBtnAttr);
            });

            it('should return null when there isnt sort option', () => {
                expect(cmp.getSortCmpProps({...mockQuery, sortOption: null})).toBe(null);
            });
        });

        describe('Method - getRowCmpExpdProps: Get the expand related props for Row Component', () => {
            const mockItemCtx: any = {};
            const mockState = { expdState: {} };
            const mockRtnProps = {};
            let mockProps: any;
            let mockCallback: jest.Mock;

            beforeEach(() => {
                mockCallback = jest.fn();
                mockProps = { expand: {}, callback: { onExpandChange: mockCallback } };
                spy.getOnStateChangeHandler.mockReturnValue(mockRtnHandler);
                expdHandleSpy.getExpdBtnAttr.mockReturnValue(mockRtnProps);
            });

            it('should return props when user callback exists', () => {
                expect(cmp.getRowCmpExpdProps(mockItemCtx, mockProps, mockState)).toEqual(mockRtnProps);
                expect(spy.getOnStateChangeHandler).toHaveBeenCalledWith(mockCallback);
            });

            it('should return props when user callback doesnt exists', () => {
                mockProps = {};
                expect(cmp.getRowCmpExpdProps(mockItemCtx, mockProps, mockState)).toEqual(mockRtnProps);
                expect(spy.getOnStateChangeHandler).toHaveBeenCalledWith(undefined);
            });
        });

        describe('Method - getPgnCmpProps: Get the props for Pagination Component', () => {
            const mockData = [];
            const mockState: any = { pgnOption: {}, pgnState: { lorem: 1 } };
            const mockRtnProps = { sum: 2 };
            let mockProps: any;
            let mockCallback: jest.Mock;

            beforeEach(() => {
                mockCallback = jest.fn();
                mockProps = { callback: { onPaginateChange: mockCallback } };
                spy.getOnStateChangeHandler.mockReturnValue(mockRtnHandler);
                pgnHandleSpy.createGenericCmpAttr.mockReturnValue(mockRtnProps);
            });

            it('should return props when there is paginate option and user callback exists', () => {
                expect(cmp.getPgnCmpProps(mockData, mockProps, mockState)).toEqual({
                    ...mockState.pgnState,
                    ...mockRtnProps
                });
                expect(spy.getOnStateChangeHandler).toHaveBeenCalledWith(mockCallback);
            });

            it('should return props when there is paginate option and user callback doenst exist', () => {
                mockProps = {};
                expect(cmp.getPgnCmpProps(mockData, mockProps, mockState)).toEqual({
                    ...mockState.pgnState,
                    ...mockRtnProps
                });
                expect(spy.getOnStateChangeHandler).toHaveBeenCalledWith(undefined);
            });

            it('should return null when there isnt paginate option', () => {
                expect(cmp.getPgnCmpProps(mockData, mockProps, {...mockState, pgnOption: null})).toBe(null);
            });
        });

        describe('Method - getOnStateChangeHandler: Get Handler for state changes', () => {
            const mockState = { isTb: true, rowsOption: [] } as IState;
            const mockModState = { isTb: false };
            let mockUserCallback: jest.Mock;

            beforeEach(() => {
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

