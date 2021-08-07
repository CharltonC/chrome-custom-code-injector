import PubSub from 'pubsub-js';
import { IStateHandlerClass } from '../type';

export class BaseStateManager {
    readonly CHANGE_EVT: string = 'CHANGE';
    readonly PubSub: PubSub = PubSub;

    static join<T extends BaseStateManager>(Handlers: IStateHandlerClass[]): IStateHandlerClass<T> {
        class BaseClass extends BaseStateManager {}
        Handlers.forEach((Handler: IStateHandlerClass) => {
            const { prototype: baseProto } = BaseClass;
            const { prototype } = Handler;

            const keys = Object.getOwnPropertyNames(prototype).filter((key) => {
                return typeof prototype[key] === 'function' && key !== 'constructor';
            });

            keys.forEach((key) => {
                baseProto[key] = prototype[key];
            });
        });
        return BaseClass as unknown as IStateHandlerClass<T>;
    }

    // TODO: type `T`
    get reflect() {
        return this;
    }

    sub(callback: AFn, subTopic?: string): string {
        const TOPIC: string = this.getTopic(subTopic);
        const token: string = this.PubSub.subscribe(TOPIC, callback);
        return token;
    }

    pub(data: any, subTopic?: string): void {
        const TOPIC: string = this.getTopic(subTopic);
        this.PubSub.publish(TOPIC, data);
    }

    unsub(token: string): void {
        this.PubSub.unsubscribe(token);
    }

    getTopic(subTopic?: string): string {
        return this.CHANGE_EVT + (subTopic ? `.${subTopic}` : '');
    }
}