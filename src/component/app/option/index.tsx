import React, { ReactElement } from 'react';
import { debounce } from '../../../asset/ts/vendor/debounce';
import { modals } from '../../../constant/modals';
import { urls } from '../../../constant/urls';
import { jsExecStage } from '../../../constant/js-exec-stage';
import { validationHandle } from '../../../service/validation-handle';
import { MemoComponent } from '../../extendable/memo-component';
import { IconBtn } from '../../base/btn-icon';
import { Checkbox } from '../../base/checkbox';
import { TextInput } from '../../base/input-text';
import { SearchInput } from '../../base/input-search';
import { SliderSwitch } from '../../base/checkbox-slider-switch';
import { Dropdown } from '../../base/select-dropdown';
import { FileInput } from '../../base/input-file';
import { Modal } from '../../widget/modal';
import { OptionEditView } from '../../view/option-edit';
import { OptionListView } from '../../view/option-list';
import { inclStaticIcon } from '../../static/icon';
import { IProps } from './type';

export class OptionApp extends MemoComponent<IProps> {
    readonly $docIcon: ReactElement = inclStaticIcon('doc', 'white');
    readonly onSearchPerform: (...args: any[]) => any;

    constructor(props: IProps) {
        super(props);
        this.onSearchPerform = debounce(props.storeHandler.onSearchPerform, 250);
        this.onSearch = this.onSearch.bind(this);
    }

    onSearch(e, val: string, gte3Char: boolean): void {
        const { onSearchTextChange } = this.props.storeHandler;
        onSearchTextChange(val);
        if (!gte3Char) return;
        this.onSearchPerform(val);
    }

