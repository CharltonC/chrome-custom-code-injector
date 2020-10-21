import { TestUtil } from '../../../asset/ts/test-util';
import { TMethodSpy } from '../../../asset/ts/test-util/type';
import { IProps, IState } from './type';
import { Dropdown } from '.';

describe('Component - Dropdown', () => {
    const mockBareProps: IProps = {id: 'id', list: []};
    const mockDefProps: IProps = {id: 'id', list: ['a', 'b']};
    let spy: TMethodSpy<Dropdown>;
    let setStateSpy: jest.SpyInstance;

    beforeEach(() => {
        spy = TestUtil.spyProtoMethods(Dropdown);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Component Class', () => {
        const mockRtnState = {} as IState;
        let cmp: Dropdown;

        describe('constructor', () => {
            it("should init ", () => {
                spy.getInitialState.mockReturnValue(mockRtnState);
                cmp = new Dropdown(mockBareProps);

                expect(cmp.state).toEqual(mockRtnState);
            });
        });

        describe('Lifecycle - UNSAFE_componentWillReceiveProps', () => {
            const mockPropsWithInitialSelectIdx: IProps = {...mockDefProps, selectIdx: 0};
            const mockPropsWithSameSelectIdx = {selectIdx: 0} as IProps;
            const mockPropsWithDiffSelectIdx = {selectIdx: 1} as IProps;
            let cmpWithSelectIdx: Dropdown;
            let cmpWithoutSelectIdx: Dropdown;

            beforeEach(() => {
                // Override/Clear all the spies set in the parent so that Component Methods called dont get recorded before they are instantiated
                jest.restoreAllMocks();

                cmpWithSelectIdx = new Dropdown(mockPropsWithInitialSelectIdx);
                cmpWithoutSelectIdx = new Dropdown(mockDefProps);

                spy.getInitialState = jest.spyOn(Dropdown.prototype, 'getInitialState').mockReturnValue(mockRtnState);
                setStateSpy = jest.spyOn(Dropdown.prototype, 'setState').mockImplementation(() => {});
            });

            it('should not set state and not proceed with update when select index is not provided in the first place', () => {
                cmpWithoutSelectIdx.UNSAFE_componentWillReceiveProps(mockPropsWithDiffSelectIdx);

                expect(spy.getInitialState).not.toHaveBeenCalled();
                expect(setStateSpy).not.toHaveBeenCalled();
            });

            it('should set state and proceed with update if new select index is different to old one when select index is provided in the first place', () => {
                const { list } = mockPropsWithInitialSelectIdx;
                const { selectIdx } = mockPropsWithDiffSelectIdx;
                cmpWithSelectIdx.UNSAFE_componentWillReceiveProps(mockPropsWithDiffSelectIdx);

                expect(spy.getInitialState).toHaveBeenCalledTimes(1);
                expect(spy.getInitialState).toHaveBeenCalledWith({list, selectIdx});
                expect(setStateSpy).toHaveBeenCalledWith(mockRtnState);
            });

            it('should not set state and not proceed with update if new select index is same as old one when select index is provided in the first place', () => {
                cmpWithSelectIdx.UNSAFE_componentWillReceiveProps(mockPropsWithSameSelectIdx);

                expect(spy.getInitialState).not.toHaveBeenCalled();
                expect(setStateSpy).not.toHaveBeenCalled();
            });
        });

        describe('Method - getInitialState', () => {
            const { getInitialState} = Dropdown.prototype;

            it('should return state when neither list nor select index are provided', () => {
                const { hsList, hsSelectIdx }: IState = getInitialState(mockBareProps);
                expect(hsList).toBe(false);
                expect(hsSelectIdx).toBe(false);
            });

            it('should return state when only list is provided', () => {
                const { hsList, hsSelectIdx }: IState = getInitialState(mockDefProps);
                expect(hsList).toBe(true);
                expect(hsSelectIdx).toBe(false);
            });

            it('should return state when list and invalid select index are provided', () => {
                const { hsList, hsSelectIdx }:  IState = getInitialState({...mockDefProps, selectIdx: 99});
                expect(hsList).toBe(true);
                expect(hsSelectIdx).toBe(false);
            });

            it('should return state when list and valid select index are provided', () => {
                const { hsList, hsSelectIdx }:  IState = getInitialState({...mockDefProps, selectIdx: 1});
                expect(hsList).toBe(true);
                expect(hsSelectIdx).toBe(true);
            });

            it('should return state when select index is 0 and the matching item in list is 0', () => {
                const { hsList, hsSelectIdx }:  IState = getInitialState({...mockBareProps, list: [0, 1], selectIdx: 0});
                expect(hsList).toBe(true);
                expect(hsSelectIdx).toBe(true);
            });
        });

        describe('Method - onSelect', () => {
            const mockOptionIdx: number = 0;
            const mockEvt: any = { target: {value: mockOptionIdx}};
            let mockOnSelect: jest.Mock;

            beforeEach(() => {
                mockOnSelect = jest.fn();
            });

            it('should not call the callback if not provided', () => {
                cmp = new Dropdown(mockBareProps);
                cmp.onSelect(mockEvt);

                expect(mockOnSelect).not.toHaveBeenCalled();
            });

            it('should call the callback if provided', () => {
                cmp = new Dropdown({...mockBareProps, onSelect: mockOnSelect});
                cmp.onSelect(mockEvt);

                expect(mockOnSelect).toHaveBeenCalledWith(mockEvt, mockOptionIdx);
            });
        });

        describe('Method - getClsName: Generate class names with suffixes based on border, label position and given suffixes from props', () => {
            beforeEach(() => {
                spy.getInitialState.mockImplementation(() => {});
                cmp = new Dropdown({} as IProps);
            });

            it('should return class names', () => {
                expect(cmp.getClsName('a', true, true)).toBe('dropdown dropdown--a dropdown--border dropdown--lt-label');

                expect(cmp.getClsName('a', true, false)).toBe('dropdown dropdown--a dropdown--border');

                expect(cmp.getClsName('a', false)).toBe('dropdown dropdown--a dropdown--plain');
            });
        });
    });

    describe('Render/DOM', () => {
        let $elem: HTMLElement;
        let $wrapper: HTMLElement;
        let $select: HTMLSelectElement;
        let $options: NodeListOf<HTMLOptionElement>;
        let $label: HTMLLabelElement;

        function syncChildElem() {
            $wrapper = $elem.querySelector('div');
            $select = $elem.querySelector('select');
            $options = $elem.querySelectorAll('option');
            $label = $elem.querySelector('label');
        }

        beforeEach(() => {
            $elem = TestUtil.setupElem();
        });

        afterEach(() => {
            TestUtil.teardown($elem);
            $elem = null;
        });

        it('should render the dropdown without border and withou label', () => {
            TestUtil.renderPlain($elem, Dropdown, mockDefProps);
            syncChildElem();

            expect($select.id).toBe(mockDefProps.id);
            expect($options.length).toBe(2);
            expect($label).toBeFalsy();
        });

        it('should render the dropdown with label if provided', () => {
            TestUtil.renderPlain($elem, Dropdown, { ...mockDefProps, label: 'lorem' });
            syncChildElem();

            expect($label).toBeTruthy();
        });

        it('should not render if list is not provided', () => {
            TestUtil.renderPlain($elem, Dropdown, mockBareProps);
            syncChildElem();

            expect($wrapper).toBeFalsy();
        });

        it('should tranform the text in list item if transform function is provided', () => {
            const listTxtTransform = (text) => `lorem-${text}`;
            TestUtil.renderPlain($elem, Dropdown, {...mockDefProps, listTxtTransform});
            syncChildElem();

            expect($options[0].textContent).toBe('lorem-a');
            expect($options[1].textContent).toBe('lorem-b');
        });

        it('should set the 1st option as selected when list is provided without select index', () => {
            TestUtil.renderPlain($elem, Dropdown, mockDefProps);
            syncChildElem();

            expect($options[0].selected).toBe(true);
            expect($options[1].selected).toBe(false);
        });

        it('should set the target option as selected when list and valid select index are provided', () => {
            TestUtil.renderPlain($elem, Dropdown, {...mockDefProps, selectIdx: 1});
            syncChildElem();

            expect($options[0].selected).toBe(false);
            expect($options[1].selected).toBe(true);
        });

        it('should set the 1st option as selected when list and invalid select index are provided', () => {
            TestUtil.renderPlain($elem, Dropdown, {...mockDefProps, selectIdx: 99});
            syncChildElem();

            expect($options[0].selected).toBe(true);
            expect($options[1].selected).toBe(false);
        });

        it('should trigger the `onSelect` event handler', () => {
            TestUtil.renderPlain($elem, Dropdown, mockDefProps);
            syncChildElem();
            expect($options[0].selected).toBe(true);
            expect($options[1].selected).toBe(false);

            $select.value = '1';
            TestUtil.triggerEvt($select, 'change');
            expect(spy.onSelect).toHaveBeenCalled();
            expect($options[0].selected).toBe(false);
            expect($options[1].selected).toBe(true);
        });

        it('should transfer unspecified props to `select` element', () => {
            TestUtil.renderPlain($elem, Dropdown, {...mockDefProps, disabled: true});
            syncChildElem();

            expect($select.disabled).toBe(true);
        });
    });
});

