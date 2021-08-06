import React from 'react';
import { dataHandle } from '../../../data/handler';
import { modals } from '../../../constant/modals';
import { urls } from '../../../constant/urls';
import { resultsPerPage } from '../../../constant/result-per-page';
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
import { OptionListView } from '../../view/option-list';
import { OptionEditView } from '../../view/option-edit';
import { inclStaticIcon } from '../../static/icon';

import { AHostPathRule } from '../../../data/handler/type';
import { IProps } from './type';

const $docIcon = inclStaticIcon('doc', 'white');

export class OptionApp extends MemoComponent<IProps> {
    constructor(props: IProps) {
        super(props);
        this.onSettingModal = this.onSettingModal.bind(this);
        this.onExportConfigModal = this.onExportConfigModal.bind(this);
        this.onImportConfigModal = this.onImportConfigModal.bind(this);
    }

    render() {
        const { props } = this;
        const { isListView } = this.appState.localState;
        const { currentId } = this.modalState;
        const MAIN_CLS = this.cssCls('main', isListView ? 'list' : 'edit');

        return (
            <div className="app app--option">
                {this.$header}
                <main className={MAIN_CLS}>{isListView
                    ? <OptionListView {...props} />
                    : <OptionEditView {...props} />}
                </main>{currentId && (
                <form className="modals">
                    {this.$settingModal}
                    {this.$importDataModal}
                    {this.$exportDataModal}
                    {this.$addHostModal}
                    {this.$addPathModal}
                    {/* TODO: editHostOrPathModal */}
                    {this.$addLibModal}
                    {this.$editLibModal}
                    {this.$delHostsModal}
                    {this.$delHostOrPathModal}
                    {this.$delLibModal}
                    {this.$delLibsModal}
                </form>)}
            </div>
        );
    }

    onSettingModal() {
        this.appStateHandler.onModal({
            id: modals.defSetting.id
        });
    }

    onExportConfigModal() {
        this.appStateHandler.onModal({
            id: modals.exportConfig.id
        });
    }

    onImportConfigModal() {
        this.appStateHandler.onModal({
            id: modals.importConfig.id
        })
    }

    get $header() {
        const { rules, localState } = this.appState;
        const { isListView, listView, editView } = localState;
        const {
            onListView,
            onDelHostOrPathModal,
            onAddPathModal,

            onSearchTextChange,
            onSearchTextClear,
        } = this.appStateHandler;

        //// ListView
        const { searchText } = listView;
        const EDIT_CTRL_CLS = this.cssCls('header__ctrl', 'edit');

        //// Edit View
        const { ruleIdCtx } = isListView ? listView : editView;
        const item = dataHandle.getRuleFromIdCtx(rules, ruleIdCtx);
        const isHost = (item as AHostPathRule)?.isHost;

        return (
            <header className="header">{!isListView && (
                <div className={EDIT_CTRL_CLS}>
                    <IconBtn
                        icon="arrow-lt"
                        theme="white"
                        onClick={onListView}
                        />
                    <IconBtn
                        icon="delete"
                        theme="white"
                        onClick={() => onDelHostOrPathModal(ruleIdCtx)}
                        />{isHost &&
                    <IconBtn
                        icon="add"
                        theme="white"
                        onClick={onAddPathModal}
                    />}
                </div>)}
                <div className="header__ctrl">{isListView &&
                    <SearchInput
                        id="search"
                        value={searchText}
                        disabled={rules.length <= 1}
                        onInputChange={onSearchTextChange}
                        onInputClear={onSearchTextClear}
                        />}
                    <IconBtn
                        icon="setting"
                        theme="white"
                        onClick={this.onSettingModal}
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
                        onClick={this.onExportConfigModal}
                        />
                    <IconBtn
                        icon="download"
                        theme="white"
                        clsSuffix="upload"
                        disabled={!rules.length}
                        onClick={this.onImportConfigModal}
                        />
                </div>
            </header>
        );
    }

