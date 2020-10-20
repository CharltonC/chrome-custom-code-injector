import React, { ReactElement } from 'react';
import { MemoComponent } from '../../extendable/memo-component';
import { TextBtn } from '../../base/text-btn';
import { inclStaticIcon } from '../../static/icon';
import { IProps, IState } from './type';

/**
 * The reason this design approach is chosen is to mainly separate the concern of mixing global event inside the component
 * where it is out of the component context (i.e. Press ESC key on document)
 * - this focues on ID comparison to determine whether a specific modal should be shown
 *
 * The other design approach focuses on:
 * - inclusive of global event add/removal
 * - relies on exposing the "controller" aka Modal component instance via `ref`, hence using the `onOpen`, `onClose` outside of Modal
 * - however disadvantage is the instance is async and only retrieved at `componentDidMount` so the instance value is not readily available
 *   and, any method call would have to be `onClick={() => onOpen()}`, instead of `onClick={onOpen}` outside of Modal
 */
export class Modal extends MemoComponent<IProps, IState> {
    readonly closeIconElem: ReactElement = inclStaticIcon('close');

    componentWillUnmount() {
        this.props.onHide();
    }

    render() {
        const {
            header, subHeader,
            children,
            id, currModalId,
            cancel, confirm, onCancel, onConfirm, onHide
        } = this.props;

        return this.isVisible(id, currModalId) && (
            <div className="modal">
                <div className="modal__content">
                    <header>
                        <h3>{header}</h3>{ subHeader &&
                        <h4>{subHeader}</h4>}
                        <button type="button" onClick={onHide}>{this.closeIconElem}</button>
                    </header>
                    <main>{children}</main>{ (cancel || confirm) &&
                    <footer>{ cancel &&
                        <TextBtn text={cancel} outline onClick={onCancel ?? onHide} />}{ confirm &&
                        <TextBtn text={confirm} onClick={onConfirm ?? onHide} />}
                    </footer>}
                </div>
                <div className="modal__overlay" onClick={onHide}></div>
            </div>
        );
    }

    isVisible(id: string, currModalId: string): boolean {
        return currModalId && id && currModalId === id;
    }
}