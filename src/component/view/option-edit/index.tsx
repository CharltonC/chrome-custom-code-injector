import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { validationRule } from '../../../constant/validation-rule';
import { MemoComponent } from '../../extendable/memo-component';
import { TextInput } from '../../base/input-text';
import { TabSwitch } from '../../base/checkbox-tab-switch';
import { IconSwitch } from '../../base/checkbox-icon-switch';
import { Dropdown } from '../../base/select-dropdown';
import { SideNav } from '../../base/side-nav';
import { IconBtn } from '../../base/btn-icon';
import { SortBtn } from '../../base/btn-sort';
import { Checkbox } from '../../base/checkbox';
import { DataGrid } from '../../widget/data-grid';
import { jsExecStage } from '../../../constant/js-exec-stage';
import { TbRow } from './tb-row';
import * as TSortHandle from '../../../handle/sort/type';
import { IProps } from './type';

export class OptionEditView extends MemoComponent<IProps> {
    render() {
        const { headerProps, props } = this;
        const { appState, appStateHandler } = props;
        const { rules, localState } = appState;
        const { activeTitleInput, activeValueInput, activeRule, libDataGrid } = localState;
        const {
            onActiveItemChange,
            onActiveRuleTitleInput, onActiveRuleValueInput,
            onItemJsExecStepChange,
            onItemActiveExecTabChange, onItemExecCodeChange,
            onItemExecSwitchToggle,
            onLibSort,
        } = appStateHandler;

        const { item, isHost, ruleIdx, pathIdx } = activeRule;
        const { activeTabIdx, libs, jsCode, cssCode, jsExecPhase } = item;

        const isLibTab = activeTabIdx === 2;
        const isJsCode = activeTabIdx === 0;
        const isCssCode = activeTabIdx === 1;
        const isCode = isJsCode || isCssCode;
        const codeMode = isJsCode ? 'js' : 'css'
        const codeContent = isCode ? (isJsCode ? jsCode : cssCode) : '';

        const { ruleId, ruleUrlHost, ruleUrlPath } = validationRule;
        const { sortOption } = libDataGrid;
        const commonProps = { appState, appStateHandler };

        return (<>
            <SideNav
                list={rules}
                childListKey="paths"
                activeItemIdx={ruleIdx}
                activeChildItemIdx={pathIdx}
                onClick={onActiveItemChange}
                />
            <div className="main--edit__form">
                <section className="fm-field">
                    <TextInput
                        id="edit-target-id"
                        label="ID"
                        required
                        value={activeTitleInput.value}
                        validation={{
                            rules: ruleId,
                            isValid: activeTitleInput.isValid,
                            errMsg: activeTitleInput.errMsg
                        }}
                        onInputChange={onActiveRuleTitleInput}
                        onInputBlur={onActiveRuleTitleInput}
                        />
                </section>
                <section className="fm-field">
                    <TextInput
                        id="edit-target-value"
                        label={isHost ? 'Host' : 'Path'}
                        required
                        value={activeValueInput.value}
                        validation={{
                            rules: isHost ? ruleUrlHost : ruleUrlPath,
                            isValid: activeValueInput.isValid,
                            errMsg: activeValueInput.errMsg
                        }}
                        onInputChange={onActiveRuleValueInput}
                        onInputBlur={onActiveRuleValueInput}
                        />
                    <div className="fm-field__ctrl">{ isHost &&
                        <IconSwitch
                            icon
                            id="https-switch"
                            label="lock-close"
                            checked={item["isHttps"]}
                            onChange={() => onItemExecSwitchToggle({
                                item,
                                key: 'Https',
                            })}
                            /> }
                        <IconSwitch
                            id="regex-switch"
                            label="(.*)" />
                    </div>
                </section>
                <section className="fm-field">
                    <p className="fm-field__label">Script Execution</p>
                    <Dropdown
                        id="js-execution"
                        border={true}
                        list={jsExecStage}
                        selectIdx={jsExecPhase}
                        onSelect={({ selectValueAttrVal }) => onItemJsExecStepChange({
                            item,
                            selectValueAttrVal,
                        })} />
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
                    onTabActive={({ idx }) => onItemActiveExecTabChange({
                        item,
                        idx,
                    })}
                    onTabEnable={({ tab }) => onItemExecSwitchToggle({
                        item,
                        id: tab.id
                    })}
                    />{ isCode &&
                <CodeMirror
                    value={codeContent}
                    options={{
                        mode: codeMode,
                        theme: 'darcula',
                        lineNumbers: true
                    }}
                    onChange={(...[,,value]) => onItemExecCodeChange({
                        item,
                        value,
                        codeMode
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
                        commonProps
                    }}
                    header={headerProps}
                    sort={sortOption}
                    callback={{
                        onSortChange: onLibSort
                    }}
                    />}
            </div>
        </>);
    }

    get headerProps() {
        const { props } = this;
        const { appState, appStateHandler } = props;
        const { rules, localState } = appState;
        const { activeRule, libDataGrid } = localState;

        const {
            onLibRowsSelectToggle,
            onAddLibModal,
            onDelLibModal,
        } = appStateHandler;

        const { isHost, ruleIdx, pathIdx } = activeRule;
        const host = rules[ruleIdx];
        const { libs } = isHost ? host : host?.paths[pathIdx];
        const hsDataSrc = !!libs.length;

        const { areAllRowsSelected, selectedRowKeys } = libDataGrid.selectState;
        const totalSelected = Object.entries(selectedRowKeys).length;
        const hsSelected = areAllRowsSelected || !!totalSelected;
        const isPartialSelected = !areAllRowsSelected && !!totalSelected;
        const isAddDisabled = areAllRowsSelected || !!totalSelected;

        const $selectAllHeader = (
            <Checkbox
                id="check-all"
                clsSuffix={isPartialSelected ? 'partial' : ''}
                disabled={!hsDataSrc}
                checked={hsSelected}
                onChange={onLibRowsSelectToggle}
                />
        );

        const isSortDisabled = !hsDataSrc || hsSelected;
        const $title = this.getHeaderColRenderFn('ID', isSortDisabled);
        const $addr = this.getHeaderColRenderFn('URL', isSortDisabled);

        const $delAll = dataSrc => (
            <IconBtn
                icon="delete"
                theme="gray"
                disabled={!hsSelected}
                onClick={() => onDelLibModal({ dataSrc })}
                />
        );
        const $addLib = (
            <IconBtn
                icon="add-outline"
                theme="gray"
                disabled={isAddDisabled}
                onClick={onAddLibModal}
                />
        );

        return [
            { title: $selectAllHeader },
            { title: $title as any, sortKey: 'title' },
            { title: $addr as any, sortKey: 'value' },
            { title: 'ASYNC' },
            { title: 'ACTIVE' },
            { title: $addLib as any },
            { title: $delAll as any },
        ];
    }

    getHeaderColRenderFn(title: string, disabled: boolean) {
        return (data, sortBtnProps: TSortHandle.ICmpSortBtnAttr) => (
            <>
                <span>{title}</span>
                <SortBtn {...sortBtnProps} disabled={disabled} />
            </>
        );
    }
}