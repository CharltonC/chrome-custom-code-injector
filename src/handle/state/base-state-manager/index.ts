import PubSub from 'pubsub-js';
import { IStateHandleClass } from '../type';

export class BaseStateManager {
    readonly CHANGE_EVT = 'CHANGE';
    readonly PubSub = PubSub;

    static join<T extends BaseStateManager>(Handlers: IStateHandleClass[]): T {
        class BaseClass extends BaseStateManager {}
        Handlers.forEach((Handler: IStateHandleClass) => {
            const { prototype: baseProto } = BaseClass;
            const { prototype } = Handler;

            const keys = Object.getOwnPropertyNames(prototype).filter((key) => {
                return typeof prototype[key] === 'function' && key !== 'constructor';
            });

            keys.forEach((key) => {
                baseProto[key] = prototype[key];
            });
        });
        return BaseClass as unknown as T;
    }

    get reflect() {
        return this;
    }

    sub(callback: AFn, subTopic?: string): string {
        const TOPIC = this.getTopic(subTopic);
        const token: string = this.PubSub.subscribe(TOPIC, callback);
        return token;
    }

    pub(data: any, subTopic?: string): this {
        const TOPIC = this.getTopic(subTopic);
        this.PubSub.publish(TOPIC, data);
        return this;
    }

    unsub(token: string): void {
        this.PubSub.unsubscribe(token);
    }

    getTopic(subTopic?: string): string {
        return this.CHANGE_EVT + (subTopic ? `.${subTopic}` : '');
    }

    log(method: string, data: AObj, skipLog = false): void {
        if (skipLog) return;
        const time = new Date().toLocaleString();
        const label = `%c ${time} | Merged state via handler method "${method}":\n`;
        console.info(label, 'background: green; color: white', data);
    }
}