    get $settingModal() {
        const { id, txt } = modals.defSetting;
        const { showDeleteModal, resultsPerPageIdx, defRuleConfig } = this.settingState;
        const { currentId } = this.modalState;

        const {
            onModalCancel,
            onResetAll,
            onDelConfirmDialogToggle,
            onResultsPerPageChange,
            onDefHttpsToggle,
            onDefJsToggle,
            onDefCssToggle,
            onDefLibToggle,
            onDefJsExecStageChange,
        } = this.appStateHandler;

        return (
            <Modal
                activeModalId={currentId}
                id={id}
                header={txt}
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
                            id="setting-show-delete-dialog"
                            label="Show delete confirmation dialog"
                            checked={showDeleteModal}
                            ltLabel
                            onChange={onDelConfirmDialogToggle}
                            />
                    </li>
                    <li>
                        <Dropdown
                            id="setting-result-per-page"
                            label="Results per page"
                            ltLabel
                            list={resultsPerPage}
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
                            id="setting-toggle-https"
                            label="HTTPS"
                            ltLabel
                            checked={defRuleConfig.isHttps}
                            onChange={onDefHttpsToggle}
                            />
                    </li>
                    <li>
                        <SliderSwitch
                            id="setting-toggle-js"
                            label="Run Custom Js"
                            ltLabel
                            checked={defRuleConfig.isJsOn}
                            onChange={onDefJsToggle}
                            />
                    </li>
                    <li>
                        <SliderSwitch
                            id="setting-toggle-css"
                            label="Run Custom CSS"
                            ltLabel
                            checked={defRuleConfig.isCssOn}
                            onChange={onDefCssToggle}
                            />
                    </li>
                    <li>
                        <SliderSwitch
                            id="setting-toggle-library"
                            label="Run Libraries"
                            ltLabel
                            checked={defRuleConfig.isLibOn}
                            onChange={onDefLibToggle}
                            />
                    </li>
                    <li>
                        <p>Javascript Execution</p>
                        <Dropdown
                            id="setting-js-exec-order"
                            list={jsExecStage}
                            border
                            selectIdx={defRuleConfig.jsExecPhase}
                            onSelect={onDefJsExecStageChange}
                            />
                    </li>
                </ul>
            </Modal>
        );
    }

    get $importDataModal() {
        const { id, txt } = modals.importConfig;
        const { currentId, isConfirmBtnEnabled } = this.modalState;
        const {
            onModalCancel,
            onImportSettingModalOk,
            onImportFileInputChange,
        } = this.appStateHandler;

        return (
            <Modal
                activeModalId={currentId}
                id={id}
                header={txt}
                clsSuffix="setting-import"
                cancel="CANCEL"
                confirm="IMPORT"
                confirmDisabled={!isConfirmBtnEnabled}
                onCancel={onModalCancel}
                onConfirm={onImportSettingModalOk}
                >
                <FileInput
                    id="json-import"
                    fileType="application/json"
                    required
                    validate={validationRule.importConfig}
                    onFileChange={onImportFileInputChange}
                    />
            </Modal>
        );
    }

    get $exportDataModal() {
        const { id, txt } = modals.exportConfig;
        const { currentId, isConfirmBtnEnabled, exportFileInput } = this.modalState;
        const {
            onModalCancel,
            onExportSettingModalOk,
            onExportInputChange,
        } = this.appStateHandler;

        return (
            <Modal
                activeModalId={currentId}
                id={id}
                header={txt}
                clsSuffix="setting-export"
                cancel="CANCEL"
                confirm="EXPORT"
                confirmDisabled={!isConfirmBtnEnabled}
                onCancel={onModalCancel}
                onConfirm={onExportSettingModalOk}
                >
                <TextInput
                    id="json-export"
                    label="Filename"
                    required
                    autoFocus
                    value={exportFileInput.value}
                    validation={{
                        rules: validationRule.exportConfig,
                        isValid: exportFileInput.isValid,
                        errMsg: exportFileInput.errMsg
                    }}
                    onInputChange={onExportInputChange}
                    />
            </Modal>
        );
    }

