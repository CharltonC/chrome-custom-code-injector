import { IGlobalEvtConfig, EGlobalTarget } from './type';

const { WIN, DOC, BODY } = EGlobalTarget;

export class DomHandle {
    addGlobalEvt({ targetType, evtType, handler }: IGlobalEvtConfig, isAdd: boolean = true): void {
        let target = this.getGlobalTarget(targetType);
        if (!target) return;
        if (isAdd) return target.addEventListener(evtType, handler);
        target.removeEventListener(evtType, handler);
    }

    addBodyCls(clsName: string, isAdd: boolean = true): void | string {
        const { body } = document;

        // Add
        if (isAdd) return body.className += ` ${clsName}`;

        // Remove
        const pattern: RegExp = new RegExp(`.?${clsName}`, 'g');
        body.className = body.className.replace(pattern, '');
    }

    getGlobalTarget(targetType: string): Window | Document | HTMLElement {
        let target: Window | Document | HTMLElement;

        switch (targetType) {
            case WIN:
                target = window;
                break;
            case DOC:
                target = document;
                break;
            case BODY:
                target = document.body;
                break;
            default:
                break;
        }

        return target;
    }
}