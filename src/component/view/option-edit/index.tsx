import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { validationSet } from '../../../constant/validation-set';
import { codeExecStageList } from '../../../constant/code-exec-stage-list';
import { dataManager } from '../../../data/manager';

import { MemoComponent } from '../../extendable/memo-component';
import { TextInput } from '../../base/input-text';
import { TabSwitch } from '../../base/checkbox-tab-switch';
import { IconSwitch } from '../../base/checkbox-icon-switch';
import { Dropdown } from '../../base/select-dropdown';
import { SideBar } from '../../base/side-bar';
import { IconBtn } from '../../base/btn-icon';
import { SortBtn } from '../../base/btn-sort';
import { Checkbox } from '../../base/checkbox';
import { DataGrid } from '../../widget/data-grid';
import { TbRow } from './tb-row';

import { LibRuleConfig } from '../../../data/model/rule-config';
import * as TSortHandle from '../../../handle/sort/type';
import * as TDataHandler from '../../../data/manager/type';
import { IProps } from './type';

export class OptionEditView extends MemoComponent<IProps> {
    render() {
        const {
            onActiveRuleChange,

            onActiveTitleInput,
            onActiveValueInput,
            onHttpsToggle,
            onRegexToggle,
            onJsExecStepChange,

            onActiveTabChange,
            onTabToggle,
            onCodeChange,

            onLibSort,
            onLibRowsSelectToggle,

            onAddLibModal,
            onDelLibsModal,
        } = this.appStateManager;

        const { rules } = this.appState;
        const { ruleIdCtx, titleInput, valueInput, dataGrid } = this.editViewState;

        // Item
        const item = dataManager.getRuleFromIdCtx(rules, ruleIdCtx) as TDataHandler.AHostPathRule;
        const { hostIdx, pathIdx } = dataManager.getRuleIdxCtxFromIdCtx(rules, ruleIdCtx);
        const { isHost, isRegex, activeTabIdx, libs, jsCode, cssCode, codeExecPhase } = item;

        // Text Input
        const { ruleId, ruleUrlHost, ruleUrlPath } = validationSet;
        const isHttpsOn = item["isHttps"];

        // Tab
        const isJsTab = activeTabIdx === 0;
        const isCssTab = activeTabIdx === 1;
        const isLibTab = activeTabIdx === 2;
        const isCodeTab = isJsTab || isCssTab;
        const codeMode = isJsTab ? 'js' : 'css';
        const codeKey = isJsTab ? 'jsCode' : 'cssCode';
        const codeContent = isCodeTab ? (isJsTab ? jsCode : cssCode) : '';

        // Data grid
        const { sortOption, selectState } = dataGrid;
        const hsDataSrc = !!libs.length;

        // - Select
        const { areAllRowsSelected, selectedRowKeyCtx } = selectState;
        const isPartiallySelected = !areAllRowsSelected && !!Object.entries(selectedRowKeyCtx).length;
        const hasSelected = areAllRowsSelected || isPartiallySelected;

        // - Sort
        const isSortDisabled = hasSelected || libs.length <= 1;

        // - Header
        const $selectAllHeader = (
            <Checkbox
                id="check-all"
                clsSuffix={isPartiallySelected ? 'partial' : ''}
                disabled={!hsDataSrc}
                checked={hasSelected}
                onChange={onLibRowsSelectToggle}
                />
        );
        const $title = (data: LibRuleConfig[], sortBtnProps: TSortHandle.ICmpSortBtnAttr) => (
            <>
                <span>TITLE</span>
                <SortBtn {...sortBtnProps} disabled={isSortDisabled} />
            </>
        );
        const $addr = (data: LibRuleConfig[], sortBtnProps: TSortHandle.ICmpSortBtnAttr) => (
            <>
                <span>URL</span>
                <SortBtn {...sortBtnProps} disabled={isSortDisabled} />
            </>
        );
        const $delAll = (dataSrc: LibRuleConfig[]) => (
            <IconBtn
                icon="delete"
                theme="gray"
                disabled={!hasSelected}
                onClick={onDelLibsModal}
                />
        );
        const $addLib = (
            <IconBtn
                icon="add-outline"
                theme="gray"
                disabled={hasSelected}
                onClick={onAddLibModal}
                />
        );

        return (<>
            <SideBar
                list={rules}
                childListKey="paths"
                activeItemIdx={hostIdx}
                activeChildItemIdx={pathIdx}
                onClick={onActiveRuleChange}
                />
            <div className="main--edit__form">
                <section className="fm-field">
                    <TextInput
                        id="edit-target-id"
                        label="ID"
                        required
                        value={titleInput.value}
                        validation={{
                            rules: ruleId,
                            isValid: titleInput.isValid,
                            errMsg: titleInput.errMsg
                        }}
                        onInputChange={onActiveTitleInput}
                        onInputBlur={onActiveTitleInput}
                        />
                </section>
                <section className="fm-field">
                    <TextInput
                        id="edit-target-value"
                        label={isHost ? 'Host' : 'Path'}
                        required
                        value={valueInput.value}
                        validation={{
                            rules: isHost ? ruleUrlHost : ruleUrlPath,
                            isValid: valueInput.isValid,
                            errMsg: valueInput.errMsg
                        }}
                        onInputChange={onActiveValueInput}
                        onInputBlur={onActiveValueInput}
                        />
                    <div className="fm-field__ctrl">{ isHost &&
                        <IconSwitch
                            icon
                            id="https-switch"
                            label="lock-close"
                            checked={isHttpsOn}
                            onChange={() => onHttpsToggle(ruleIdCtx)}
                            /> }
                        <IconSwitch
                            id="regex-switch"
                            label="(.*)"
                            checked={isRegex}
                            onChange={() => onRegexToggle(ruleIdCtx)}
                            />
                    </div>
                </section>
                <section className="fm-field">
                    <p className="fm-field__label">Script Execution</p>
                    <Dropdown
                        id="js-execution"
                        border={true}
                        list={codeExecStageList}
                        selectIdx={codeExecPhase}
                        onSelect={(arg) => onJsExecStepChange({ ...arg, ...ruleIdCtx})}
                        />
                </section>
                {/* TOD: section-form field? */}
                <TabSwitch
                    id="tab-switch"
                    data={item}
                    dataKeyMap={[
                        ['Js', 'isJsOn'],
                        ['Css', 'isCssOn'],
                        ['Lib', 'isLibOn'],
                    ]}
                    activeTabIdx={activeTabIdx}
                    onTabActive={arg => onActiveTabChange({...arg, ruleIdCtx})}
                    onTabEnable={arg => onTabToggle({...arg, ruleIdCtx})}
                    />{ isCodeTab &&
                <CodeMirror
                    value={codeContent}
                    options={{
                        mode: codeMode,
                        theme: 'darcula',
                        lineNumbers: true
                    }}
                    onChange={(...codeMirrorArgs) => onCodeChange({
                        codeMirrorArgs,
                        codeKey,
                        ruleIdCtx
                    })}
                    />}{ isLibTab &&
                <DataGrid
                    type="table"
                    rowKey="title"
                    data={libs}
                    component={{
                        rows: [
                            [TbRow]
                        ],
                        commonProps: this.props
                    }}
                    header={[
                        { title: $selectAllHeader },
                        { title: $title, sortKey: 'title' },
                        { title: $addr, sortKey: 'value' },
                        { title: 'ASYNC' },
                        { title: 'ACTIVE' },
                        { title: $addLib },
                        { title: $delAll },
                    ]}
                    sort={sortOption}
                    callback={{
                        onSortChange: onLibSort
                    }}
                    />}
            </div>
        </>);
    }

    get appState() {
        return this.props.appState;
    }

    get appStateManager() {
        return this.props.appStateManager;
    }

    get editViewState() {
        return this.appState.localState.editView;
    }
}