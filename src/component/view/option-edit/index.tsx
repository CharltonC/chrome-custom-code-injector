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
import { IProps } from './type';

export class OptionEditView extends MemoComponent<IProps> {
    $idInputRef: RefObject<TextInput>;
    $valueInputRef: RefObject<TextInput>;

    constructor(props: IProps) {
        super(props);
        this.$idInputRef = createRef();
        this.$valueInputRef = createRef();
        this.onListItemChange = this.onListItemChange.bind(this);

        // TODO: constant component props
    }

    render() {
        const { headerProps, props } = this;
        const { appState, appStateHandler } = props;
        const { rules, localState } = appState;
        const { titleInput, hostOrPathInput, editViewTarget } = localState;
        const {
            onItemTitleChange, onItemHostOrPathChange,
            onItemJsExecStageChange,
            onItemActiveTabChange, onItemTabEnable, onItemEditorCodeChange
        } = appStateHandler;

        const { itemIdx, childItemIdx } = editViewTarget;
        const isHost = !Number.isInteger(childItemIdx);
        const host = rules[itemIdx];
        const item = host?.paths[childItemIdx] || host;
        const { activeTabIdx, libs, jsCode, cssCode, jsExecPhase} = item;

        const isLibTab = !!libs.length && activeTabIdx === 2;
        const isJsCode = activeTabIdx === 0;
        const isCssCode = activeTabIdx === 1;
        const isCode = isJsCode || isCssCode;
        const codeMode = isJsCode ? 'js' : 'css'
        const codeContent = isCode ? (isJsCode ? jsCode : cssCode) : '';

        const { ruleId, ruleUrlHost, ruleUrlPath } = validationRule;

        return (<>
            <SideNav
                list={rules}
                childListKey="paths"
                activeItemIdx={itemIdx}
                activeChildItemIdx={childItemIdx}
                onClick={this.onListItemChange}
                />
            <div className="main--edit__form">
                {/* TODO: placeholder text variation */}
                <section className="fm-field">
                    {/* TODO: State for error msg, valid */}
                    <TextInput
                        ref={this.$idInputRef}
                        id="edit-target-id"
                        label="ID"
                        required
                        value={titleInput.value}
                        validation={{
                            rules: ruleId,
                            isValid: titleInput.isValid,
                            errMsg: titleInput.errMsg
                        }}
                        onInputChange={onItemTitleChange}
                        />
                </section>
                <section className="fm-field">
                    <TextInput
                        ref={this.$valueInputRef}
                        id="edit-target-value"
                        label={isHost ? 'Host' : 'Path'}
                        required
                        value={hostOrPathInput.value}
                        validation={{
                            rules: isHost ? ruleUrlHost : ruleUrlPath,
                            isValid: hostOrPathInput.isValid,
                            errMsg: hostOrPathInput.errMsg
                        }}
                        onInputChange={onItemHostOrPathChange}
                        />
                    <div className="fm-field__ctrl">{ isHost &&
                        <IconSwitch
                            id="https-switch"
                            label="lock-close"
                            checked={item["isHttps"]}
                            /* TODO: onChange */
                            icon /> }
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
                        onSelect={onItemJsExecStageChange} />
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
                    onTabActive={onItemActiveTabChange}
                    onTabEnable={onItemTabEnable}
                    />{ isCode &&
                <CodeMirror
                    value={codeContent}
                    options={{
                        mode: codeMode,
                        theme: 'darcula',
                        lineNumbers: true
                    }}
                    onChange={(editor, data, val) => onItemEditorCodeChange({ value: val, codeMode }) }
                    />}{ isLibTab &&
                <DataGrid
                    data={libs}
                    /* TODO: constant props */
                    component={{
                        rows: [ [ TbRow ] ],
                        commonProps: { appState, appStateHandler }
                    }}
                    rowKey="title"
                    sort={{ reset: true }}
                    /* TODO: event binding */
                    header={headerProps}
                    />}
            </div>
        </>);
    }

    get headerProps() {
        const { props } = this;
        const { appState, appStateHandler } = props;
        const { rules, localState } = appState;
        const { searchedRules, selectState } = localState;
        const { } = appStateHandler;

        const hsDataSrc = !!(searchedRules ? searchedRules : rules).length;
        const { areAllRowsSelected, selectedRowKeys } = selectState;
        const totalSelected = Object.entries(selectedRowKeys).length;
        const hsSelected = areAllRowsSelected || !!totalSelected;
        const isPartialSelected = !areAllRowsSelected && !!totalSelected;

        // TODO: disable, event handler
        const $selectAllHeader = (
            <Checkbox
                id="check-all"
                clsSuffix={isPartialSelected ? 'partial' : ''}
                disabled={!hsDataSrc}
                checked={hsSelected}
                onChange={() => {}}
                />
        );

        const $id = this.getHeaderColRenderFn('ID', hsSelected);
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
            { title: $id as any, sortKey: 'id' },
            { title: $addr as any, sortKey: 'value' },
            { title: 'SUBFRAME' },
            { title: 'ASYNC' },
            { title: 'ACTIVE' },
            { title: $addLib as any },
            { title: $delAll as any },
        ];
    }

    getHeaderColRenderFn(title: string, disabled: boolean) {
        return (data, sortBtnProps: TSortHandle.ICmpSortBtnAttr) => <>
            <span>{title}</span>
            <SortBtn {...sortBtnProps} disabled={disabled} />
        </>;
    }

    onListItemChange(args): void {
        // TODO: clear input state & validation state?
        // this.$idInputRef.current.clearValidState();
        // this.$valueInputRef.current.clearValidState();
        setTimeout(() => {
            this.props.appStateHandler.onListItemChange(args);
        }, 200);
    }
}