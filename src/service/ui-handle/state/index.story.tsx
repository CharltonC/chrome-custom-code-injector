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
        address = '100 Railway Street';
    }

    class SampleStoreHandler extends StoreHandler {
        onNameChange(store, evt?) {
            // Setting state Directly
            return {
                ...store,
                name: 'jane'
            };
        }

        onAgeChange(store, evt?) {
            // Consolidate Partial State (single level) prior to Setting state
            const { name } = this.reflect.onNameChange(store);
            return {
                ...store,
                name,
                age: 21
            };
        }

        onGenderChange(store, evt?) {
            // Consolidate Partial State (Recursive) prior to Setting state
            const { address } = this.reflect.onAddressChange(store);
            const { name, age } = this.reflect.onAgeChange(store);
            return {
                ...store,
                name,
                age,
                address,
                gender: 'female'
            };
        }

        onAddressChange(store, evt?) {
            // Setting state Directly
            return { ...store, address: '20 Joseph Street' };
        }
    }

    const SampleComponent = ({ store, storeHandler }) => {
        const { name, age, gender, address } = store;
        const { onNameChange, onAgeChange, onGenderChange, onAddressChange } = storeHandler;
        return (
            <div>
                <p>name: {name}</p>
                <p>age: {age}</p>
                <p>gender: {gender}</p>
                <p>address: {address}</p>
                <p><button type="button" onClick={onNameChange}>change name</button></p>
                <p><button type="button" onClick={onAgeChange}>change age</button></p>
                <p><button type="button" onClick={onGenderChange}>change gender</button></p>
                <p><button type="button" onClick={onAddressChange}>change address</button></p>
            </div>
        );
    };

    const WrappedSampleComponent = StateHandle.init(SampleComponent, SampleStore, SampleStoreHandler);

    return <WrappedSampleComponent />;
};