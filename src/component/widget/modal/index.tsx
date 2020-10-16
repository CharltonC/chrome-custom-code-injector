import React, { ReactElement } from 'react';
import { MemoComponent } from '../../extendable/memo-component';
import { inclStaticIcon } from '../../static/icon';
import { IProps, IState } from './type';

export class Modal extends MemoComponent<IProps, IState> {
    closeIconElem: ReactElement = inclStaticIcon('close');

    componentWillUnmount() {
        this.props.onHide?.({ type: 'click'} );    // pass an object to mimic event (see story example)
    }

    render() {
        const { headers, children, onHide, id, currModalId } = this.props;
        const [ header, subHeader ] = headers;

        return this.isVisible(id, currModalId) && (
            <div className="modal">
                <div className="modal__content">
                    <header>
                        <h3>{header}</h3>{ subHeader &&
                        <h4>{subHeader}</h4>}
                        <button type="button" onClick={onHide}>{this.closeIconElem}</button>
                    </header>
                    <main>{children}</main>
                </div>
                <div className="modal__overlay" onClick={onHide}></div>
            </div>
        );
    }

    isVisible(id: string, currModalId: string): boolean {
        return currModalId && id && currModalId === id;
    }
}