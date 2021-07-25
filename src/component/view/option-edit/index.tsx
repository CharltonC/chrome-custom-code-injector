import React, { createRef, RefObject } from 'react';
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
import * as TDataGrid from '../../widget/data-grid/type';
import { IProps } from './type';

export class OptionEditView extends MemoComponent<IProps> {
    dataGridBaseProps: Partial<TDataGrid.IProps>;
    $titleInputRef: RefObject<TextInput>;
    $valueInputRef: RefObject<TextInput>;

    constructor(props: IProps) {
        super(props);
        this.$titleInputRef = createRef();
        this.$valueInputRef = createRef();
        this.onActiveItemChange = this.onActiveItemChange.bind(this);
    }

    render() {
        const { headerProps, props } = this;
        const { appState, appStateHandler } = props;
        const { rules, localState } = appState;
        const { activeTitleInput, activeValueInput, activeRule, libDataGrid } = localState;
        const {
            onActiveRuleTitleInput, onActiveRuleValueInput,
            onItemJsExecStepChange,
            onItemActiveExecTabChange, onItemExecCodeChange,
            onItemExecSwitchToggle,
            onLibSort,
        } = appStateHandler;

        const { isHost, idx, pathIdx } = activeRule;
        const hostRule = rules[idx];
        const rule = hostRule.paths[pathIdx] || hostRule;
        const { activeTabIdx, libs, jsCode, cssCode, jsExecPhase} = rule;

        const isLibTab = activeTabIdx === 2;
        const isJsCode = activeTabIdx === 0;
        const isCssCode = activeTabIdx === 1;
        const isCode = isJsCode || isCssCode;
        const codeMode = isJsCode ? 'js' : 'css'
        const codeContent = isCode ? (isJsCode ? jsCode : cssCode) : '';

        const isActiveItem = true
        const { ruleId, ruleUrlHost, ruleUrlPath } = validationRule;
        const itemIdxCtx = {
            ctxIdx: isHost ? idx : pathIdx,
            parentCtxIdx: isHost ? null : idx,
        };

        const { sortOption } = libDataGrid;
        const commonProps = { appState, appStateHandler };

        return (<>
            <SideNav
                list={rules}
                childListKey="paths"
                activeItemIdx={idx}
                activeChildItemIdx={pathIdx}
                onClick={this.onActiveItemChange}
                />
            <div className="main--edit__form">
                {/* TODO: placeholder text variation */}
                <section className="fm-field">
                    <TextInput
                        ref={this.$titleInputRef}
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
                        ref={this.$valueInputRef}
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
                            checked={rule["isHttps"]}
                            onChange={() => onItemExecSwitchToggle({
                                ...itemIdxCtx,
                                key: 'isHttps',
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
                        onSelect={arg => onItemJsExecStepChange({
                            ...arg,
                            isActiveItem,
                        })} />
                </section>
                {/* TOD: section-form field? */}
                <TabSwitch
                    id="tab-switch"
                    data={rule}
                    dataKeyMap={[
                        ['Js', 'isJsOn'],
                        ['Css', 'isCssOn'],
                        ['Lib', 'isLibOn'],
                    ]}
                    activeTabIdx={activeTabIdx}
                    onTabActive={onItemActiveExecTabChange}
                    onTabEnable={arg => onItemExecSwitchToggle({
                        ...arg,
                        isActiveItem
                    })}
                    />{ isCode &&
                <CodeMirror
                    value={codeContent}
                    options={{
                        mode: codeMode,
                        theme: 'darcula',
                        lineNumbers: true
                    }}
                    onChange={(editor, data, val) => onItemExecCodeChange({ value: val, codeMode }) }
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
            onLibRowsSelectToggle
        } = appStateHandler;

        const { isHost, idx, pathIdx } = activeRule;
        const host = rules[idx];
        const { libs } = isHost ? host : host.paths[pathIdx];
        const hsDataSrc = !!libs.length;

        const { areAllRowsSelected, selectedRowKeys } = libDataGrid.selectState;
        const totalSelected = Object.entries(selectedRowKeys).length;
        const hsSelected = areAllRowsSelected || !!totalSelected;
        const isPartialSelected = !areAllRowsSelected && !!totalSelected;

        const $selectAllHeader = (
            <Checkbox
                id="check-all"
                clsSuffix={isPartialSelected ? 'partial' : ''}
                disabled={!hsDataSrc}
                checked={hsSelected}
                onChange={onLibRowsSelectToggle}
                />
        );

        const $title = this.getHeaderColRenderFn('ID', hsSelected);
        const $addr = this.getHeaderColRenderFn('URL', hsSelected);

        const $delAll = (
            <IconBtn
                icon="delete"
                theme="gray"
                />
        );
        const $addLib = (
            <IconBtn
                icon="add-outline"
                theme="gray"
                />
        );

        return [
            { title: $selectAllHeader },
            { title: $title as any, sortKey: 'title' },
            { title: $addr as any, sortKey: 'value' },
            { title: 'SUBFRAME' },
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

    onActiveItemChange(args): void {
        // TODO: clear input state & validation state?
        // this.$titleInputRef.current.clearValidState();
        // this.$valueInputRef.current.clearValidState();
        setTimeout(() => {
            this.props.appStateHandler.onActiveItemChange(args);
        }, 200);
    }
}