import React, { KeyboardEvent } from 'react';
import { dataHandle } from '../../../handle/data';
import { DomHandle } from '../../../handle/dom';
import { modalSet } from '../../../constant/modal-set';
import { urlSet } from '../../../constant/url-set';
import { resultsPerPageList } from '../../../constant/result-per-page-list';
import { codeExecStageList } from '../../../constant/code-exec-stage-list';
import { validationSet } from '../../../constant/validation-set';

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

import { AHostPathRule } from '../../../handle/data/type';
import { EGlobalTarget } from '../../../handle/dom/type';
import { IProps } from './type';

const $docIcon = inclStaticIcon('doc', 'white');
const domHandle = new DomHandle();

export class OptionApp extends MemoComponent<IProps> {
    cachedOnEscKey: AFn;

    componentDidMount() {
        const onEscKey = this.onEscKey.bind(this);
        this.cachedOnEscKey = onEscKey;
        this.toggleEscKeyEvt(onEscKey);
    }

    componentWillUnmount() {
        const onEscKey = this.cachedOnEscKey;
        if (!onEscKey) return;
        this.toggleEscKeyEvt(onEscKey, false);
        this.cachedOnEscKey =  null;
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

    toggleEscKeyEvt(handler: AFn, isAdd = true): void {
        domHandle.addGlobalEvt({
            targetType: EGlobalTarget.DOC,
            evtType: 'keyup',
            handler
        }, isAdd);
    }

    onEscKey({ key }: KeyboardEvent): void {
        const isEsc = key === 'Escape';
        const { currentId } = this.appState.localState.modal;
        if (!isEsc || !currentId) return;
        this.appStateHandle.onModalCancel();
    }

    get $header() {
        const { rules, localState } = this.appState;
        const { isListView, listView, editView } = localState;
        const {
            onListView,
            onDelHostOrPathModal,
            onAddPathModal,
            onSettingModal,
            onImportDataModal,
            onExportDataModal,

            onSearchTextChange,
            onSearchTextClear,
        } = this.appStateHandle;

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
                        onClick={onSettingModal}
                        />
                    <a
                        target="_blank"
                        href={urlSet.DOC}
                        rel="noopener noreferrer"
                        className="icon-btn icon-btn--link"
                        >
                        {$docIcon}
                    </a>
                    <IconBtn
                        icon="download"
                        theme="white"
                        onClick={onImportDataModal}
                        />
                    <IconBtn
                        icon="download"
                        theme="white"
                        clsSuffix="upload"
                        disabled={!rules.length}
                        onClick={onExportDataModal}
                        />
                </div>
            </header>
        );
    }

    get $settingModal() {
        const { id, txt } = modalSet.defSetting;
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
        } = this.appStateHandle;

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
                            list={resultsPerPageList}
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
                            list={codeExecStageList}
                            border
                            selectIdx={defRuleConfig.codeExecPhase}
                            onSelect={onDefJsExecStageChange}
                            />
                    </li>
                </ul>
            </Modal>
        );
    }

    get $importDataModal() {
        const { id, txt } = modalSet.importConfig;
        const { currentId, isConfirmBtnEnabled } = this.modalState;
        const {
            onModalCancel,
            onImportDataModalOk,
            onImportFileInputChange,
        } = this.appStateHandle;

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
                onConfirm={onImportDataModalOk}
                >
                <FileInput
                    id="json-import"
                    fileType="application/json"
                    required
                    validate={validationSet.importConfig}
                    onFileChange={onImportFileInputChange}
                    />
            </Modal>
        );
    }

    get $exportDataModal() {
        const { id, txt } = modalSet.exportConfig;
        const { currentId, isConfirmBtnEnabled, exportFileInput } = this.modalState;
        const {
            onModalCancel,
            onExportDataModalOk,
            onExportInputChange,
        } = this.appStateHandle;

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
                onConfirm={onExportDataModalOk}
                >
                <TextInput
                    id="json-export"
                    label="Filename"
                    required
                    autoFocus
                    value={exportFileInput.value}
                    validation={{
                        rules: validationSet.exportConfig,
                        isValid: exportFileInput.isValid,
                        errMsg: exportFileInput.errMsg
                    }}
                    onInputChange={onExportInputChange}
                    />
            </Modal>
        );
    }

    get $addHostModal() {
        const { id, txt } = modalSet.addHost;
        const { currentId, isConfirmBtnEnabled, titleInput, valueInput } = this.modalState;
        const {
            onModalCancel,
            onAddHostModalOk,
            onModalTitleInput,
            onModalValueInput,
        } = this.appStateHandle;

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
                        rules: validationSet.ruleId,
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
                        rules: validationSet.ruleUrlHost,
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
        const { id, txt } = modalSet.addPath;
        const { currentId, isConfirmBtnEnabled, titleInput, valueInput } = this.modalState;
        const {
            onModalCancel,
            onAddPathModalOk,
            onModalTitleInput,
            onModalValueInput,
        } = this.appStateHandle;

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
                        rules: validationSet.ruleId,
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
                        rules: validationSet.ruleUrlPath,
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
        const { id, txt } = modalSet.addLib;
        const { currentId, isConfirmBtnEnabled } = this.modalState;
        const { onModalCancel, onAddLibModalOk } = this.appStateHandle;

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
                {this.$libTextInputs}
            </Modal>
        );
    }

    get $editLibModal() {
        const { id, txt } = modalSet.editLib;
        const { currentId, isConfirmBtnEnabled } = this.modalState;
        const { onModalCancel, onEditLibModalOk } = this.appStateHandle;
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
                {this.$libTextInputs}
            </Modal>
        );
    }

    get $delHostOrPathModal() {
        const { id, txt } = modalSet.delHostOrPath;
        const { currentId } = this.modalState;
        const { onModalCancel, onDelHostOrPathModalOk } = this.appStateHandle;

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
        const { id, txt } = modalSet.delHosts;
        const { currentId } = this.modalState;
        const {
            onModalCancel,
            onDelHostsModalOk,
        } = this.appStateHandle;

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
        const { id, txt } = modalSet.delLib;
        const { currentId } = this.modalState;
        const { onModalCancel, onDelLibModalOk } = this.appStateHandle;
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
        const { id, txt } = modalSet.delLibs;
        const { currentId } = this.modalState;
        const { onModalCancel, onDelLibsModalOk } = this.appStateHandle;
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
        const { onDelConfirmDialogToggle } = this.appStateHandle;
        return (
            <Checkbox
                id="setting-delete-confirm"
                label="Don’t show this confirmation again"
                onChange={onDelConfirmDialogToggle}
                />
        );
    }

    get $libTextInputs() {
        const { titleInput, valueInput} = this.modalState;
        const { onModalTitleInput, onModalValueInput } = this.appStateHandle;

        return (<>
            <TextInput
                id="lib-title"
                label="Title"
                required
                value={titleInput?.value}
                validation={{
                    rules: validationSet.ruleId,
                    isValid: titleInput.isValid,
                    errMsg: titleInput.errMsg
                }}
                onInputChange={onModalTitleInput}
                onInputBlur={onModalTitleInput}
                />
            <TextInput
                id="lib-value"
                label="Url"
                required
                value={valueInput?.value}
                validation={{
                    rules: validationSet.libUrl,
                    isValid: valueInput.isValid,
                    errMsg: valueInput.errMsg
                }}
                onInputChange={onModalValueInput}
                onInputBlur={onModalValueInput}
                />
        </>);
    }

    get appStateHandle() {
        return this.props.appStateHandle;
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