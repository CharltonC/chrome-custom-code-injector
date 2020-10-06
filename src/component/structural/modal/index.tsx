import React from 'react';
import { MemoComponent } from '../../../asset/ts/memo-component';

export class Modal extends MemoComponent {
    closeHandler: (...args: any[]) => any;
    $elem: HTMLElement;
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

    onOpen() {
        const { CLICK, KEYUP } = this.evt;
        this.setState({ isOpen: true }, () => {
            // One-off binding
            this.closeHandler = this.onDismiss.bind(this);
            document.body.addEventListener(CLICK, this.closeHandler);
            document.addEventListener(KEYUP, this.closeHandler);
        });
    }

    // Close Modal - For use where User specifically close within Modal, e.g. click the close button
    onClose() {
        const { CLICK, KEYUP } = this.evt;
        this.setState({ isOpen: false }, () => {
            document.body.removeEventListener(CLICK, this.closeHandler);
            document.removeEventListener(KEYUP, this.closeHandler);
            this.closeHandler = null;
        });
    }

    // Close Modal - For use where Modal is closed by either ESC key or Clicking outside of Modal region
    onDismiss(evt: Event) {
        // Check if it is Click or ESC Key
        // - If click: if its modal contain itself or contains the evt.target
        // - If keyup: check if its ESC key
        const { CLICK, KEYUP } = this.evt;
        const { type, target } = evt;
        const isClickOutsideModal: boolean = type === CLICK && (this.$elem !== target && !this.$elem.contains(target as Node));
        const isEscKey: boolean = type === KEYUP && (evt as KeyboardEvent).which === 27;
        const isValidTrigger: boolean = isClickOutsideModal || isEscKey;
        if (!isValidTrigger) return;
        this.onClose();
    }

    render() {
        // TODO: overlay, overflow: hidden; , class
        // TODO: remove inline style
        // TODO: modal animation
        return this.state.isOpen && (
            <div ref={elem => this.$elem = elem} style={{width: 100, height: 100, backgroundColor: 'blue'}}>
                { this.props.children }
            </div>
        );
    }
}