import React from 'react';
import { StoreHandler, StateHandle } from './';

export default {
    title: 'State Handle',
};

export const Example = () => {
    class SampleStore {
        name = 'joe';
        age = 20;
        gender = 'male';
    }

    class SampleStoreHandler extends StoreHandler {
        onNameChange(store, evt?) {
            return {
                ...store,
                name: 'jane'
            };
        }

        onAgeChange(store, evt?) {
            const { name } = this.reflect.onNameChange(store);
            return {
                ...store,
                name,
                age: 21
            };
        }

        onGenderChange(store, evt?) {
            const { name, age } = this.reflect.onAgeChange(store);
            return {
                ...store,
                name,
                age,
                gender: 'female'
            };
        }
    }

    const SampleComponent = ({ store, storeHandler }) => {
        const { name, age, gender } = store;
        const { onNameChange, onAgeChange, onGenderChange } = storeHandler;
        return (
            <div>
                <p>name: {name}</p>
                <p>age: {age}</p>
                <p>gender: {gender}</p>
                <p>
                    <button type="button" onClick={onNameChange}>change name</button>
                </p>
                <p>
                    <button type="button" onClick={onAgeChange}>change age</button>
                </p>
                <p>
                    <button type="button" onClick={onGenderChange}>change gender</button>
                </p>
            </div>
        );
    };

    const WrappedSampleComponent = StateHandle.init(SampleComponent, SampleStore, SampleStoreHandler);

    return <WrappedSampleComponent />;
};