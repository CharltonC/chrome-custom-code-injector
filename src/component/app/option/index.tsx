import React, { ReactElement } from 'react';
import { debounce } from '../../../asset/ts/vendor/debounce';
import { modals } from '../../../constant/modals';
import { urls } from '../../../constant/urls';
import { jsExecStage } from '../../../constant/js-exec-stage';
import { validationRule } from '../../../constant/validation-rule';
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
        this.onSearchPerform = debounce(props.appStateHandler.onSearchPerform, 250);
        this.onSearch = this.onSearch.bind(this);
    }

    onSearch(e, val: string, gte3Char: boolean): void {
        const { onSearchTextChange } = this.props.appStateHandler;
        onSearchTextChange(val);
        if (!gte3Char) return;
        this.onSearchPerform(val);
    }

    render() {
        const {
            props, cssCls, onSearch,
            $docIcon,
            localState, setting, rules,
            appStateHandler
        } = this;

        const {
            isListView,
            activeModalId, isModalConfirmBtnEnabled,
            searchedText,
            activeRule,
            pgnOption,
            exportFilenameInput,
            titleInput, hostOrPathInput,
        } = localState;

        const {
            showDeleteModal,
            resultsPerPageIdx,
            defRuleConfig
        } = setting;

        const {
            onListView,
            onSearchTextClear,
            onModalCancel, onSettingModal, onImportConfigFileModal, onExportConfigFileModal,
            onAddRuleModalInputChange,
            onAddHostModalRuleConfirm, onAddPathRuleModalConfirm,
            onDelModalConfirm,
            onResetAll, onDelConfirmDialogToggle, onResultsPerPageChange, onDefHostRuleToggle, onDefJsExecStageChange,
            onImportConfigFileModalInputChange, onImportConfigFileModalConfirm,
            onExportConfigFileModalInputChange, onExportConfigFileModalConfirm,
        } = appStateHandler;

        const { isHost } = activeRule;
        const EDIT_CTRL_CLS = cssCls('header__ctrl', 'edit');
        const MAIN_CLS = cssCls('main', isListView ? 'list' : 'edit');
        const $view = isListView
            ? <OptionListView {...props} />
            : <OptionEditView {...props} />;

        return (
            <div className="app app--option">
                <header className="header">{!isListView && (
                    <div className={EDIT_CTRL_CLS}>
                        <IconBtn icon="arrow-lt" theme="white" onClick={onListView} />
                        <IconBtn icon="delete" theme="white" />{isHost &&
                        <IconBtn icon="add" theme="white" />}
                    </div>)}
                    <div className="header__ctrl">{isListView &&
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
                            className="icon-btn icon-btn--link"
                            >
                            {$docIcon}
                        </a>
                        <IconBtn
                            icon="download"
                            theme="white"
                            onClick={onImportConfigFileModal}
                            />
                        <IconBtn
                            icon="download"
                            theme="white"
                            clsSuffix="upload"
                            disabled={!rules.length}
                            onClick={onExportConfigFileModal}
                            />
                    </div>
                </header>
                <main className={MAIN_CLS}>
                    {$view}
                </main>{activeModalId && (
                <form className="modals">
                    <Modal
                        activeModalId={activeModalId}
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
                                    >
                                    RESET ALL
                                </button>
                            </li>
                            <li>
                                <h4>Read/Search</h4>
                            </li>
                            <li>
                                <SliderSwitch
                                    id="show-dialog"
                                    label="Show delete confirmation dialog"
                                    checked={showDeleteModal}
                                    ltLabel
                                    onChange={onDelConfirmDialogToggle}
                                    />
                            </li>
                            <li>
                                <Dropdown
                                    id="result-per-page"
                                    label="Results per page"
                                    ltLabel
                                    list={pgnOption.increment}
                                    selectIdx={resultsPerPageIdx}
                                    border
                                    onSelect={onResultsPerPageChange}
                                    />
                            </li>
                            <li>
                                <h4>New Item</h4>
                            </li>
                            <li>
                                <SliderSwitch
                                    id="match-https"
                                    label="HTTPS"
                                    ltLabel
                                    checked={defRuleConfig.isHttps}
                                    onChange={() => onDefHostRuleToggle({ key: "isHttps" })}
                                    />
                            </li>
                            <li>
                                <SliderSwitch
                                    id="run-js"
                                    label="Run Custom Js"
                                    ltLabel
                                    checked={defRuleConfig.isJsOn}
                                    onChange={() => onDefHostRuleToggle({ key: "isJsOn" })}
                                    />
                            </li>
                            <li>
                                <SliderSwitch
                                    id="run-css"
                                    label="Run Custom CSS"
                                    ltLabel
                                    checked={defRuleConfig.isCssOn}
                                    onChange={() => onDefHostRuleToggle({ key: "isCssOn" })}
                                    />
                            </li>
                            <li>
                                <SliderSwitch
                                    id="run-library"
                                    label="Run Libraries"
                                    ltLabel
                                    checked={defRuleConfig.isLibOn}
                                    onChange={() => onDefHostRuleToggle({ key: "isLibOn" })}
                                    />
                            </li>
                            <li>
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
                        activeModalId={activeModalId}
                        id={modals.importConfig.id}
                        header={modals.importConfig.txt}
                        clsSuffix="setting-import"
                        cancel="CANCEL"
                        confirm="IMPORT"
                        confirmDisabled={!isModalConfirmBtnEnabled}
                        onCancel={onModalCancel}
                        onConfirm={onImportConfigFileModalConfirm}
                        >
                        <FileInput
                            id="json-import-input"
                            fileType="application/json"
                            required
                            validate={validationRule.importConfig}
                            onFileChange={onImportConfigFileModalInputChange}
                            />
                    </Modal>
                    <Modal
                        activeModalId={activeModalId}
                        id={modals.exportConfig.id}
                        header={modals.exportConfig.txt}
                        clsSuffix="setting-export"
                        cancel="CANCEL"
                        confirm="EXPORT"
                        confirmDisabled={!isModalConfirmBtnEnabled}
                        onCancel={onModalCancel}
                        onConfirm={onExportConfigFileModalConfirm}
                        >
                        <TextInput
                            id=""
                            label="Filename"
                            required
                            autoFocus
                            value={exportFilenameInput.value}
                            validation={{
                                rules: validationRule.exportConfig,
                                isValid: exportFilenameInput.isValid,
                                errMsg: exportFilenameInput.errMsg
                            }}
                            onInputChange={onExportConfigFileModalInputChange}
                            />
                    </Modal>
                    <Modal
                        activeModalId={activeModalId}
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
                            onChange={onDelConfirmDialogToggle}
                            />
                    </Modal>
                    <Modal
                        activeModalId={activeModalId}
                        id={modals.editHost.id}
                        header={modals.editHost.txt}
                        clsSuffix="host-add"
                        cancel="CANCEL"
                        confirm="SAVE"
                        confirmDisabled={!isModalConfirmBtnEnabled}
                        onCancel={onModalCancel}
                        onConfirm={onAddHostModalRuleConfirm}
                        >
                        <TextInput
                            id="host-title"
                            label="Title"
                            required
                            value={titleInput?.value}
                            validation={{
                                rules: validationRule.ruleId,
                                isValid: titleInput.isValid,
                                errMsg: titleInput.errMsg
                            }}
                            onInputChange={args => onAddRuleModalInputChange({
                                ...args,
                                inputKey: 'titleInput'
                            })}
                            />
                        <TextInput
                            id="host-value"
                            label="Url"
                            required
                            value={hostOrPathInput?.value}
                            validation={{
                                rules: validationRule.ruleUrlHost,
                                isValid: hostOrPathInput.isValid,
                                errMsg: hostOrPathInput.errMsg
                            }}
                            onInputChange={args => onAddRuleModalInputChange({
                                ...args,
                                inputKey: 'hostOrPathInput'
                            })}
                            />
                    </Modal>
                    <Modal
                        activeModalId={activeModalId}
                        id={modals.editPath.id}
                        header={modals.editPath.txt}
                        clsSuffix="path-add"
                        cancel="CANCEL"
                        confirm="SAVE"
                        confirmDisabled={!isModalConfirmBtnEnabled}
                        onCancel={onModalCancel}
                        onConfirm={onAddPathRuleModalConfirm}
                        >
                        <TextInput
                            id="path-title"
                            label="Title"
                            required
                            value={titleInput?.value}
                            validation={{
                                rules: validationRule.ruleId,
                                isValid: titleInput.isValid,
                                errMsg: titleInput.errMsg
                            }}
                            onInputChange={(args) => onAddRuleModalInputChange({
                                ...args,
                                inputKey: 'titleInput'
                            })}
                            />
                        <TextInput
                            id="path-url"
                            label="Url Path"
                            required
                            value={hostOrPathInput?.value}
                            validation={{
                                rules: validationRule.ruleUrlPath,
                                isValid: hostOrPathInput.isValid,
                                errMsg: hostOrPathInput.errMsg
                            }}
                            onInputChange={(args) => onAddRuleModalInputChange({
                                ...args,
                                inputKey: 'hostOrPathInput'
                            })}
                            />
                    </Modal>
                    <Modal
                        activeModalId={activeModalId}
                        id={modals.addLib.id}
                        header={modals.addLib.txt}
                        clsSuffix="lib-add"
                        cancel="CANCEL"
                        confirm="SAVE"
                        confirmDisabled={!isModalConfirmBtnEnabled}
                        onCancel={onModalCancel}
                        onConfirm={onModalCancel}
                        >
                        {/* TODO */}
                    </Modal>
                    <Modal
                        activeModalId={activeModalId}
                        id={modals.editLib.id}
                        header={modals.editLib.txt}
                        clsSuffix="lib-edit"
                        cancel="CANCEL"
                        confirm="SAVE"
                        confirmDisabled={!isModalConfirmBtnEnabled}
                        onCancel={onModalCancel}
                        onConfirm={onModalCancel}
                        >
                        {/* TODO */}
                    </Modal>
                </form>)}
            </div>
        );
    }

    get localState() {
        return this.props.appState.localState;
    }

    get rules() {
        return this.props.appState.rules;
    }

    get setting() {
        return this.props.appState.setting;
    }

    get appStateHandler() {
        return this.props.appStateHandler;
    }
}