    get $addHostModal() {
        const { id, txt } = modals.addHost;
        const { currentId, isConfirmBtnEnabled, titleInput, valueInput } = this.modalState;
        const {
            onModalCancel,
            onAddHostModalOk,
            onModalTitleInput,
            onModalValueInput,
        } = this.appStateHandler;

        return (
            <Modal
                activeModalId={currentId}
                id={id}
                header={txt}
                clsSuffix="host-add"
                cancel="CANCEL"
                confirm="SAVE"
                confirmDisabled={!isConfirmBtnEnabled}
                onCancel={onModalCancel}
                onConfirm={onAddHostModalOk}
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
                    onInputChange={onModalTitleInput}
                    onInputBlur={onModalTitleInput}
                    />
                <TextInput
                    id="host-value"
                    label="Url"
                    required
                    value={valueInput?.value}
                    validation={{
                        rules: validationRule.ruleUrlHost,
                        isValid: valueInput.isValid,
                        errMsg: valueInput.errMsg
                    }}
                    onInputChange={onModalValueInput}
                    onInputBlur={onModalValueInput}
                    />
            </Modal>
        );
    }

    get $addPathModal() {
        const { id, txt } = modals.addPath;
        const { currentId, isConfirmBtnEnabled, titleInput, valueInput } = this.modalState;
        const {
            onModalCancel,
            onAddPathModalOk,
            onModalTitleInput,
            onModalValueInput,
        } = this.appStateHandler;

        return (
            <Modal
                activeModalId={currentId}
                id={id}
                header={txt}
                clsSuffix="path-add"
                cancel="CANCEL"
                confirm="SAVE"
                confirmDisabled={!isConfirmBtnEnabled}
                onCancel={onModalCancel}
                onConfirm={onAddPathModalOk}
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
                    onInputChange={onModalTitleInput}
                    onInputBlur={onModalTitleInput}
                    />
                <TextInput
                    id="path-url"
                    label="Url Path"
                    required
                    value={valueInput?.value}
                    validation={{
                        rules: validationRule.ruleUrlPath,
                        isValid: valueInput.isValid,
                        errMsg: valueInput.errMsg
                    }}
                    onInputChange={onModalValueInput}
                    onInputBlur={onModalValueInput}
                    />
            </Modal>
        );
    }

    get $addLibModal() {
        const { id, txt } = modals.addLib;
        const { currentId, isConfirmBtnEnabled, titleInput, valueInput} = this.modalState;
        const {
            onModalCancel,
            onAddLibModalOk,
            onModalTitleInput,
            onModalValueInput,
        } = this.appStateHandler;

        return (
            <Modal
                activeModalId={currentId}
                id={id}
                header={txt}
                clsSuffix="lib-add"
                cancel="CANCEL"
                confirm="SAVE"
                confirmDisabled={!isConfirmBtnEnabled}
                onCancel={onModalCancel}
                onConfirm={onAddLibModalOk}
                >
                <TextInput
                    id="lib-add-title"
                    label="Title"
                    required
                    value={titleInput?.value}
                    validation={{
                        rules: validationRule.ruleId,
                        isValid: titleInput.isValid,
                        errMsg: titleInput.errMsg
                    }}
                    onInputChange={onModalTitleInput}
                    onInputBlur={onModalTitleInput}
                    />
                <TextInput
                    id="lib-add-value"
                    label="Url"
                    required
                    value={valueInput?.value}
                    validation={{
                        rules: validationRule.libUrl,
                        isValid: valueInput.isValid,
                        errMsg: valueInput.errMsg
                    }}
                    onInputChange={onModalValueInput}
                    onInputBlur={onModalValueInput}
                    />
            </Modal>
        );
    }

