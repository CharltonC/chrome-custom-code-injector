import { TestUtil } from '../../../test-util/';
// import { IProps, IState } from './type';
// import { CmpCls } from './';

describe('Component - TODO: Component Name', () => {
    describe('Component Class', () => {
        describe('constructor', () => {
            it("should init", () => {
                expect(true).toBe(true);
            });
        });

        describe('Lifecycle - TODO: Name', () => {

        });

        describe('Method - TODO: Name', () => {

        });
    });

    describe('Render/DOM', () => {
        let $elem: HTMLElement;

        function syncChildElem() {
            // $childElem: HTMLElement = $elem.querySelector('');
        }

        beforeEach(() => {
            $elem = TestUtil.setupElem();
            syncChildElem();
        });

        afterEach(() => {
            TestUtil.teardown($elem);
            $elem = null;
        });

        describe('default render', () => {
            it('should render ..', () => {});
        });

        describe('interaction', () => {

        });
    });
});

