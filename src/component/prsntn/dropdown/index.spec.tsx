import { TestUtil } from '../../../test-util/';
import { IProps, IState } from './type';
import { _Dropdown, Dropdown } from './';

describe('Component - TODO: Component Name', () => {
    const mockBareProps: IProps = {id: 'id', list: []};
    const mockDefProps: IProps = {id: 'id', list: ['a', 'b']};
    let getInitialStateSpy: jest.SpyInstance;
    let onSelectSpy: jest.SpyInstance;

    beforeEach(() => {
        getInitialStateSpy = jest.spyOn(_Dropdown.prototype, 'getInitialState');
        onSelectSpy = jest.spyOn(_Dropdown.prototype, 'onSelect');
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Component Class', () => {
        let cmp: _Dropdown;

        describe('constructor', () => {
            it("should init ", () => {
                const mockRtnState = {};
                getInitialStateSpy.mockReturnValue(mockRtnState);
                cmp = new _Dropdown(mockBareProps);

                expect(cmp.state).toEqual(mockRtnState);
            });
        });

        describe('Method - getInitialState', () => {
            const { getInitialState} = _Dropdown.prototype;

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
        });

        describe('Method - onSelect', () => {
            const mockOptionIdx: number = 0;
            const mockEvt: any = { target: {value: mockOptionIdx}};
            let mockOnSelect: jest.Mock;

            beforeEach(() => {
                mockOnSelect = jest.fn();
            });

            it('should not call the callback if not provided', () => {
                cmp = new _Dropdown(mockBareProps);
                cmp.onSelect(mockEvt);

                expect(mockOnSelect).not.toHaveBeenCalled();
            });

            it('should call the callback if provided', () => {
                cmp = new _Dropdown({...mockBareProps, onSelect: mockOnSelect});
                cmp.onSelect(mockEvt);

                expect(mockOnSelect).toHaveBeenCalledWith(mockEvt, mockOptionIdx);
            });
        });
    });

    describe('Render/DOM', () => {
        let $elem: HTMLElement;
        let $wrapper: HTMLElement;
        let $select: HTMLSelectElement;
        let $options: NodeListOf<HTMLOptionElement>;

        function syncChildElem() {
            $wrapper = $elem.querySelector('div');
            $select = $elem.querySelector('select');
            $options = $elem.querySelectorAll('option');
        }

        beforeEach(() => {
            $elem = TestUtil.setupElem();
        });

        afterEach(() => {
            TestUtil.teardown($elem);
            $elem = null;
        });

        it('should render the dropdown without border', () => {
            TestUtil.renderPlain($elem, Dropdown, mockDefProps);
            syncChildElem();

            expect($wrapper.className).toBe('dropdown dropdown--plain');
            expect($select.id).toBe(mockDefProps.id);
            expect($options.length).toBe(2);
        });

        it('should render the dropdown with border', () => {
            TestUtil.renderPlain($elem, Dropdown, {...mockDefProps, border: true});
            syncChildElem();

            expect($wrapper.className).toBe('dropdown dropdown--border');
        });

        it('should not render if list is not provided', () => {
            TestUtil.renderPlain($elem, Dropdown, mockBareProps);
            syncChildElem();

            expect($wrapper).toBeFalsy();
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

    });
});

