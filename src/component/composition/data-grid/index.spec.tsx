import { TestUtil } from '../../../asset/ts/test-util';
// import { IProps, IState } from './type';
// import { CmpCls } from './';

describe('Component - TODO: Component Name', () => {
    // const mockBareProps: IProps = {};
    // const mockDefProps: IProps = {};
    // let methodSpy: jest.SpyInstance;

    beforeEach(() => {
        // methodSpy = jest.spyOn(_CmpCls.prototype, 'method');
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Component Class', () => {
        // let cmp: _CmpCls;

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
        // let $childElem: HTMLElement;

        function syncChildElem() {
            // $childElem = $elem.querySelector('');
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

