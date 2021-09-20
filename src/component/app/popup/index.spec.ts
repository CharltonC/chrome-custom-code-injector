import { TestUtil } from '../../../asset/ts/test-util';
import { AppStateHandle } from '../../../handle/app-state';
import { StateHandle } from '../../../handle/state';
import { DataHandle } from '../../../handle/data';
import { createMockRules } from '../../../mock/data';
import { AMethodSpy } from '../../../asset/ts/test-util/type';
import { PopupApp } from '.';
import { IAppState } from './type';
import { ChromeHandle } from '../../../handle/chrome';
import { EPrefillAction } from '../../../handle/query-param/type';
import { HostRule, PathRule } from '../../../model/rule';

describe('Popup App (E2E)', () => {
    const mockFn = () => {};
    const { EDIT, ADD_HOST, ADD_PATH } = EPrefillAction;

    let mockUrl: URL;
    let mockUrlWithPath: URL;

    let mockRules: HostRule[];
    let mockMatchHost: HostRule;
    let mockMatchPath: PathRule;

    let mockAppState: IAppState;
    let dataHandleSpy: AMethodSpy<DataHandle>;
    let chromeHandleSpy: AMethodSpy<ChromeHandle>;

    let $elem: HTMLElement;
    let $docBtn: HTMLButtonElement;
    let $optionBtn: HTMLButtonElement;
    let $hostJsSwitch: HTMLInputElement;
    let $hostCssSwitch: HTMLInputElement;
    let $hostLibSwitch: HTMLInputElement;
    let $hostAddBtn: HTMLButtonElement;
    let $hostEditBtn: HTMLButtonElement;
    let $hostDelBtn: HTMLButtonElement;
    let $pathJsSwitch: HTMLInputElement;
    let $pathCssSwitch: HTMLInputElement;
    let $pathLibSwitch: HTMLInputElement;
    let $pathAddBtn: HTMLButtonElement;
    let $pathEditBtn: HTMLButtonElement;
    let $pathDelBtn: HTMLButtonElement;

    function initApp(appState: IAppState) {
        TestUtil.renderPlain($elem, StateHandle.init(PopupApp, {
            root: [ appState, new AppStateHandle() ],
        }));
    }

    function refreshElems() {
        $docBtn = $elem.querySelector<HTMLButtonElement>('.icon-btn--doc');
        $optionBtn = $elem.querySelector<HTMLButtonElement>('.icon-btn--option');

        $hostJsSwitch = $elem.querySelector<HTMLInputElement>('#host-js');
        $hostCssSwitch = $elem.querySelector<HTMLInputElement>('#host-css');
        $hostLibSwitch = $elem.querySelector<HTMLInputElement>('#host-lib');
        $hostAddBtn = $elem.querySelector<HTMLButtonElement>('.icon-btn--host-add');
        $hostEditBtn = $elem.querySelector<HTMLButtonElement>('.icon-btn--host-edit');
        $hostDelBtn = $elem.querySelector<HTMLButtonElement>('.icon-btn--host-delete');

        $pathJsSwitch = $elem.querySelector<HTMLInputElement>('#path-js');
        $pathCssSwitch = $elem.querySelector<HTMLInputElement>('#path-css');
        $pathLibSwitch = $elem.querySelector<HTMLInputElement>('#path-lib');
        $pathAddBtn = $elem.querySelector<HTMLButtonElement>('.icon-btn--path-add');
        $pathEditBtn = $elem.querySelector<HTMLButtonElement>('.icon-btn--path-edit');
        $pathDelBtn = $elem.querySelector<HTMLButtonElement>('.icon-btn--path-delete');
    }

    beforeEach(() => {
        mockRules = createMockRules();
        mockMatchHost = mockRules[0];
        mockMatchPath = mockMatchHost.paths[0];
        mockUrl = new URL(`http://${mockMatchHost.value}`);
        mockUrlWithPath = new URL(`http://${mockMatchHost.value}${mockMatchPath.value}`);

        $elem = TestUtil.setupElem();
        dataHandleSpy = TestUtil.spyProtoMethods(DataHandle);
        chromeHandleSpy = TestUtil.spyProtoMethods(ChromeHandle);
        chromeHandleSpy.openExtOption.mockImplementation(mockFn);
        chromeHandleSpy.openUserguide.mockImplementation(mockFn);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        $elem = TestUtil.teardown($elem);
    });

    describe('Disabled state of Checkboxes and Buttons, Show/Hide of Add and Edit button', () => {
        describe('when there is no match found for host/path', () => {
            beforeEach(() => {
                // Mock so that host/path are not found
                dataHandleSpy.getHostFromUrl.mockReturnValue(false);
                dataHandleSpy.getPathFromUrl.mockReturnValue(false);
            });

            it('should disable checkboxes, disable buttons except add host button, hide edit buttons when URL is valid', () => {
                mockAppState = { rules: [], url: mockUrl };
                initApp(mockAppState);
                refreshElems();

                expect($hostJsSwitch.disabled).toBeTruthy();
                expect($hostCssSwitch.disabled).toBeTruthy();
                expect($hostLibSwitch.disabled).toBeTruthy();
                expect($hostAddBtn.disabled).toBeFalsy();
                expect($hostEditBtn).toBeFalsy();
                expect($hostDelBtn.disabled).toBeTruthy();

                expect($pathJsSwitch.disabled).toBeTruthy();
                expect($pathCssSwitch.disabled).toBeTruthy();
                expect($pathLibSwitch.disabled).toBeTruthy();
                expect($pathAddBtn.disabled).toBeTruthy();
                expect($pathEditBtn).toBeFalsy();
                expect($pathDelBtn.disabled).toBeTruthy();
            });

            it('should disable add host button when URL is invalid such as chrome new tab', () => {
                const mockInvalidUrl = new URL('chrome://newtab');
                mockAppState = { rules: [], url: mockInvalidUrl };
                initApp(mockAppState);
                refreshElems();

                expect($hostAddBtn.disabled).toBeTruthy();
            });
        });

        describe('when there is match found for host/path', () => {
            beforeEach(() => {
                // Mock so that host is found
                const mockMatchHost = { id: 'host' };
                dataHandleSpy.getHostFromUrl.mockReturnValue(mockMatchHost);
            });

            it('should enable checkboxes and buttons, show edit button and hide add button for host when Path is not found', () => {
                // Mock so that path is unfound
                dataHandleSpy.getPathFromUrl.mockReturnValue(false);

                mockAppState = { rules: [], url: mockUrl };
                initApp(mockAppState);
                refreshElems();

                expect($hostJsSwitch.disabled).toBeFalsy();
                expect($hostCssSwitch.disabled).toBeFalsy();
                expect($hostLibSwitch.disabled).toBeFalsy();
                expect($hostAddBtn).toBeFalsy();
                expect($hostEditBtn.disabled).toBeFalsy();
                expect($hostDelBtn.disabled).toBeFalsy();

                expect($pathJsSwitch.disabled).toBeTruthy();
                expect($pathCssSwitch.disabled).toBeTruthy();
                expect($pathLibSwitch.disabled).toBeTruthy();
                expect($pathAddBtn.disabled).toBeTruthy();
                expect($pathEditBtn).toBeFalsy();
                expect($pathDelBtn.disabled).toBeTruthy();
            });

            it('should enable checkboxes and buttons, show edit button and hide add button for host when Path is not found + when there is a path in URL', () => {
                // Mock so that path is unfound
                dataHandleSpy.getPathFromUrl.mockReturnValue(false);

                mockAppState = { rules: [], url: mockUrlWithPath };
                initApp(mockAppState);
                refreshElems();

                expect($pathAddBtn.disabled).toBeFalsy();
            });

            it('should enable all checkboxes, enable all buttons, show edit button and hide add button for host/path when Path is found', () => {
                // Mock so that path is found
                const mockMatchPath = { id: 'path' };
                dataHandleSpy.getPathFromUrl.mockReturnValue(mockMatchPath);

                mockAppState = { rules: [], url: mockUrl };
                initApp(mockAppState);
                refreshElems();

                expect($hostJsSwitch.disabled).toBeFalsy();
                expect($hostCssSwitch.disabled).toBeFalsy();
                expect($hostLibSwitch.disabled).toBeFalsy();
                expect($hostAddBtn).toBeFalsy();
                expect($hostEditBtn.disabled).toBeFalsy();
                expect($hostDelBtn.disabled).toBeFalsy();

                expect($pathJsSwitch.disabled).toBeFalsy();
                expect($pathCssSwitch.disabled).toBeFalsy();
                expect($pathLibSwitch.disabled).toBeFalsy();
                expect($pathAddBtn).toBeFalsy();
                expect($pathEditBtn.disabled).toBeFalsy();
                expect($pathDelBtn.disabled).toBeFalsy();
            });
        });
    });

    describe('Toggling Checkboxes', () => {
        beforeEach(() => {
            mockAppState = { rules: mockRules, url: mockUrlWithPath };
            initApp(mockAppState);
            refreshElems();
        });

        it('should toggle the checkboxes', () => {
            const isHostJsChecked = $hostJsSwitch.checked;
            const isHostCssChecked = $hostCssSwitch.checked;
            const isHostLibChecked = $hostLibSwitch.checked;
            const isPathJsChecked = $pathJsSwitch.checked;
            const isPathCssChecked = $pathCssSwitch.checked;
            const isPathLibChecked = $pathLibSwitch.checked;

            TestUtil.triggerEvt($hostJsSwitch, 'click');
            TestUtil.triggerEvt($hostCssSwitch, 'click');
            TestUtil.triggerEvt($hostLibSwitch, 'click');
            TestUtil.triggerEvt($pathJsSwitch, 'click');
            TestUtil.triggerEvt($pathCssSwitch, 'click');
            TestUtil.triggerEvt($pathLibSwitch, 'click');

            expect($hostJsSwitch.checked).toBe(!isHostJsChecked);
            expect($hostCssSwitch.checked).toBe(!isHostCssChecked);
            expect($hostLibSwitch.checked).toBe(!isHostLibChecked);
            expect($pathJsSwitch.checked).toBe(!isPathJsChecked);
            expect($pathCssSwitch.checked).toBe(!isPathCssChecked);
            expect($pathLibSwitch.checked).toBe(!isPathLibChecked);
        });
    });

    describe('Open new Tab', () => {
        describe('Open Userguide and Option in new tab withou query params', () => {
            beforeEach(() => {
                dataHandleSpy.getHostFromUrl.mockReturnValue(false);
                dataHandleSpy.getPathFromUrl.mockReturnValue(false);

                mockAppState = { rules: mockRules, url: mockUrl };
                initApp(mockAppState);
                refreshElems();
            });

            it('should open Userguide', () => {
                TestUtil.triggerEvt($docBtn, 'click');
                expect(chromeHandleSpy.openUserguide).toHaveBeenCalled();
            });

            it('should open Option', () => {
                TestUtil.triggerEvt($optionBtn, 'click');
                expect(chromeHandleSpy.openExtOption).toHaveBeenCalled();
            });
        });

        describe('Open new tab in Edit mode based on query params', () => {
            beforeEach(() => {
                // Mock so that host/path is found
                dataHandleSpy.getHostFromUrl.mockReturnValue(mockMatchHost);
                dataHandleSpy.getPathFromUrl.mockReturnValue(mockMatchPath);

                mockAppState = { rules: mockRules, url: mockUrlWithPath };
                initApp(mockAppState);
                refreshElems();
            });

            it('should open in edit host mode', () => {
                TestUtil.triggerEvt($hostEditBtn, 'click');
                expect(chromeHandleSpy.openExtOption).toHaveBeenCalledWith(
                    `?action=${EDIT}&host-id=${mockMatchHost.id}`
                );
            });

            it('should open in edit path mode', () => {
                TestUtil.triggerEvt($pathEditBtn, 'click');
                expect(chromeHandleSpy.openExtOption).toHaveBeenCalledWith(
                    `?action=${EDIT}&host-id=${mockMatchHost.id}&path-id=${mockMatchPath.id}`
                );
            });
        });

        describe('Open new tab in Add mode based on query params', () => {
            it('should add host', () => {
                // Mock no host match so we can add host
                dataHandleSpy.getHostFromUrl.mockReturnValue(false);
                dataHandleSpy.getPathFromUrl.mockReturnValue(false);

                // Url with host only but no path so we can add host rule
                mockAppState = { rules: mockRules, url: mockUrl };
                initApp(mockAppState);
                refreshElems();
                TestUtil.triggerEvt($hostAddBtn, 'click');

                expect(chromeHandleSpy.openExtOption).toHaveBeenCalledWith(
                    `?action=${ADD_HOST}&host-url=${mockUrl.hostname}`
                );
            });

            it('should add path', () => {
                // Mock host match but no path match so we can add path
                dataHandleSpy.getHostFromUrl.mockReturnValue(mockMatchHost);
                dataHandleSpy.getPathFromUrl.mockReturnValue(false);

                // Url with host and path so we can add path rule
                mockAppState = { rules: mockRules, url: mockUrlWithPath };
                initApp(mockAppState);
                refreshElems();
                TestUtil.triggerEvt($pathAddBtn, 'click');

                expect(chromeHandleSpy.openExtOption).toHaveBeenCalledWith(
                    `?action=${ADD_PATH}&host-id=${mockMatchHost.id}&path=${mockUrlWithPath.pathname}`
                );
            });
        });
    });

    describe('Delete', () => {
        beforeEach(() => {
            mockAppState = { rules: mockRules, url: mockUrlWithPath };
            initApp(mockAppState);
            refreshElems();
        });

        it('should delete host rule', () => {
            TestUtil.triggerEvt($hostDelBtn, 'click');
            refreshElems();

            expect($hostJsSwitch.disabled).toBeTruthy();
            expect($hostCssSwitch.disabled).toBeTruthy();
            expect($hostLibSwitch.disabled).toBeTruthy();
            expect($hostAddBtn.disabled).toBeFalsy();
            expect($hostEditBtn).toBeFalsy();
            expect($hostDelBtn.disabled).toBeTruthy();

            expect($pathJsSwitch.disabled).toBeTruthy();
            expect($pathCssSwitch.disabled).toBeTruthy();
            expect($pathLibSwitch.disabled).toBeTruthy();
            expect($pathAddBtn.disabled).toBeTruthy();
            expect($pathEditBtn).toBeFalsy();
            expect($pathDelBtn.disabled).toBeTruthy();
        });

        it('should delete path rule', () => {
            TestUtil.triggerEvt($pathDelBtn, 'click');
            refreshElems();

            expect($hostJsSwitch.disabled).toBeFalsy();
            expect($hostCssSwitch.disabled).toBeFalsy();
            expect($hostLibSwitch.disabled).toBeFalsy();
            expect($hostAddBtn).toBeFalsy();
            expect($hostEditBtn.disabled).toBeFalsy();
            expect($hostDelBtn.disabled).toBeFalsy();

            expect($pathJsSwitch.disabled).toBeTruthy();
            expect($pathCssSwitch.disabled).toBeTruthy();
            expect($pathLibSwitch.disabled).toBeTruthy();
            expect($pathAddBtn.disabled).toBeFalsy();
            expect($pathEditBtn).toBeFalsy();
            expect($pathDelBtn.disabled).toBeTruthy();
        });
    });
});