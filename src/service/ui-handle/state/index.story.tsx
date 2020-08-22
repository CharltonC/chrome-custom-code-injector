import React from 'react';
import { StateHandle } from './';

export default {
    title: 'State Handle',
};

export const Example = () => {
    const state = {
        name: 'joe',
        age: 20
    };

    const stateHandler = {
        onNameChange(store, evt) {
            return {
                ...store,
                name: 'jane'
            };
        },

        onAgeChange(store, evt) {
            const { name } = this.reflect.onNameChange(store);
            return {
                ...store,
                name,
                age: 21
            };
        }
    };

    const DemoComponent = ({ store, storeHandle }) => {
        const { name, age } = store;
        const { onNameChange, onAgeChange } = storeHandle;
        return (
            <div>
                <p>name: {name}</p>
                <p>age: {age}</p>
                <p>
                    <button type="button" onClick={onNameChange}>change name</button>
                </p>
                <p>
                    <button type="button" onClick={onAgeChange}>change age</button>
                </p>
            </div>
        );
    };

    const WrappedDemoComponent = StateHandle.init(DemoComponent, state, stateHandler);

    return <WrappedDemoComponent />;
};