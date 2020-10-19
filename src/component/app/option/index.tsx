import React, { memo, useState } from 'react';
import { IconBtn } from '../../base/icon-btn';
import { TextInput } from '../../base/text-input';
import { SearchInput } from '../../base/search-input';
import { SliderSwitch } from '../../base/slider-switch';
import { Dropdown } from '../../base/dropdown';
import { TextBtn } from '../../base/text-btn';
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

const currModalId = 'demo';

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
            <div className="modals">
                <Modal
                    currModalId={currModalId}
                    id="modal-def-option"
                    headers={['Default Options']}
                    onHide={() => {}}>
                    <button type="button">RESET ALL</button>
                    <ul>
                        <li>
                            <h4>Read/Search</h4>
                        </li>
                        <li>
                            <p>Show delete confirmation dialog</p>
                            <SliderSwitch id="show-dialog" />
                        </li>
                        <li>
                            <p>Results per page</p>
                            <Dropdown id="result-per-page" list={['a', 'b']} border={true} />
                        </li>
                        <li>
                            <h4>New Item</h4>
                        </li>
                        <li>
                            <p>HTTPS</p>
                            <SliderSwitch id="match-https" />
                        </li>
                        <li>
                            <p>Regex</p>
                            <SliderSwitch id="match-regex" />
                        </li>
                        <li>
                            <p>Run Custom Js</p>
                            <SliderSwitch id="run-js" />
                        </li>
                        <li>
                            <p>Run Custom CSS</p>
                            <SliderSwitch id="run-css" />
                        </li>
                        <li>
                            <p>Run Libraries</p>
                            <SliderSwitch id="run-library" />
                        </li>
                        <li>
                            <p>Javascript Execution</p>
                            <Dropdown id="js-exec-frame" list={['a', 'b']} border={true} />
                            <Dropdown id="js-exec-order" list={['a', 'b']} border={true} />
                        </li>
                    </ul>
                </Modal>
                <Modal
                    currModalId={currModalId}
                    id="modal-json-import"
                    headers={['Import Configuration from a "*.json" file']}
                    onHide={() => {}}>
                    <FileInput id="json-import-input" fileType="application/JSON" />
                    <div className="modal__footer">
                        <TextBtn text="CANCEL" outline onClick={() => {}} />
                        <TextBtn text="IMPORT" onClick={() => {}} />
                    </div>
                </Modal>
                <Modal
                    currModalId={currModalId}
                    id="modal-json-export"
                    headers={['Export Configuration from a "*.json" file']}
                    onHide={() => {}}>
                    <TextInput id="" label="Filename" validate={[]}/>
                    <div className="modal__footer">
                        <TextBtn text="CANCEL" outline onClick={() => {}} />
                        <TextBtn text="EXPORT" onClick={() => {}} />
                    </div>
                </Modal>
            </div>
        </div>
    );
});