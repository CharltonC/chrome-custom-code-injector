import React, { Component, useState } from 'react';
import { DomHandle } from '../../../service/handle/dom-handle';
import { TextBtn } from '../../base/btn-text';
import { Modal } from '.';

export default {
    title: 'Widget - Modal',
    component: Modal,
};

const defStyle = {
    padding: 40,
    border: '1px solid gray'
};

const domHandle = new DomHandle();

export const ForClassComponent = () => {
    class Demo extends Component {
        state: any;

        constructor(props: any) {
            super(props);
            this.state = { currId: null };
            this.onShow = this.onShow.bind(this);
            this.onCancel = this.onCancel.bind(this);
        }

        onCancel(evt) {
            const { type } = evt || {};
            if (evt && type !== 'click' && !(type === 'keyup' && (evt as KeyboardEvent).which === 27)) return;
            this.setState({currId: null});
            document.removeEventListener('keyup', this.onCancel);
            domHandle.addBodyCls('modal-open', false);
        }

        onShow() {
            this.setState({currId: 'demo'});
            document.addEventListener('keyup', this.onCancel);
            domHandle.addBodyCls('modal-open');
        }

        render() {
            return (
                <div style={defStyle}>
                    <button type="button" onClick={this.onShow}>Open modal</button>
                    <Modal
                        currModalId={this.state.currId}
                        id="demo"
                        header="title"
                        subHeader="subheader"
                        cancel="cancel"
                        confirm="confirm"
                        onCancel={this.onCancel}
                        onConfirm={this.onCancel}
                        >
                        <h1>Modal A content</h1>
                    </Modal>
                </div>
            );
        }
    }

    return <Demo />;
};

export const ForFunctionalComponent = () => {
    const [ currModalId, setCurrModalId ] = useState(null);

    const onCancel = (evt: Event) => {
        const { type } = evt || {};
        if (evt && type !== 'click' && !(type === 'keyup' && (evt as KeyboardEvent).which === 27)) return;
        setCurrModalId(null);
        document.removeEventListener('keyup', onCancel);
        domHandle.addBodyCls('modal-open', false);
    }

    const onShow = () => {
        setCurrModalId('demo');
        document.addEventListener('keyup', onCancel);
        domHandle.addBodyCls('modal-open');
    }

    return (
        <div style={defStyle}>
            <button type="button" onClick={onShow}>Open modal</button>
            <Modal
                currModalId={currModalId}
                id="demo"
                header="header"
                subHeader="subheader"
                cancel="cancel"
                confirm="confirm"
                onCancel={onCancel}
                onConfirm={onCancel}
                >
                <h1>Modal A content</h1>
            </Modal>
        </div>
    );
};

export const WithoutEscKeyBinding = () => {
    const [ currModalId, setCurrModalId ] = useState(null);
    const onCancel = () => setCurrModalId(null);
    const onShow = () => setCurrModalId('demo');

    return (
        <div style={defStyle}>
            <button type="button" onClick={onShow}>Open modal</button>
            <Modal
                currModalId={currModalId}
                id="demo"
                header="header"
                subHeader="subheader"
                cancel="cancel"
                confirm="confirm"
                onCancel={onCancel}
                >
                <h1>Modal A content</h1>
            </Modal>
        </div>
    );
};