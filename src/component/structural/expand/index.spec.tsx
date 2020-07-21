import React, { ReactElement } from 'react';
import { TMethodSpy } from '../../../asset/ts/test-util/type';
import { TestUtil } from '../../../asset/ts/test-util';
import { IProps, IState } from './type';
import { _ExpandWrapper, ExpandWrapper } from '.';

describe('Component - Visible Wrapper', () => {
    let cmp: _ExpandWrapper;
    let spy: TMethodSpy<_ExpandWrapper>;
    let setStateSpy: jest.SpyInstance;

    beforeEach(() => {
        spy = TestUtil.spyProtoMethods(_ExpandWrapper);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Component Class', () => {
        const mockCallback: jest.Mock = jest.fn();
        const mockProps: IProps = { initial: false };

        describe('constructor', () => {
            beforeEach(() => {
                cmp = new _ExpandWrapper(mockProps);
            });

            it('should init without input props', () => {
                expect(cmp.state).toEqual({ isOpen: false });
            });
        });

        describe('Method - getChildProps: Get Extra Props to be passed to Children Element', () => {
            const mockIsOpen: boolean = true;

            beforeEach(() => {
                cmp = new _ExpandWrapper(mockProps);
                setStateSpy = jest.spyOn(cmp, 'setState');
                setStateSpy.mockImplementation(() => {});
            });

            it('should return child props when callback is not provided', () => {
                const { isOpen, onToggle } = cmp.getChildProps(mockIsOpen).toggleProps;
                onToggle();

                expect(isOpen).toBe(mockIsOpen);
                expect(setStateSpy).toHaveBeenCalledWith({isOpen: !isOpen});
                expect(mockCallback).not.toHaveBeenCalled();
            });

            it('should return child props when callback is provided', () => {
                const { isOpen, onToggle } = cmp.getChildProps(mockIsOpen, mockCallback).toggleProps;
                onToggle();

                expect(isOpen).toBe(mockIsOpen);
                expect(setStateSpy).toHaveBeenCalledWith({isOpen: !isOpen});
                expect(mockCallback).toHaveBeenCalledWith(!isOpen);
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
            TestUtil.renderPlain($elem, ExpandWrapper, {
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
            expect(spy.getChildProps).toHaveBeenCalledWith(true, undefined);
            expect(cloneElemSpy).toHaveBeenCalledWith(mockChild, mockRtnChildProps);
        });
    });
});