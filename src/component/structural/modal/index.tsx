import React, { ReactElement } from 'react';
import { MemoComponent } from '../../../asset/ts/memo-component';
import { inclStaticIcon } from '../../static/icon';

const closeIconElem: ReactElement = inclStaticIcon('close');

export class Modal extends MemoComponent {
    closeHandler: (...args: any[]) => any;
    $modalElem: HTMLElement;
    evt = {
        CLICK: 'click',
        KEYUP: 'keyup'
    };

    constructor(props) {
        super(props);
        this.state = { isOpen: false };
    }

    componentWillUnmount(){
        if (!this.state.isOpen) return;
        this.onClose();
    }

    // Open Modal
    onOpen() {
        const { CLICK, KEYUP } = this.evt;
        this.setState({ isOpen: true }, () => {
            // One-off binding
            this.closeHandler = this.onDismiss.bind(this);      // temp value to be stored so it can be removed later
            document.body.addEventListener(CLICK, this.closeHandler);
            document.addEventListener(KEYUP, this.closeHandler);
        });
    }

    // Close Modal - For use where User specifically close within Modal, e.g. click the close button
    onClose() {
        const { CLICK, KEYUP } = this.evt;
        this.setState({ isOpen: false }, () => {
            if (!this.closeHandler) return;
            document.body.removeEventListener(CLICK, this.closeHandler);
            document.removeEventListener(KEYUP, this.closeHandler);
            this.closeHandler = null;
        });
    }

    // Close Modal - For use where Modal is closed by either ESC key or Clicking outside of Modal region
    // * Check if it is Click or ESC Key
    // - If click: if its modal contain itself or contains the evt.target
    // - If keyup: check if its ESC key
    onDismiss(evt: Event) {
        // If modal element is not ready, then dont handle the event
        if (!this.$modalElem) return;

        const { CLICK, KEYUP } = this.evt;
        const { type, target } = evt;
        const isClickOutsideModal: boolean = type === CLICK && (this.$modalElem !== target && !this.$modalElem.contains(target as Node));
        const isEscKey: boolean = type === KEYUP && (evt as KeyboardEvent).which === 27;
        const isValidTrigger: boolean = isClickOutsideModal || isEscKey;
        if (!isValidTrigger) return;
        this.onClose();
    }

    render() {
        // TODO: Style
        // TODO: overlay, overflow: hidden; , class
        // TODO: remove inline style
        // TODO: modal animation
        // TODO: Test
        // TODO: props: cancel, confirm m(def props)
        const { cancel, confirm, header } = this.props;
        return this.state.isOpen && (
            <div
                className="kz-modal"
                ref={elem => this.$modalElem = elem}
                >
                <div className="kz-modal__header">
                    <h3>{header}lorem</h3>
                    <button type="button" onClick={this.onClose.bind(this)}>{ closeIconElem }</button>
                </div>
                <div className="kz-modal__body">
                    { this.props.children }
                </div>
                <div className="kz-modal__footer">
                    <button
                        type="button"
                        className="kz-modal__btn kz-modal__btn--cancel"
                        onClick={this.onClose.bind(this)}
                        >
                        {cancel}Cancel
                    </button>
                    <button
                        type="button"
                        className="kz-modal__btn kz-modal__btn--confirm"
                        onClick={this.onClose.bind(this)}
                        >
                        {confirm}Confirm
                    </button>
                </div>
            </div>
        );
    }
}