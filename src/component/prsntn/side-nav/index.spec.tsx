import { TestUtil } from '../../../test-util/';
// import { _SideNav } from './';

describe('Component - Side Nav', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Component Class', () => {
        describe('Constructor', () => {

        });

        describe('Lifecycle - UNSAFE_componentWillReceiveProps', () => {

        });

        describe('Method - getLisCls', () => {

        });

        describe('Method - getInitialState', () => {

        });

        describe('Method - onCLick', () => {

        });
    });

    describe('Render/DOM', () => {
        let elem: HTMLElement;
        let childElem: Element;

        beforeEach(() => {
            elem = TestUtil.setupElem();
            childElem = elem.children[0];
        });

        afterEach(() => {
            TestUtil.teardown(elem);
            elem = null;
        });

        /*
        * TODO:
        * active
        * - list item: class name, key, arrow, nested list <li> length & maxHeight
        * - nested list item: class name, key
        *
        * not-active
        * - list item: class name, arrow, nested list <li> length
        * - nested list item: class name, key
        *
        * class name
        * nav, ul, li, p, a, span
        */
    });
});

