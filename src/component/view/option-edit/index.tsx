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
import * as TSortHandle from '../../../service/sort-handle/type';
import { IProps } from './type';

export class OptionEditView extends MemoComponent<IProps> {
    render() {
        const { headerProps, props } = this;
        const { store, storeHandler } = props;
        const { rules, localState } = store;
        const { onListItemClick, onActiveTabChange, onTabEnable, onEditorCodeChange } = storeHandler;

        const { editViewTarget } = localState;
        const { activeTabIdx, libs, jsCode, cssCode, jsExecPhase, id, value } = editViewTarget;

        const isLibTab = !!libs.length && activeTabIdx === 2;
        const isJsCode = activeTabIdx === 0;
        const isCssCode = activeTabIdx === 1;
        const isCode = isJsCode || isCssCode;
        const codeMode = isJsCode ? 'js' : 'css'
        const codeContent = isCode ? (isJsCode ? jsCode : cssCode) : '';

        const isHostRule = 'paths' in editViewTarget;

        // TODO: Refactor fixed props, refactor method

        return (<>
            <SideNav
                list={rules}
                itemKeys={['id', 'id']}
                childKey="paths"
                activeItem={editViewTarget}
                onItemClick={onListItemClick}
                /* TODO: clear validation state */
                />
            <div className="main--edit__form">
                {/* TODO: placeholder text variation */}
                <section className="fm-field">
                    <TextInput
                        id="edit-target-id"
                        label="ID"
                        required
                        autoFocus
                        value={id}
                        validate={validationRule.ruleId}
                        onInputChange={() => {}}
                        />
                </section>
                <section className="fm-field">
                    <TextInput
                        id="edit-target-value"
                        label={isHostRule ? 'Host' : 'Path'}
                        required
                        value={value}
                        validate={isHostRule ? validationRule.ruleUrlHost : validationRule.ruleUrlPath}
                        onInputChange={() => {}}
                        />
                    {/*
                        <div className="fm-field__ctrl">{ isHostRule &&
                            <IconSwitch id="https-switch" label="lock-close" icon /> }
                            <IconSwitch id="regex-switch" label="(.*)" />
                        </div>
                    */}
                </section>
                <section className="fm-field">
                    <p className="fm-field__label">Script Execution</p>
                    <Dropdown
                        id="js-execution"
                        border={true}
                        list={jsExecStage}
                        selectIdx={jsExecPhase}
                        /* TODO: selectIdx */
                        onSelect={() => {}} />
                </section>
                {/* TOD: section-form field? */}
                <TabSwitch
                    id="tab-switch"
                    data={editViewTarget}
                    dataKeyMap={[
                        ['js', 'isJsOn'],
                        ['css', 'isCssOn'],
                        ['lib', 'isLibOn'],
                    ]}
                    activeTabIdx={activeTabIdx}
                    onTabActive={onActiveTabChange}
                    onTabEnable={onTabEnable}
                    />{ isCode &&
                <CodeMirror
                    value={codeContent}
                    options={{
                        mode: codeMode,
                        theme: 'darcula',
                        lineNumbers: true
                    }}
                    onChange={(editor, data, val) => onEditorCodeChange({ value: val, codeMode }) }
                    />}{ isLibTab &&
                <DataGrid
                    data={libs}
                    /* TODO: constant props */
                    component={{
                        rows: [ [ TbRow ] ]
                    }}
                    rowKey="id"
                    sort={{ reset: true }}
                    /* TODO: event binding */
                    header={headerProps}
                    />}
            </div>
        </>);
    }

    get headerProps() {
        const { props } = this;
        const { store, storeHandler } = props;
        const { rules, localState } = store;
        const { searchedRules, selectState } = localState;
        const { } = storeHandler;

        const hsDataSrc = !!(searchedRules ? searchedRules : rules).length;
        const { areAllRowsSelected, selectedRowKeys } = selectState;
        const totalSelected: number = Object.entries(selectedRowKeys).length;
        const hsSelected: boolean = areAllRowsSelected || !!totalSelected;
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
}