    render() {
        const {
            props, cssCls, onSearch,
            $docIcon, $ruleIdEdit, $libEdit,
            localState, setting, rules,
            storeHandler
        } = this;

        const {
            currModalId, allowModalConfirm,
            searchedText,
            modalEditTarget, editViewTarget,
            pgnOption
        } = localState;

        const {
            showDeleteModal,
            resultsPerPageIdx,
            defRuleConfig
        } = setting;

        const {
            onListView,
            onSearchTextClear,
            onModalCancel, onSettingModal, onImportConfigModal, onExportConfigModal, onAddHostModal,
            onAddHostConfirm, onDelModalConfirm,
            onAddPathConfirm,
            onEditItemValChange,
            onResetAll, onDelConfirmToggle, onResultsPerPageChange, onDefHostRuleToggle, onDefJsExecStageChange,
            onImportFileChange, onImportModalConfirm,
            onExportFileNameChange, onExportModalConfirm,
        } = storeHandler;

        const isListView: boolean = !editViewTarget;
        const EDIT_CTRL_CLS = cssCls('header__ctrl', 'edit');
        const MAIN_CLS = cssCls('main', isListView ? 'list' : 'edit');

        return (
            <div className="app app--option">
                <header className="header">{ editViewTarget &&
                    <div className={EDIT_CTRL_CLS}>
                        <IconBtn
                            icon="arrow-lt"
                            theme="white"
                            onClick={onListView}
                            />
                        <IconBtn icon="save" theme="white" />
                        <IconBtn icon="delete" theme="white" />{ ('paths' in editViewTarget) &&
                        <IconBtn icon="add" theme="white" />}
                    </div>}
                    <div className="header__ctrl">{ isListView &&
                        <SearchInput
                            id="search"
                            value={searchedText}
                            disabled={rules.length <= 1}
                            onInputChange={onSearch}
                            onInputClear={onSearchTextClear}
                            />}
                        <IconBtn
                            icon="setting"
                            theme="white"
                            onClick={onSettingModal}
                            />
                        <a
                            target="_blank"
                            href={urls.DOC}
                            rel="noopener noreferrer"
                            className="icon-btn"
                            >
                            {$docIcon}
                        </a>
                        <IconBtn
                            icon="download"
                            theme="white"
                            onClick={onImportConfigModal}
                            />
                        <IconBtn
                            icon="download"
                            theme="white"
                            clsSuffix="upload"
                            disabled={!rules.length}
                            onClick={onExportConfigModal}
                            />
                    </div>
                </header>
                <main className={MAIN_CLS}>
                    { isListView ? <OptionListView {...props} /> : <OptionEditView {...props} />  }
                </main>
                { currModalId && <form className="modals">
                    <Modal
                        currModalId={currModalId}
                        id={modals.defSetting.id}
                        header={modals.defSetting.txt}
                        clsSuffix="setting"
                        onCancel={onModalCancel}
                        onConfirm={onModalCancel}
                        >
                        <ul>
                            <li>
                                <button
                                    type="button"
                                    className="btn btn--reset"
                                    onClick={onResetAll}
                                    >RESET ALL</button>
                            </li><li>
                                <h4>Read/Search</h4>
                            </li><li>
                                <SliderSwitch
                                    id="show-dialog"
                                    label="Show delete confirmation dialog"
                                    checked={showDeleteModal}
                                    ltLabel
                                    onChange={onDelConfirmToggle}
                                    />
                            </li><li>
                                <Dropdown
                                    id="result-per-page"
                                    label="Results per page"
                                    ltLabel
                                    list={pgnOption.increment}
                                    selectIdx={resultsPerPageIdx}
                                    border
                                    onSelect={(evt, idx) => onResultsPerPageChange(idx) }
                                    />
                            </li><li>
                                <h4>New Item</h4>
                            </li><li>
                                <SliderSwitch
                                    id="match-https"
                                    label="HTTPS"
                                    ltLabel
                                    checked={defRuleConfig.isHttps}
                                    onChange={() => onDefHostRuleToggle('isHttps')}
                                    />
                            </li><li>
                                <SliderSwitch
                                    id="run-js"
                                    label="Run Custom Js"
                                    ltLabel
                                    checked={defRuleConfig.isJsOn}
                                    onChange={() => onDefHostRuleToggle('isJsOn')}
                                    />
                            </li><li>
                                <SliderSwitch
                                    id="run-css"
                                    label="Run Custom CSS"
                                    ltLabel
                                    checked={defRuleConfig.isCssOn}
                                    onChange={() => onDefHostRuleToggle('isCssOn')}
                                    />
                            </li><li>
                                <SliderSwitch
                                    id="run-library"
                                    label="Run Libraries"
                                    ltLabel
                                    checked={defRuleConfig.isLibOn}
                                    onChange={() => onDefHostRuleToggle('isLibOn')}
                                    />
                            </li><li>
                                <p>Javascript Execution</p>
                                <Dropdown
                                    id="js-exec-order"
                                    list={jsExecStage}
                                    border
                                    selectIdx={defRuleConfig.jsExecPhase}
                                    onSelect={onDefJsExecStageChange}
                                    />
                            </li>
                        </ul>
                    </Modal>
                    <Modal
                        currModalId={currModalId}
                        id={modals.importConfig.id}
                        header={modals.importConfig.txt}
                        clsSuffix="setting-import"
                        cancel="CANCEL"
                        confirm="IMPORT"
                        confirmDisabled={!allowModalConfirm}
                        onCancel={onModalCancel}
                        onConfirm={onImportModalConfirm}
                        >
                        <FileInput
                            id="json-import-input"
                            fileType="application/json"
                            required
                            validate={[
                                validationHandle.nonEmptyFile,
                                validationHandle.maxFileSize
                            ]}
                            onFileChange={onImportFileChange}
                            />
                    </Modal>
                    <Modal
                        currModalId={currModalId}
                        id={modals.exportConfig.id}
                        header={modals.exportConfig.txt}
                        clsSuffix="setting-export"
                        cancel="CANCEL"
                        confirm="EXPORT"
                        confirmDisabled={!allowModalConfirm}
                        onCancel={onModalCancel}
                        onConfirm={onExportModalConfirm}
                        >
                        <TextInput
                            id=""
                            label="Filename"
                            required
                            autoFocus
                            validate={[ validationHandle.fileName ]}
                            onInputChange={onExportFileNameChange}
                            />
                    </Modal>
                    <Modal
                        currModalId={currModalId}
                        id={modals.removeConfirm.id}
                        header={modals.removeConfirm.txt}
                        clsSuffix="delete-confirm"
                        subHeader="Are you sure you want to remove?"
                        cancel="CANCEL"
                        confirm="remove"
                        onCancel={onModalCancel}
                        onConfirm={onDelModalConfirm}
                        >
                        <Checkbox
                            id="setting-delete-confirm"
                            label="Don’t show this confirmation again"
                            onChange={onDelConfirmToggle}
                            />
                    </Modal>
                    <Modal
                        currModalId={currModalId}
                        id={modals.editHost.id}
                        header={modals.editHost.txt}
                        clsSuffix="host-add"
                        cancel="CANCEL"
                        confirm="SAVE"
                        confirmDisabled={!allowModalConfirm}
                        onCancel={onModalCancel}
                        onConfirm={onAddHostConfirm}
                        >
                        { $ruleIdEdit }
                        <TextInput
                            id="host-value"
                            label="Host Value"
                            required
                            value={modalEditTarget?.value}
                            validate={[ validationHandle.urlHost ]}
                            onInputChange={onEditItemValChange}
                            />
                    </Modal>
                    <Modal
                        currModalId={currModalId}
                        id={modals.editPath.id}
                        header={modals.editPath.txt}
                        clsSuffix="path-add"
                        cancel="CANCEL"
                        confirm="SAVE"
                        confirmDisabled={!allowModalConfirm}
                        onCancel={onModalCancel}
                        onConfirm={onAddPathConfirm}
                        >
                        { $ruleIdEdit }
                        <TextInput
                            id="path-url"
                            label="Path Value"
                            required
                            value={modalEditTarget?.value}
                            validate={[ validationHandle.urlPath ]}
                            onInputChange={onEditItemValChange}
                            />
                    </Modal>
                    <Modal
                        currModalId={currModalId}
                        id={modals.addLib.id}
                        header={modals.addLib.txt}
                        clsSuffix="lib-add"
                        cancel="CANCEL"
                        confirm="SAVE"
                        confirmDisabled={!allowModalConfirm}
                        onCancel={onModalCancel}
                        onConfirm={onModalCancel}
                        >
                        { $libEdit }
                    </Modal>
                    <Modal
                        currModalId={currModalId}
                        id={modals.editLib.id}
                        header={modals.editLib.txt}
                        clsSuffix="lib-edit"
                        cancel="CANCEL"
                        confirm="SAVE"
                        confirmDisabled={!allowModalConfirm}
                        onCancel={onModalCancel}
                        onConfirm={onModalCancel}
                        >
                        { $libEdit }
                    </Modal>
                </form> }
            </div>
        );
    }

