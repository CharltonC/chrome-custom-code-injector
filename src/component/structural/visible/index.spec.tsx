import React from 'react';
import { TMethodSpy } from '../../../asset/ts/test-util/type';
import { TestUtil } from '../../../asset/ts/test-util/';
import { IProps } from './type';
import { _VisibleWrapper, VisibleWrapper } from './';
import { ReactElement } from 'react';

describe('Component - Visible Wrapper', () => {
    const mockBareProps: IProps = {};
    let cmp: _VisibleWrapper;
    let spy: TMethodSpy<_VisibleWrapper>;
    let setStateSpy: jest.SpyInstance;

    beforeEach(() => {
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Component Class', () => {
        describe('constructor', () => {
            it('should init without input props', () => {
                cmp = new _VisibleWrapper({});
                expect(cmp.state.isVisible).toBe(true);
            });

            it('should init with input props', () => {
                const mockDefVisible = false;
                cmp = new _VisibleWrapper({isDefVisible: mockDefVisible});
                expect(cmp.state.isVisible).toBe(mockDefVisible);
            });
        });

        describe('Method - onVisibleChange: Toggle visible state', () => {
            it('should toggle state', () => {
                cmp = new _VisibleWrapper({});
                setStateSpy = jest.spyOn(cmp, 'setState');

                cmp.onVisibleChange();
                expect(setStateSpy).toHaveBeenCalledWith({isVisible: false});
            });
        });
    });

    describe('Render/DOM', () => {
        const mockChildElem: ReactElement = <h1>lorem</h1>;
        let $elem: HTMLElement;
        let $childElem: HTMLElement;

        function syncChildElem() {
            $childElem = $elem.querySelector('h1');
        }

        beforeEach(() => {
            $elem = TestUtil.setupElem();
        });

        afterEach(() => {
            TestUtil.teardown($elem);
            $elem = null;
        });

        it('should render when it is visible', () => {
            TestUtil.renderPlain($elem, VisibleWrapper, {
                children: mockChildElem
            });
            syncChildElem();
            expect($childElem.style.display).not.toBe('none');
        });

        it('should render when it is invisible', () => {
            TestUtil.renderPlain($elem, VisibleWrapper, {
                isDefVisible: false,
                children: mockChildElem
            });
            syncChildElem();
            expect($childElem.style.display).toBe('none');
        });
    });
});