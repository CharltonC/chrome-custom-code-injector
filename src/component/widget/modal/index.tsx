import React, { FormEvent } from 'react';
import { MemoComponent } from '../../extendable/memo-component';
import { TextBtn } from '../../base/btn-text';
import { inclStaticIcon } from '../../static/icon';
import { IProps, IState } from './type';

const $closeIcon = inclStaticIcon('close');

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
    static defaultProps = { confirmType: 'submit' };

    render() {
        const {
            header, subHeader,
            children,
            id, activeModalId, clsSuffix,
            cancel, onCancel, confirm, confirmDisabled, confirmType
        } = this.props;

        return this.isVisible(id, activeModalId) && (
            <div className={this.cssCls('modal', clsSuffix)}>
                <div className="modal__content">
                    <div className="modal__header">
                        <h3>{header}</h3>{ subHeader &&
                        <h4>{subHeader}</h4>}
                        <button type="button" onClick={onCancel}>{$closeIcon}</button>
                    </div>
                    <div className="modal__body">{children}</div>{ (cancel || confirm) &&
                    <div className="modal__footer">{ cancel &&
                        <TextBtn
                            text={cancel}
                            outline
                            onClick={onCancel}
                            />}{ confirm &&
                        <TextBtn
                            text={confirm}
                            disabled={confirmDisabled}
                            type={confirmType}
                            onClick={this.onSubmit.bind(this)}
                            />}
                    </div>}
                </div>
                {/*
                  * a full size overlay clickable to dismiss the modal, instead of using global keyup event binding
                  * however dismiss via ESC key will required global event binding
                 */}
                <div className="modal__overlay" onClick={onCancel}></div>
            </div>
        );
    }

    isVisible(id: string, activeModalId: string): boolean {
        return activeModalId && id && activeModalId === id;
    }

    onSubmit(e: FormEvent) {
        const { onConfirm, onCancel } = this.props;
        e.preventDefault();
        onConfirm ? onConfirm(e) : onCancel(e);
    }
}