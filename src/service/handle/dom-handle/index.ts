import { IGlobalEvtConfig } from './type';

export class DomHandle {
    addGlobalEvt({ targetType, evtType, handler }: IGlobalEvtConfig, isAdd: boolean = true): void | undefined {
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
            case 'win':
                target = window;
                break;
            case 'doc':
                target = document;
                break;
            case 'body':
                target = document.body;
                break;
            default:
                break;
        }

        return target;
    }
}