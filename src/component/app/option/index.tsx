import React, { memo, useState } from 'react';
import { IconBtn } from '../../base/icon-btn';
import { Checkbox } from '../../base/checkbox';
import { TextInput } from '../../base/text-input';
import { SearchInput } from '../../base/search-input';
import { SliderSwitch } from '../../base/slider-switch';
import { Dropdown } from '../../base/dropdown';
import { FileInput } from '../../base/file-input';
import { Modal } from '../../widget/modal';
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

const modalIds = [
    'setting',
    'setting-import',
    'setting-export',
    'delete-confirm'
];

// TODO: Props type
export const OptionApp: React.FC<any> = memo((props: IProps) => {
    // TODO: removal temp state
    const [ isEditView, setView ] = useState(true);
    const [ currModalId, setModalId ] = useState('modal-confirm-removal');

    return (
        <div className="app app--option">
            {/* Temp */}
            <button type="button" onClick={() => setView(false) }>Home</button>
            <span> | </span>
            <button type="button" onClick={() => setView(true) }>Edit</button>
            <ul>
                { modalIds.map( id => (
                    <li><button type="button" onClick={() => setModalId(`modal-${id}`) }>Modal {id}</button></li>
                )) }
            </ul>

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
            {/* Abstract Modal ID to a constant object */}
            <div className="modals">
                <Modal
                    currModalId={currModalId}
                    id="modal-setting"
                    clsSuffix="setting"
                    header="Default Settings"
                    onCancel={() => setModalId(null)}
                    onConfirm={() => setModalId(null)}
                    >
                    <ul>
                        <li>
                            <button type="button" className="btn btn--reset">RESET ALL</button>
                        </li><li>
                            <h4>Read/Search</h4>
                        </li><li>
                            <SliderSwitch id="show-dialog" label="Show delete confirmation dialog" ltLabel />
                        </li><li>
                            <Dropdown
                                id="result-per-page"
                                label="Results per page"
                                ltLabel
                                list={['a', 'b']}
                                border={true}
                                />
                        </li><li>
                            <h4>New Item</h4>
                        </li><li>
                            <SliderSwitch id="match-https" label="HTTPS" ltLabel />
                        </li><li>
                            <SliderSwitch id="match-regex" label="Regex" ltLabel />
                        </li><li>
                            <SliderSwitch id="run-js" label="Run Custom Js" ltLabel />
                        </li><li>
                            <SliderSwitch id="run-css" label="Run Custom CSS" ltLabel />
                        </li><li>
                            <SliderSwitch id="run-library" label="Run Libraries" ltLabel />
                        </li><li>
                            {/* TODO: style */}
                            <p>Javascript Execution</p>
                            <Dropdown id="js-exec-frame" list={['a', 'b']} border={true} />
                            <Dropdown id="js-exec-order" list={['a', 'b']} border={true} />
                        </li>
                    </ul>
                </Modal>
                <Modal
                    currModalId={currModalId}
                    id="modal-setting-import"
                    clsSuffix="setting-import"
                    header="Import Configuration from a `*.json` file"
                    cancel="CANCEL"
                    confirm="IMPORT"
                    onCancel={() => setModalId(null)}
                    onConfirm={() => setModalId(null)}
                    >
                    <FileInput id="json-import-input" fileType="application/JSON" />
                </Modal>
                <Modal
                    currModalId={currModalId}
                    id="modal-setting-export"
                    clsSuffix="setting-export"
                    header="Export Configuration to a `*.json` file"
                    cancel="CANCEL"
                    confirm="EXPORT"
                    onCancel={() => setModalId(null)}
                    onConfirm={() => setModalId(null)}
                    >
                    <TextInput
                        id=""
                        label="Filename"
                        validate={[]}
                        onInputChange={({ validState }) => {
                            // TODO: based on the `validState`, set the Modal Confirm Btn `confirmDisabled` prop, e.g. if it needs to disabled
                        }} />
                </Modal>
                <Modal
                    currModalId={currModalId}
                    id="modal-delete-confirm"
                    clsSuffix="delete-confirm"
                    header="Confirmation"
                    subHeader="Are you sure you want to remove?"
                    cancel="CANCEL"
                    confirm="DELETE"
                    onCancel={() => setModalId(null)}
                    onConfirm={() => setModalId(null)}
                    >
                    <Checkbox id="setting-delete-confirm" label="Don’t show this confirmation again" />
                </Modal>
            </div>
        </div>
    );
});