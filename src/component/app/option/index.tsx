import React, { memo, useState } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { IconBtn } from '../../base/icon-btn';
import { SearchInput } from '../../base/search-input';
import { TextInput } from '../../base/text-input';
import { TabSwitch } from '../../base/tab-switch';
import { IconSwitch } from '../../base/icon-switch';
import { Dropdown } from '../../base/dropdown';
import { TbHeader } from '../../group/tb-header';
import { TbRow } from '../../group/tb-row';
import { SideNav } from '../../base/side-nav';
import { DataGrid } from '../../widget/data-grid';
import { IProps } from './type';

const mockData = [
    {
        https: true,
        id: 'Host ID 1',
        addr: 'www.abc.com',
        script_exec: 2,
        script_js: true,
        script_css: true,
        script_lib: true,
        paths: [
            {
                id: 'lorem1',
                addr: 'lorem',
                script_js: true,
                script_css: true,
                script_lib: true,
            },
            {
                id: 'lorem2',
                addr: 'lorem2',
                script_js: true,
                script_css: false,
                script_lib: true,
            }
        ],
    },
    {
        https: false,
        id: 'Host ID 2',
        addr: 'cnn.com',
        script_exec: 1,
        script_js: true,
        script_css: true,
        script_lib: false,
        paths: [
            {
                id: 'sum1',
                addr: 'sum',
                script_js: false,
                script_css: true,
                script_lib: true,
            }
        ],
    }
];

const dataGridConfig: any = {
    type: "table",
    component: {
        Header: TbHeader,
        rows: [
            [ TbRow ],
            [ 'paths', TbRow ]
        ]
    },
    data: mockData,
    rowKey: "id",
    header: [
        { title: '' },
        { title: 'HTTPS' },
        { title: 'ID', sortKey: 'id' },
        { title: 'ADDRESS', sortKey: 'addr' },
        { title: 'SCRIPT EXECUTION' },
        { title: 'JS' },
        { title: 'CSS' },
        { title: 'LIBRARY' },
        { title: '' },
        { title: '' },
        { title: '' }
    ],
    expand:{
        onePerLevel: true
    },
    sort: {
        key: 'name',
        isAsc: true,
        reset: true,
    },
    paginate:{
        page: 0,
        increment: [10, 25, 50],
    }
};

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


// TODO: Props type
export const OptionApp: React.FC<any> = memo((props: IProps) => {
    const [ isEditView, setView ] = useState(true);

    // Map to SideNav List
    const sideNavList = mockData.map(({ id, paths }) => {
        const nestList = paths?.map(({id: nestId}) => ({id: nestId}));
        return { id, nestList };
    });

    return (
        <div className="app app--option">
            {/* Temp */}
            <button type="button" onClick={() => setView(false) }>Home</button>
            <span> | </span>
            <button type="button" onClick={() => setView(true) }>Edit</button>
            {/* End-Temp */}
            <header className="header">{ isEditView &&
                <div className="header__ctrl header__ctrl--edit">
                    <IconBtn icon="arrow-lt" theme="white" onClick={() => setView(false) }/>
                    <IconBtn icon="save" theme="white" />
                    <IconBtn icon="delete" theme="white" />
                    <IconBtn icon="add" theme="white" />
                </div>}
                <div className="header__ctrl">
                    <SearchInput id="search" />
                    <IconBtn icon="add-outline" theme="white" />
                    <IconBtn icon="setting" theme="white" />
                    <IconBtn icon="doc" theme="white" />
                    <IconBtn icon="download" theme="white" />
                    <IconBtn icon="download" theme="white" clsSuffix="upload" />
                </div>
            </header>
            <main className={`main main--${(isEditView ? 'edit' : 'list')}`}>{ isEditView ?
                <>
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
                    </div>
                </> :
                <DataGrid {...dataGridConfig} /> }
            </main>
            {/* TODO: Modals */}
        </div>
    );
});