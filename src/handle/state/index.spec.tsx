import React from 'react';
import { TestUtil } from '../../asset/ts/test-util';
import { BaseStateManager } from './base-state-manager';
import { StateHandle } from '.';

describe('State Handle', () => {
    let $elem: HTMLElement;

    beforeEach(() => {
        $elem = TestUtil.setupElem();
    });

    afterEach(() => {
        TestUtil.teardown($elem);
    });

    describe('Single State and State Handler', () => {
        const MockCmp = ({ appState, appStateHandle }) => <h1 onClick={appStateHandle.onClick}>{appState.name}</h1>;
        const mockState = { name: 'john' };
        class MockStateHandler extends BaseStateManager {
            onClick() {
                return { name: 'jane' };
            }
        }
        let $h1: HTMLHeadingElement;

        beforeEach(() => {
            const WrappedMockCmp = StateHandle.init(MockCmp, {
                root: [ mockState, new MockStateHandler() ]
            });
            TestUtil.renderPlain($elem, WrappedMockCmp);
            $h1 = $elem.querySelector('h1');
        });

        it('should render and update', () => {
            expect($h1.textContent).toBe('john');
        });

        it('should update state', () => {
            TestUtil.triggerEvt($h1, 'click');
            expect($h1.textContent).toBe('jane');
        });
    });

    describe('Single State and State Handler with multiple partial handlers', () => {
        interface IMockStateManager extends MockPartialeHandlerA, MockPartialHandlerB {
            new(...args: any[]): IMockStateManager;
        };

        const MockCmp = ({ appState, appStateHandle }) => (
            <>
                <h1 onClick={appStateHandle.onH1Click}>{appState.name}</h1>
                <h2 onClick={appStateHandle.onH2Click}>{appState.name}</h2>
            </>
        );

        const mockState = { name: 'john' };

        class MockPartialeHandlerA extends BaseStateManager {
            onH1Click() {
                return { name: 'jane' };
            }
        }
        class MockPartialHandlerB extends BaseStateManager {
            onH2Click() {
                return { name: 'amy' };
            }
        }
        const MockStateHandler = BaseStateManager.join<IMockStateManager>([
            MockPartialeHandlerA,
            MockPartialHandlerB
        ]);

        let $h1: HTMLHeadingElement;
        let $h2: HTMLHeadingElement;

        beforeEach(() => {
            const WrappedMockCmp = StateHandle.init(MockCmp, {
                root: [ mockState, new MockStateHandler() ]
            });
            TestUtil.renderPlain($elem, WrappedMockCmp);
            $h1 = $elem.querySelector('h1');
            $h2 = $elem.querySelector('h2');
        });

        it('should render and update', () => {
            expect($h1.textContent).toBe('john');
        });

        it('should update state', () => {
            TestUtil.triggerEvt($h1, 'click');
            expect($h1.textContent).toBe('jane');

            TestUtil.triggerEvt($h2, 'click');
            expect($h2.textContent).toBe('amy');
        });
    });

    describe('Multiple States and State Handlers', () => {
        const MOCK_STATE_ONE = 'STATE1';
        const MOCK_STATE_TWO = 'STATE2';
        const MockCmp = ({ appState, appStateHandle }) => (
            <>
                <h1 onClick={appStateHandle[MOCK_STATE_ONE].onClick}>{appState[MOCK_STATE_ONE].name}</h1>
                <h2 onClick={appStateHandle[MOCK_STATE_TWO].onClick}>{appState[MOCK_STATE_TWO].name}</h2>
            </>
        );
        const mockState1 = { name: 'john1' };
        const mockState2 = { name: 'john2' };
        class MockStateHandler1 extends BaseStateManager {
            onClick() {
                return { name: 'jane1' };
            }
        }
        class MockStateHandler2 extends BaseStateManager {
            onClick() {
                return { name: 'jane2' };
            }
        }
        let $h1: HTMLHeadingElement;
        let $h2: HTMLHeadingElement;

        beforeEach(() => {
            const WrappedMockCmp = StateHandle.init(MockCmp, {
                [MOCK_STATE_ONE]: [ mockState1, new MockStateHandler1() ],
                [MOCK_STATE_TWO]: [ mockState2, new MockStateHandler2() ]
            });
            TestUtil.renderPlain($elem, WrappedMockCmp);
            $h1 = $elem.querySelector('h1');
            $h2 = $elem.querySelector('h2');
        });

        it('should render and update', () => {
            expect($h1.textContent).toBe('john1');
            expect($h2.textContent).toBe('john2');
        });

        it('should update state', () => {
            TestUtil.triggerEvt($h1, 'click');
            expect($h1.textContent).toBe('jane1');
            expect($h2.textContent).toBe('john2');

            TestUtil.triggerEvt($h2, 'click');
            expect($h1.textContent).toBe('jane1');
            expect($h2.textContent).toBe('jane2');
        });
    });
});