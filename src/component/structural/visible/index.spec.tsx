import React, { ReactElement } from 'react';
import { TMethodSpy } from '../../../asset/ts/test-util/type';
import { TestUtil } from '../../../asset/ts/test-util/';
import { IProps, IState } from './type';
import { _VisibleWrapper, VisibleWrapper } from './';

describe('Component - Visible Wrapper', () => {
    let cmp: _VisibleWrapper;
    let spy: TMethodSpy<_VisibleWrapper>;
    let setStateSpy: jest.SpyInstance;

    beforeEach(() => {
        spy = TestUtil.spyProtoMethods(_VisibleWrapper);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Component Class', () => {
        const mockProps: IProps = { show: true, toggle: true };
        const mockRtnState: IState = {
            isVisible: true,
            toggle: true
        };

        describe('constructor', () => {
            beforeEach(() => {
                spy.createState.mockReturnValue(mockRtnState);
                cmp = new _VisibleWrapper(mockProps);
            });

            it('should init without input props', () => {
                expect(cmp.state).toEqual(mockRtnState);
                expect(spy.createState).toHaveBeenCalledWith(mockProps);
            });
        });

        describe('Lifecyle - UNSAFE_componentWillReceiveProps', () => {
            beforeEach(() => {
                cmp = new _VisibleWrapper(mockProps);
                setStateSpy = jest.spyOn(cmp, 'setState');
                setStateSpy.mockImplementation(() => {});
            });

            it('should set new state when props changes', () => {
                const mockModProps: IProps = { show: false };
                spy.hasDiffProps.mockReturnValue([true, false]);

                cmp.UNSAFE_componentWillReceiveProps(mockModProps);
                expect(spy.hasDiffProps).toHaveBeenCalledWith(mockModProps, cmp.state);
                expect(setStateSpy).toHaveBeenCalledWith({
                    ...cmp.state,
                    isVisible: false,
                });
            });

            it('should set new state when toggle changes', () => {
                const mockModProps: IProps = { toggle: false };
                spy.hasDiffProps.mockReturnValue([false, true]);

                cmp.UNSAFE_componentWillReceiveProps(mockModProps);
                expect(spy.hasDiffProps).toHaveBeenCalledWith(mockModProps, cmp.state);
                expect(setStateSpy).toHaveBeenCalledWith({
                    ...cmp.state,
                    toggle: false
                });
            });
        });

        describe('Method - createState: Create Initial State', () => {
            beforeEach(() => {
                cmp = new _VisibleWrapper(mockProps);
            });

            it('should return state when props are undefined', () => {
                expect(cmp.createState({})).toEqual({
                    isVisible: true,
                    toggle: true
                });
            });

            it('should return state when props are defined', () => {
                expect(cmp.createState({ show: false, toggle: false })).toEqual({
                    isVisible: false,
                    toggle: false
                });
            });
        });

        describe('Method - getChildProps: Get Extra Props to be passed to Children Element', () => {
            beforeEach(() => {
                cmp = new _VisibleWrapper(mockProps);
                setStateSpy = jest.spyOn(cmp, 'setState');
                setStateSpy.mockImplementation(() => {});
            });

            it('should return child props when toggle is off and its visible', () => {
                const mockState: IState = {isVisible: false, toggle: false};
                const { style, toggleProps } = cmp.getChildProps(mockState);

                expect(style).toEqual({display: 'none'});
                expect(toggleProps).toBeFalsy();
            });

            it('should return child props when toggle is on and its not visible', () => {
                const mockState: IState = {isVisible: true, toggle: true};
                const { style, toggleProps } = cmp.getChildProps(mockState);
                const { isVisible, onVisibleChange } = toggleProps;
                onVisibleChange();

                expect(style).toBeFalsy();
                expect(isVisible).toBe(true);
                expect(setStateSpy).toHaveBeenCalledWith({isVisible: !isVisible});
            });
        });

        describe('Method - hasDiffProps: Check if the props are different', () => {
            const { hasDiffProps } = _VisibleWrapper.prototype;

            it('should check if props are different', () => {
                expect(hasDiffProps(
                    { show: true, toggle: true },
                    { isVisible: true, toggle: true }
                )).toEqual([ false, false ]);

                expect(hasDiffProps(
                    {},
                    { isVisible: true, toggle: true }
                )).toEqual([ false, false ]);

                expect(hasDiffProps(
                    { show: false, toggle: false },
                    { isVisible: true, toggle: true }
                )).toEqual([ true, true ]);
            });
        });
    });

    describe('Render/DOM', () => {
        // Specify type for `toggleProps` to silence React unknown props warning
        const MockChild = (props: {toggleProps?: any;}) => <h1>lorem</h1>;
        const mockChild = <MockChild />;
        const mockChildClone: ReactElement = <h1>sum</h1>;
        const mockRtnChildProps: any = {};
        let $elem: HTMLElement;
        let $childElem: HTMLElement;
        let cloneElemSpy: jest.SpyInstance;

        function syncChildElem() {
            $childElem = $elem.querySelector('h1');
        }

        beforeEach(() => {
            cloneElemSpy = jest.spyOn(React, 'cloneElement');
            cloneElemSpy.mockReturnValue(mockChildClone);
            spy.getChildProps.mockReturnValue(mockRtnChildProps);

            $elem = TestUtil.setupElem();
            TestUtil.renderPlain($elem, VisibleWrapper, {
                children: mockChild
            });
            syncChildElem();
        });

        afterEach(() => {
            TestUtil.teardown($elem);
            $elem = null;
        });

        it('should render when it is visible', () => {
            expect($childElem.textContent).toBe('sum');
            expect(spy.getChildProps).toHaveBeenCalledWith({
                isVisible: true,
                toggle: true
            });
            expect(cloneElemSpy).toHaveBeenCalledWith(mockChild, mockRtnChildProps);
        });
    });
});