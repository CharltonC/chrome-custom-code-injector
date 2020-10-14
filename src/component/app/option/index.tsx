import React, { memo, useState } from 'react';
import { IconBtn } from '../../base/icon-btn';
import { SearchInput } from '../../base/search-input';
import { OptionEditView } from '../../view/option-edit';
import { OptionListView } from '../../view/option-list';
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

// TODO: Props type
export const OptionApp: React.FC<any> = memo((props: IProps) => {
    const [ isEditView, setView ] = useState(true);

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
            <main className={`main main--${(isEditView ? 'edit' : 'list')}`}>
                { isEditView ? <OptionEditView data={mockData}/> : <OptionListView data={mockData}/> }
            </main>
            {/* TODO: Modals */}
        </div>
    );
});