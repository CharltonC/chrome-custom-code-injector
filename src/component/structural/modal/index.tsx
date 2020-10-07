import React, { ReactElement } from 'react';
import { MemoComponent } from '../../../asset/ts/memo-component';
import { inclStaticIcon } from '../../static/icon';
import { DomHandle } from '../../../service/handle/dom';
import { IGlobalEvtConfig } from '../../../service/handle/dom/type';
import { IProps, IState, TFn } from './type';

export const BODY_CLS: string = 'kz-modal-open';     // class to added to <body> when modal is on

const closeIconElem: ReactElement = inclStaticIcon('close');

export class Modal extends MemoComponent<IProps, IState> {
    domHandle = new DomHandle();
    keyupHandler: TFn;                      // temp value to store keyup handler so it can be removed later

    constructor(props: IProps) {
        super(props);
        this.state = { isOpen: false };
    }

    componentWillUnmount(){
        if (!this.state.isOpen) return;
        this.onClose();
    }

    render() {
        const { headerText, subHeaderText, children } = this.props;
        const onClose = () => this.onClose();

        return this.state.isOpen && (
            <div className="kz-modal">
                <div className="kz-modal__content">
                    <div className="kz-modal__header">
                        <h3>{headerText}</h3>{ subHeaderText &&
                        <h4>{subHeaderText}</h4>}
                        <button type="button" onClick={onClose}>{closeIconElem}</button>
                    </div>
                    <div className="kz-modal__body">{children}</div>
                </div>
                <div className="kz-modal__overlay" onClick={onClose}></div>
            </div>
        );
    }

    //// Open/Close Modal & state related
    // Open Modal
    onOpen() {
        if (this.state.isOpen) return;
        this.setState({ isOpen: true }, this.addEvt);
    }

    // Close Modal - For use where User specifically close within Modal, e.g. click the close button
    onClose() {
        if (!this.state.isOpen) return;
        this.setState({ isOpen: false }, this.rmvEvt);
    }

    // Close Modal - For use where Modal is closed by either ESC key
    onKeyup({ which }: KeyboardEvent) {
        if (which !== 27) return;
        this.onClose();
    }

    //// Non-Component Scope related (Global Event)
    addEvt(): void {
        this.keyupHandler = this.onKeyup.bind(this);            // must be set prior to `domHandle.addGlobalEvt`
        this.domHandle.addGlobalEvt(this.getEvtConfig());       // One-off binding which is removed upon keyup
        this.domHandle.addBodyCls(BODY_CLS);
    }

    rmvEvt(): void {
        this.domHandle.addGlobalEvt(this.getEvtConfig(), false);
        this.domHandle.addBodyCls(BODY_CLS, false);
        this.keyupHandler = null;
    }

    getEvtConfig(): IGlobalEvtConfig {
        return {
            targetType: 'doc',
            evtType: 'keyup',
            handler: this.keyupHandler
        }
    }
}