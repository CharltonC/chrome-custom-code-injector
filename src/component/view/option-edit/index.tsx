import React, { memo } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { TextInput } from '../../base/text-input';
import { TabSwitch } from '../../base/tab-switch';
import { IconSwitch } from '../../base/icon-switch';
import { Dropdown } from '../../base/dropdown';
import { SideNav } from '../../base/side-nav';

const tabSwitchList = [
    {name: 'js' , isEnable: true},
    {name: 'css', isEnable: false},
    {name: 'lib', isEnable: true},
];

const dropdownValues = [
    'before page script',
    'dom content ready',
    'after page script',
    'after page load'
];

export const OptionEditView = memo(({ data }: any) => {
    // Map to SideNav List
    const sideNavList = data.map(({ id, paths }) => {
        const nestList = paths?.map(({id: nestId}) => ({id: nestId}));
        return { id, nestList };
    });

    return (<>
        <SideNav list={sideNavList} />
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
                    list={dropdownValues}
                    selectIdx={0}
                    onSelect={() => {}} />
            </section>
            {/* TOD: section-form field? */}
            <TabSwitch
                id="tab-switch"
                list={tabSwitchList}
                onTabActive={(evt, checkedTab, idx) => {}}
                onTabEnable={(evt, tab, idx, isTabAtv, isEnable) => {}}
                />
            <CodeMirror
                value='console.log("done");'
                options={{
                    mode: 'js',
                    theme: 'darcula',
                    lineNumbers: true
                }}
                onChange={(editor, data, value) => {}}
                />
            {/* TODO: DataGrid for Library */}
            {/* <DataGrid
                { ...dataGridConfig}
                // data={}
                component={{
                    Header: TbHeader,
                    rows: [ [ TbRow ] ]
                }}
                rowKey="id"
                header={[
                    { title: '' },
                    { title: 'ID', sortKey: 'id' },
                    { title: 'URL'},
                    { title: 'SUBFRAME' },
                    { title: 'ASYNC' },
                    { title: 'ACTIVE' },
                    { title: '' },
                    { title: '' }
                ]}
                /> */}
        </div>
    </>);
});