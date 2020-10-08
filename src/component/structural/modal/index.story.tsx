import React, { Component } from 'react';
import { TextBtn } from '../../base/text-btn';
import { Modal } from '.';

export default {
    title: 'Modal',
    component: Modal,
};

const defStyle = {
    padding: 40,
    border: '1px solid gray'
};

export const ForClassComponent = () => {
    class Demo extends Component {
        modal2Ctrl: any;

        render() {
            return (
                <div style={defStyle}>
                    {/* Example 1 - using `this.refs` */}
                    <button type="button" onClick={e => (this.refs.demoModalA as any).onOpen(e)}>Open modal A</button>
                    <Modal headerText="title" ref="demoModalA">
                        <h1>Modal A content</h1>
                    </Modal>
                    <br/>
                    {/* Example 2 - using class property `modal2Ctrl` */}
                    <button type="button" onClick={() => this.modal2Ctrl.onOpen()}>Open modal B</button>
                    <Modal headerText="title" ref={ ctrl => this.modal2Ctrl = ctrl }>
                        <h1>Modal B content</h1>
                    </Modal>
                </div>
            );
        }
    }

    return <Demo />;
};

export const ForFunctionalComponent = () => {
    let demoModalCtrlA;
    let demoModalCtrlB;
    const openModalB = () => demoModalCtrlB?.onOpen();

    return (
        <div style={defStyle}>
            <button type="button" onClick={e => demoModalCtrlA.onOpen(e)}>Open modal A</button>
            <Modal headerText="title" ref={ modalCtrl => demoModalCtrlA = modalCtrl }>
                <h1>Modal A content</h1>
            </Modal>
            <br/>
            <button type="button" onClick={openModalB}>Open modal B</button>
            <Modal headerText="title" ref={ modalCtrl => demoModalCtrlB = modalCtrl }>
                <h1>Modal B content</h1>
                <TextBtn text="cancel" outline />
                <TextBtn text="confirm" />
            </Modal>
        </div>
    );
};

export const ShowModalInitially = () => {
    let demoModalCtrlA;

    return (
        <div style={defStyle}>
            <button type="button" onClick={e => demoModalCtrlA.onOpen(e)}>Open modal A</button>
            <Modal
                headerText="title"
                initialShow={true}
                ref={ modalCtrl => demoModalCtrlA = modalCtrl }>
                <h1>Modal A content</h1>
            </Modal>
        </div>
    );
};