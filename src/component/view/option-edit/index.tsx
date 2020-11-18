import React, { memo } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { TextInput } from '../../base/input-text';
import { TabSwitch } from '../../base/checkbox-tab-switch';
import { IconSwitch } from '../../base/checkbox-icon-switch';
import { Dropdown } from '../../base/select-dropdown';
import { SideNav } from '../../base/side-nav';
import { DataGrid } from '../../widget/data-grid';
import { jsExecStage } from '../../../constant/js-exec-stage';
import { TbRow } from './tb-row';
import { IProps } from './type';

// TODO: props type
export const OptionEditView = memo((props: IProps) => {
    const { store, storeHandler } = props;
    const { rules, localState } = store;
    const { onListItemClick } = storeHandler;
    const { targetItem } = localState;

    return (<>
        <SideNav
            list={rules}
            itemKeys={['id', 'id']}
            childKey="paths"
            activeItem={targetItem}
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
                    onSelect={() => {}} />
            </section>
            {/* TOD: section-form field? */}
            <TabSwitch
                id="tab-switch"
                data={targetItem}
                dataKeyMap={[
                    ['js', 'isJsOn'],
                    ['css', 'isCssOn'],
                    ['lib', 'isLibOn'],
                ]}
                /* TODO: callback update state */
                onTabActive={(evt, tab, idx) => {}}
                onTabEnable={(evt, tab, idx) => {}}
                />
            {/* TODO: Conditional CodeMirror */}
{/*             <CodeMirror
                value='console.log("done");'
                options={{
                    mode: 'js',
                    theme: 'darcula',
                    lineNumbers: true
                }}
                onChange={(editor, data, value) => {}}
                /> */}
            {/* TODO: Conditional DataGrid */}
            <DataGrid
                data={rules}
                component={{
                    rows: [ [ TbRow ] ]
                }}
                rowKey="id"
                header={[
                    { title: '' },
                    { title: 'ID', sortKey: 'id' },
                    { title: 'URL'},
                    { title: 'SUBFRAME', sortKey: 'isSubframe' },
                    { title: 'ASYNC', sortKey: 'isAsync' },
                    { title: 'ACTIVE', sortKey: 'isActive' },
                    { title: '' },
                    { title: '' }
                ]}
                />
        </div>
    </>);
});