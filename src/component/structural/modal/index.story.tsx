import React, { Component } from 'react';
import { Modal } from '.';

export default {
    title: 'Modal',
    component: Modal,
};

export const ForClassComponent = () => {
    class Demo extends Component {
        modal2Ctrl: any;

        render() {
            return (
                <>
                    {/* Example 1 - using `this.refs` */}
                    <button type="button" onClick={e => (this.refs.demoModalA as any).onOpen(e)}>Open modal A</button>
                    <Modal ref="demoModalA">
                        <button type="button" onClick={e => (this.refs.demoModalA as any).onClose(e)}>close modal</button>
                        <h1>Modal A content</h1>
                    </Modal>
                    <br/>
                    {/* Example 2 - using class property `modal2Ctrl` */}
                    <button type="button" onClick={() => this.modal2Ctrl.onOpen()}>Open modal B</button>
                    <Modal ref={ ctrl => this.modal2Ctrl = ctrl }>
                        <button type="button" onClick={() => this.modal2Ctrl.onClose()}>close modal</button>
                        <h1>Modal B content</h1>
                    </Modal>
                </>
            );
        }
    }

    return <Demo />;
};

export const ForFunctionalComponent = () => {
    let demoModalCtrlA;
    let demoModalCtrlB;
    const openModalB = () => demoModalCtrlB?.onOpen();
    const closeModalB = () => demoModalCtrlB?.onClose();

    return (
        <>
            <button type="button" onClick={e => demoModalCtrlA.onOpen(e)}>Open modal A</button>
            <Modal ref={ modalCtrl => demoModalCtrlA = modalCtrl }>
                <button type="button" onClick={e => demoModalCtrlA.onClose(e)}>Close modal A</button>
                <h1>Modal A content</h1>
            </Modal>
            <br/>
            <button type="button" onClick={openModalB}>Open modal B</button>
            <Modal ref={ modalCtrl => demoModalCtrlB = modalCtrl }>
                <button type="button" onClick={closeModalB}>Close modal B</button>
                <h1>Modal B content</h1>
            </Modal>
        </>
    );
};