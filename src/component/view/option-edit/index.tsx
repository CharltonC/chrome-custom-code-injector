import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { validationSet } from '../../../constant/validation-set';
import { codeExecStageList } from '../../../constant/code-exec-stage-list';
import { hintMsgSet } from '../../../constant/hint-msg-set';
import { dataHandle } from '../../../handle/data';
import { rowHandle } from '../../../handle/row-select';

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

import { LibRule } from '../../../model/rule';
import * as TSortHandle from '../../../handle/sort/type';
import * as TDataHandler from '../../../handle/data/type';
import { IProps } from './type';

export class OptionEditView extends MemoComponent<IProps> {
    render() {
        const {
            onActiveRuleChange,

            onActiveTitleInput,
            onActiveValueInput,
            onHttpsToggle,
            onExactMatchToggle,
            onJsExecStepChange,

            onActiveTabChange,
            onTabToggle,
            onCodeChange,

            onLibSort,
            onLibRowsSelectToggle,

            onAddLibModal,
            onDelLibsModal,
        } = this.appStateHandle;

        const { rules } = this.appState;
        const { ruleIdCtx, titleInput, valueInput, dataGrid } = this.editViewState;

        // Item
        const item = dataHandle.getRuleFromIdCtx(rules, ruleIdCtx) as TDataHandler.AHostPathRule;
        const { hostIdx, pathIdx } = dataHandle.getRuleIdxCtxFromIdCtx(rules, ruleIdCtx);
        const { isHost, isExactMatch, activeTabIdx, libs, jsCode, cssCode, codeExecPhase } = item;

        // Text Input
        const { ruleId, ruleUrlHost, ruleUrlPath } = validationSet;
        const isHttpsOn = item["isHttps"];

        // Tab
        const isJsTab = activeTabIdx === 0;
        const isCssTab = activeTabIdx === 1;
        const isLibTab = activeTabIdx === 2;
        const isCodeTab = isJsTab || isCssTab;
        const codeMode = isJsTab ? 'js' : 'css';

        // Data grid
        const { sortOption, selectState } = dataGrid;
        const hsDataSrc = !!libs.length;

        // - Select
        const { isPartiallySelected, hasSelected } = rowHandle.distillState(selectState);

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
        const $title = (data: LibRule[], sortBtnProps: TSortHandle.ICmpSortBtnAttr) => (
            <>
                <span>TITLE</span>
                <SortBtn {...sortBtnProps} disabled={isSortDisabled} />
            </>
        );
        const $addr = (data: LibRule[], sortBtnProps: TSortHandle.ICmpSortBtnAttr) => (
            <>
                <span>URL</span>
                <SortBtn {...sortBtnProps} disabled={isSortDisabled} />
            </>
        );
        const $delAll = (dataSrc: LibRule[]) => (
            <IconBtn
                icon="delete"
                theme="gray"
                disabled={!hasSelected}
                onClick={onDelLibsModal}
                />
        );
        const $addLib = (
            <IconBtn
                title={hintMsgSet.ADD_LIB_BTN}
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
                            label="="
                            checked={isExactMatch}
                            onChange={() => onExactMatchToggle(ruleIdCtx)}
                            />
                    </div>
                </section>
                <section className="fm-field">
                    <p className="fm-field__label">Code Execution</p>
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
                        ['js', 'isJsOn'],
                        ['css', 'isCssOn'],
                        ['lib', 'isLibOn'],
                    ]}
                    activeTabIdx={activeTabIdx}
                    onTabActive={arg => onActiveTabChange({...arg, ruleIdCtx})}
                    onTabEnable={arg => onTabToggle({...arg, ruleIdCtx})}
                    />{ isCodeTab &&
                <CodeMirror
                    value={isJsTab ? jsCode : cssCode}
                    options={{
                        mode: codeMode,
                        theme: 'darcula',
                        lineNumbers: true
                    }}
                    onBeforeChange={(...codeMirrorArgs) => onCodeChange({
                        codeMirrorArgs,
                        codeMode,
                        ruleIdCtx
                    })}
                    />}{ isLibTab &&
                <DataGrid
                    type="table"
                    rowKey="id"
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
                        { title: 'TYPE' },
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

    get appStateHandle() {
        return this.props.appStateHandle;
    }

    get editViewState() {
        return this.appState.localState.editView;
    }
}