    get localState() {
        return this.props.store.localState;
    }

    get rules() {
        return this.props.store.rules;
    }

    get setting() {
        return this.props.store.setting;
    }

    get storeHandler() {
        return this.props.storeHandler;
    }

    get $ruleIdEdit() {
        const { modalEditTarget } = this.localState;
        const { onEditItemIdChange } = this.storeHandler;

        return (
            <TextInput
                id="rule-id"
                label="ID"
                required
                autoFocus
                value={modalEditTarget?.id}
                validate={[ validationHandle.gte3Char ]}
                onInputChange={onEditItemIdChange}
                />
        );
    }

    get $libEdit() {
        return (
            <>
                <TextInput
                    id="path-id"
                    label="ID"
                    required
                    autoFocus
                    validate={[]}
                    onInputChange={({ validState }) => {
                        // TODO: based on the `validState`, set the Modal Confirm Btn `confirmDisabled` prop, e.g. if it needs to disabled
                    }}
                    />
                <TextInput
                    id="path-url"
                    label="Url"
                    required
                    validate={[]}
                    onInputChange={({ validState }) => {
                        // TODO: based on the `validState`, set the Modal Confirm Btn `confirmDisabled` prop, e.g. if it needs to disabled
                    }}
                    />
            </>
        );
    }
}