    get $editLibModal() {
        const { id, txt } = modals.editLib;
        const { currentId, isConfirmBtnEnabled, titleInput, valueInput} = this.modalState;
        const {
            onModalCancel,
            onModalTitleInput,
            onModalValueInput,
            onEditLibModalOk,
        } = this.appStateHandler;
        return (
            <Modal
                activeModalId={currentId}
                id={id}
                header={txt}
                clsSuffix="lib-edit"
                cancel="CANCEL"
                confirm="SAVE"
                confirmDisabled={!isConfirmBtnEnabled}
                onCancel={onModalCancel}
                onConfirm={onEditLibModalOk}
                >
                <TextInput
                    id="lib-edit-title"
                    label="Title"
                    required
                    value={titleInput?.value}
                    validation={{
                        rules: validationRule.ruleId,
                        isValid: titleInput.isValid,
                        errMsg: titleInput.errMsg
                    }}
                    onInputChange={onModalTitleInput}
                    onInputBlur={onModalTitleInput}
                    />
                <TextInput
                    id="lib-edit-value"
                    label="Url"
                    required
                    value={valueInput?.value}
                    validation={{
                        rules: validationRule.libUrl,
                        isValid: valueInput.isValid,
                        errMsg: valueInput.errMsg
                    }}
                    onInputChange={onModalValueInput}
                    onInputBlur={onModalValueInput}
                    />
            </Modal>
        );
    }

    get $delHostOrPathModal() {
        const { id, txt } = modals.delHostOrPath;
        const { currentId } = this.modalState;
        const { onModalCancel, onDelHostOrPathModalOk } = this.appStateHandler;

        return (
            <Modal
                activeModalId={currentId}
                id={id}
                header={txt}
                clsSuffix="delete-confirm"
                subHeader="Are you sure you want to remove?"
                cancel="CANCEL"
                confirm="remove"
                onCancel={onModalCancel}
                onConfirm={onDelHostOrPathModalOk}
                >
                {this.$showDelDialogCheckbox}
            </Modal>
        );
    }

    get $delHostsModal() {
        const { id, txt } = modals.delHosts;
        const { currentId } = this.modalState;
        const {
            onModalCancel,
            onDelHostsModalOk,
        } = this.appStateHandler;

        return (
            <Modal
                activeModalId={currentId}
                id={id}
                header={txt}
                clsSuffix="delete-confirm"
                subHeader="Are you sure you want to remove?"
                cancel="CANCEL"
                confirm="remove"
                onCancel={onModalCancel}
                onConfirm={onDelHostsModalOk}
                >
                {this.$showDelDialogCheckbox}
            </Modal>
        );
    }

    get $delLibModal() {
        const { id, txt } = modals.delLib;
        const { currentId } = this.modalState;
        const { onModalCancel, onDelLibModalOk } = this.appStateHandler;
        return (
            <Modal
                activeModalId={currentId}
                id={id}
                header={txt}
                clsSuffix="delete-lib-confirm"
                subHeader="Are you sure you want to remove?"
                cancel="CANCEL"
                confirm="remove"
                onCancel={onModalCancel}
                onConfirm={onDelLibModalOk}
                >
                {this.$showDelDialogCheckbox}
            </Modal>
        );
    }

    get $delLibsModal() {
        const { id, txt } = modals.delLibs;
        const { currentId } = this.modalState;
        const { onModalCancel, onDelLibsModalOk } = this.appStateHandler;
        return (
            <Modal
                activeModalId={currentId}
                id={id}
                header={txt}
                clsSuffix="delete-lib-confirm"
                subHeader="Are you sure you want to remove?"
                cancel="CANCEL"
                confirm="remove"
                onCancel={onModalCancel}
                onConfirm={onDelLibsModalOk}
                >
                {this.$showDelDialogCheckbox}
            </Modal>
        );
    }

    get $showDelDialogCheckbox() {
        const { onDelConfirmDialogToggle } = this.appStateHandler;
        return (
            <Checkbox
                id="setting-delete-confirm"
                label="Don’t show this confirmation again"
                onChange={onDelConfirmDialogToggle}
                />
        );
    }

    get appStateHandler() {
        return this.props.appStateHandler;
    }

    get appState() {
        return this.props.appState;
    }

    get settingState() {
        return this.props.appState.setting;
    }

    get modalState() {
        return this.props.appState.localState.modal;
    }
}