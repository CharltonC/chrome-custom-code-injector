import PubSub from 'pubsub-js';
import { TFn } from './type';

export class BaseStoreHandler {
    readonly CHANGE_EVT: string = 'CHANGE';
    readonly PubSub: PubSub = PubSub;

    get reflect() {
        return this;
    }

    sub(callback: TFn, subTopic?: string): string {
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