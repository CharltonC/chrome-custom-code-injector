import React, { memo, ReactElement } from 'react';

// import { debounce } from '../../../asset/ts/vendor/debounce';
import { modals } from '../../../service/constant/modals';
import { urls } from '../../../service/constant/urls';
import { resultsPerPage } from '../../../service/constant/result-per-page';
import { validationRules } from '../../../service/constant/validation';
import { jsExecStage } from '../../../service/constant/js-exec-stage';
import { UtilHandle } from '../../../service/handle/util';

import { IconBtn } from '../../base/icon-btn';
import { Checkbox } from '../../base/checkbox';
import { TextInput } from '../../base/text-input';
import { SearchInput } from '../../base/search-input';
import { SliderSwitch } from '../../base/slider-switch';
import { Dropdown } from '../../base/dropdown';
import { FileInput } from '../../base/file-input';
import { Modal } from '../../widget/modal';
import { OptionEditView } from '../../view/option-edit';
import { OptionListView } from '../../view/option-list';
import { inclStaticIcon } from '../../static/icon';
import { IProps } from './type';

const { cssCls } = UtilHandle.prototype;
const docIcon: ReactElement = inclStaticIcon('doc', 'white');
const { SETTING, IMPORT_SETTING, EXPORT_SETTING, DELETE, ADD_HOST, ADD_PATH, ADD_LIB, EDIT_LIB } = modals;

export const OptionApp: React.FC<any> = memo((props: IProps) => {
    const { store, storeHandler } = props;
    const { localState, setting } = store;

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
        onModalCancel, onSettingModal, onImportSettingModal, onExportSettingModal, onAddHostModal,
        onAddHostConfirm, onDelModalConfirm,
        onAddPathConfirm,
        onTargetItemIdChange, onTargetItemValChange,
        onResetAll, onDelConfirmToggle, onResultsPerPageChange, onDefHostRuleToggle, onDefJsExecStageChange,
    } = storeHandler;

    const isEditView: boolean = currView === 'EDIT';
    const EDIT_CTRL_CLS = cssCls('header__ctrl', 'edit');
    const MAIN_CLS = cssCls('main', isEditView ? 'edit' : 'list');

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
                        onClick={onImportSettingModal}
                        />
                    <IconBtn
                        icon="download"
                        theme="white"
                        clsSuffix="upload"
                        onClick={onExportSettingModal}
                        />
                </div>
            </header>
            <main className={MAIN_CLS}>
                { isEditView ? <OptionEditView {...props} /> : <OptionListView {...props} /> }
            </main>
            { currModalId && <div className="modals">
                <Modal
                    currModalId={currModalId}
                    id={SETTING.id}
                    header={SETTING.txt}
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
                    id={IMPORT_SETTING.id}
                    header={IMPORT_SETTING.txt}
                    clsSuffix="setting-import"
                    cancel="CANCEL"
                    confirm="IMPORT"
                    confirmDisabled={!allowModalConfirm}
                    onCancel={onModalCancel}
                    onConfirm={onModalCancel}
                    >
                    {/* TODO: */}
                    <FileInput id="json-import-input" fileType="application/JSON" />
                </Modal>
                <Modal
                    currModalId={currModalId}
                    id={EXPORT_SETTING.id}
                    header={EXPORT_SETTING.txt}
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
                        validate={[]}
                        onInputChange={({ validState }) => {
                            // TODO: based on the `validState`, set the Modal Confirm Btn `confirmDisabled` prop, e.g. if it needs to disabled
                        }}
                        />
                </Modal>
                <Modal
                    currModalId={currModalId}
                    id={DELETE.id}
                    header={DELETE.txt}
                    clsSuffix="delete-confirm"
                    subHeader="Are you sure you want to remove?"
                    cancel="CANCEL"
                    confirm="DELETE"
                    onCancel={onModalCancel}
                    onConfirm={onDelModalConfirm}
                    >
                    <Checkbox
                        id="setting-delete-confirm"
                        label="Don’t show this confirmation again"
                        required
                        onChange={onDelConfirmToggle}
                        />
                </Modal>
                <Modal
                    currModalId={currModalId}
                    id={ADD_HOST.id}
                    header={ADD_HOST.txt}
                    clsSuffix="host-add"
                    cancel="CANCEL"
                    confirm="SAVE"
                    confirmDisabled={!allowModalConfirm}
                    onCancel={onModalCancel}
                    onConfirm={onAddHostConfirm}
                    >
                    <TextInput
                        id="host-id"
                        label="ID"
                        required
                        value={targetItem?.id}
                        validate={[ validationRules.gte3Char ]}
                        onInputChange={onTargetItemIdChange}
                        />
                    <TextInput
                        id="host-value"
                        label="Host Value"
                        required
                        value={targetItem?.value}
                        validate={[ validationRules.urlHost ]}
                        onInputChange={onTargetItemValChange}
                        />
                </Modal>
                <Modal
                    currModalId={currModalId}
                    id={ADD_PATH.id}
                    header={ADD_PATH.txt}
                    clsSuffix="path-add"
                    cancel="CANCEL"
                    confirm="SAVE"
                    confirmDisabled={!allowModalConfirm}
                    onCancel={onModalCancel}
                    onConfirm={onAddPathConfirm}
                    >
                    <TextInput
                        id="path-id"
                        label="ID"
                        required
                        validate={[ validationRules.gte3Char ]}
                        onInputChange={onTargetItemIdChange}
                        />
                    <TextInput
                        id="path-url"
                        label="Path Value"
                        required
                        validate={[ validationRules.urlPath ]}
                        onInputChange={onTargetItemValChange}
                        />
                </Modal>
                <Modal
                    currModalId={currModalId}
                    id={ADD_LIB.id}
                    header={ADD_LIB.txt}
                    clsSuffix="lib-add"
                    cancel="CANCEL"
                    confirm="SAVE"
                    confirmDisabled={!allowModalConfirm}
                    onCancel={onModalCancel}
                    onConfirm={onModalCancel}
                    >
                    <TextInput
                        id="path-id"
                        label="ID"
                        required
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
                </Modal>
                <Modal
                    currModalId={currModalId}
                    id={EDIT_LIB.id}
                    header={EDIT_LIB.txt}
                    clsSuffix="lib-edit"
                    cancel="CANCEL"
                    confirm="SAVE"
                    confirmDisabled={!allowModalConfirm}
                    onCancel={onModalCancel}
                    onConfirm={onModalCancel}
                    >
                    <TextInput
                        id="path-id"
                        label="ID"
                        required
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
                </Modal>
            </div> }
        </div>
    );
});