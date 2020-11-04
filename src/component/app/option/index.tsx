import React, { memo, ReactElement } from 'react';

// import { debounce } from '../../../asset/ts/vendor/debounce';
import { modals } from '../../../service/constant/modals';
import { urls } from '../../../service/constant/urls';
import { resultsPerPage } from '../../../service/constant/result-per-page';
import { validationHandle } from '../../../service/handle/validation';
import { jsExecStage } from '../../../service/constant/js-exec-stage';
import { UtilHandle } from '../../../service/handle/util';

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

const { cssCls } = UtilHandle.prototype;
const docIcon: ReactElement = inclStaticIcon('doc', 'white');
const { defSetting, importConfig, exportConfig, removeConfirm, editHost, editPath, addLib, editLib } = modals;

export const OptionApp: React.FC<any> = memo((props: IProps) => {
    const { store, storeHandler } = props;
    const { localState, setting, rules } = store;

    const {
        currView,
        currModalId, allowModalConfirm,
        searchedText,
        targetItem,
    } = localState;

    const {
        showDeleteModal,
        resultsPerPageIdx,
        defRuleConfig
    } = setting;

    const {
        onListView,
        onSearch, onSearchClear,
        onModalCancel, onSettingModal, onimportConfigModal, onexportConfigModal, onAddHostModal,
        onAddHostConfirm, onDelModalConfirm,
        onAddPathConfirm,
        onEditItemIdChange, onEditItemValChange,
        onResetAll, onDelConfirmToggle, onResultsPerPageChange, onDefHostRuleToggle, onDefJsExecStageChange,
        onImportFileChange, onFileImport,
    } = storeHandler;

    const isEditView: boolean = currView === 'EDIT';
    const EDIT_CTRL_CLS = cssCls('header__ctrl', 'edit');
    const MAIN_CLS = cssCls('main', isEditView ? 'edit' : 'list');

    const onImportModalConfirm = () => {
        const { importFile } = localState;
        const reader = new FileReader();
        reader.onloadend = () => {
            const modRules = JSON.parse(JSON.stringify(reader.result));
            onFileImport(modRules);
        };
        reader.readAsText(importFile);
    };

    // Reusable template for Host config rule add/edit operation
    const $ruleIdEdit = <>
        <TextInput
            id="rule-id"
            label="ID"
            required
            autoFocus
            value={targetItem?.id}
            validate={[ validationHandle.gte3Char ]}
            onInputChange={onEditItemIdChange}
            />
    </>;

    const $libEdit = <>
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
    </>;


    return (
        <div className="app app--option">
            <header className="header">{ isEditView &&
                <div className={EDIT_CTRL_CLS}>
                    <IconBtn
                        icon="arrow-lt"
                        theme="white"
                        onClick={onListView}
                        />
                    <IconBtn icon="save" theme="white" />
                    <IconBtn icon="delete" theme="white" />
                    {/* TODO: for host rule only */}
                    <IconBtn icon="add" theme="white" />
                </div>}
                <div className="header__ctrl">
                    <SearchInput
                        id="search"
                        text={searchedText}
                        onChange={onSearch}
                        onClear={onSearchClear}
                        />
                    <IconBtn
                        icon="add-outline"
                        theme="white"
                        title="add host rule"
                        onClick={onAddHostModal}
                        />
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
                        {docIcon}
                    </a>
                    <IconBtn
                        icon="download"
                        theme="white"
                        onClick={onimportConfigModal}
                        />
                    <IconBtn
                        icon="download"
                        theme="white"
                        clsSuffix="upload"
                        disabled={!rules.length}
                        onClick={onexportConfigModal}
                        />
                </div>
            </header>
            <main className={MAIN_CLS}>
                { isEditView ? <OptionEditView {...props} /> : <OptionListView {...props} /> }
            </main>
            { currModalId && <form className="modals">
                <Modal
                    currModalId={currModalId}
                    id={defSetting.id}
                    header={defSetting.txt}
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
                                list={resultsPerPage}
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
                    id={importConfig.id}
                    header={importConfig.txt}
                    clsSuffix="setting-import"
                    cancel="CANCEL"
                    confirm="IMPORT"
                    confirmDisabled={!allowModalConfirm}
                    onCancel={onModalCancel}
                    onConfirm={onImportModalConfirm}
                    >
                    {/* TODO:
                    $elem.validity.valid (boolean): filesize
                    check/merge the settings
                    */}
                    <FileInput
                        id="json-import-input"
                        fileType="application/JSON"
                        required
                        onChange={onImportFileChange}
                        />
                </Modal>
                <Modal
                    currModalId={currModalId}
                    id={exportConfig.id}
                    header={exportConfig.txt}
                    clsSuffix="setting-export"
                    cancel="CANCEL"
                    confirm="EXPORT"
                    confirmDisabled={!allowModalConfirm}
                    onCancel={onModalCancel}
                    onConfirm={onModalCancel}
                    >
                    <TextInput
                        id=""
                        label="Filename"
                        required
                        autoFocus
                        validate={[]}
                        onInputChange={({ validState }) => {
                            // TODO: based on the `validState`, set the Modal Confirm Btn `confirmDisabled` prop, e.g. if it needs to disabled
                        }}
                        />
                </Modal>
                <Modal
                    currModalId={currModalId}
                    id={removeConfirm.id}
                    header={removeConfirm.txt}
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
                    id={editHost.id}
                    header={editHost.txt}
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
                        value={targetItem?.value}
                        validate={[ validationHandle.urlHost ]}
                        onInputChange={onEditItemValChange}
                        />
                </Modal>
                <Modal
                    currModalId={currModalId}
                    id={editPath.id}
                    header={editPath.txt}
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
                        value={targetItem?.value}
                        validate={[ validationHandle.urlPath ]}
                        onInputChange={onEditItemValChange}
                        />
                </Modal>
                <Modal
                    currModalId={currModalId}
                    id={addLib.id}
                    header={addLib.txt}
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
                    id={editLib.id}
                    header={editLib.txt}
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
});