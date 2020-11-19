import React, { memo } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { TextInput } from '../../base/input-text';
import { TabSwitch } from '../../base/checkbox-tab-switch';
import { IconSwitch } from '../../base/checkbox-icon-switch';
import { Dropdown } from '../../base/select-dropdown';
import { SideNav } from '../../base/side-nav';
import { IconBtn } from '../../base/btn-icon';
import { DataGrid } from '../../widget/data-grid';
import { jsExecStage } from '../../../constant/js-exec-stage';
import { TbRow } from './tb-row';
import { IProps } from './type';

export const OptionEditView = memo((props: IProps) => {
    const { store, storeHandler } = props;
    const { rules, localState } = store;
    const { onListItemClick, onActiveTabChange, onTabEnable, onEditorCodeChange } = storeHandler;

    const { editItem } = localState;
    const { activeTabIdx, libs, jsCode, cssCode } = editItem;

    const isLibTab = libs.length && activeTabIdx === 2;
    const isJsCode = activeTabIdx === 0;
    const isCssCode = activeTabIdx === 1;
    const isCode = isJsCode || isCssCode;
    const codeMode = isJsCode ? 'js' : 'css'
    const codeContent = isCode ? (isJsCode ? jsCode : cssCode) : '';

    // TODO: Refactor fixed props, refactor method

    // TODO: disable, event handler
    const $delAll = (
        <IconBtn
            icon="delete"
            theme="gray"
            />
    );
    const $addLib = (
        <IconBtn
            icon="add"
            theme="gray"
            clsSuffix="add-outline"
            />
    );

    return (<>
        <SideNav
            list={rules}
            itemKeys={['id', 'id']}
            childKey="paths"
            activeItem={editItem}
            onItemClick={onListItemClick}
            />
        <div className="main--edit__form">
            <section className="fm-field">
                <p className="fm-field__label">ID</p>
                {/* TODO: placeholder text variation */}
                <TextInput
                    placeholder="domain id, e.g. 'abc'  OR  path id, e.g. 'abc home'"
                    id="url-id"
                    validate={[
                        // cannot be empty
                        // >=3 characters
                        // check if exists already (deboucne)
                    ]}
                    onInputChange={() => {}}
                    />
            </section>
            <section className="fm-field">
                <p className="fm-field__label">Address</p>
                <TextInput
                    placeholder="domain url, e.g. 'abc.com'  OR  subpath, e.g. 'home' (based on full url 'abc.com/home')"
                    id="address"
                    validate={[]}
                    onInputChange={() => {}}
                    />
                <div className="fm-field__ctrl">
                    {/* TODO: lock only avail. for host */}
                    <IconSwitch id="https-switch" label="lock-close" icon />
                    <IconSwitch id="regex-switch" label="(.*)" />
                </div>
            </section>
            <section className="fm-field">
                <p className="fm-field__label">Script Execution</p>
                <Dropdown
                    id="js-execution"
                    border={true}
                    list={jsExecStage}
                    selectIdx={0}
                    /* TODO: selectIdx */
                    onSelect={() => {}} />
            </section>
            {/* TOD: section-form field? */}
            <TabSwitch
                id="tab-switch"
                data={editItem}
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
                onChange={(editor, data, value) => onEditorCodeChange({ value, codeMode }) }
                />}{ isLibTab &&
            <DataGrid
                data={libs}
                component={{
                    rows: [ [ TbRow ] ]
                }}
                rowKey="id"
                /* TODO: event binding */
                header={[
                    { title: '' },
                    { title: 'ID', sortKey: 'id' },
                    { title: 'URL'},
                    { title: 'SUBFRAME', sortKey: 'isSubframe' },
                    { title: 'ASYNC', sortKey: 'isAsync' },
                    { title: 'ACTIVE', sortKey: 'isActive' },
                    { title: $delAll as any },
                    { title: $addLib as any }
                ]}
                />}
        </div>
    </>);
});