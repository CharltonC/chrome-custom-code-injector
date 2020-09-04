import React, { useEffect } from 'react';
import { BaseStoreHandler, StateHandle } from '.';

export default {
    title: 'State Handle',
};

export const Example = () => {
    const sampleStore = {
        name: 'joe',
        age: 20,
        gender: 'male',
        address: '100 Railway Street',
    }

    class SampleStoreHandler extends BaseStoreHandler {
        onNameChange(store, evt?) {
            // Setting state Directly
            return {
                name: 'jane'
            };
        }

        onAgeChange(store, evt?) {
            // Consolidate Partial State (single level) prior to Setting state
            const { name } = this.reflect.onNameChange(store);
            return {
                name,
                age: 21
            };
        }

        onGenderChange(store, evt?) {
            // Dependent State and/or Consolidate Partial State (Recursive) prior to Setting state
            const { address } = this.reflect.onAddressChange(store);
            const { name, age } = this.reflect.onAgeChange(store);
            return {
                name,
                age,
                address,
                gender: age === 20 ? 'female' : 'n/a'
            };
        }

        onAddressChange(store, evt?) {
            // Setting state Directly
            return {
                address: '20 Joseph Street'
            };
        }
    }

    const SampleComponent = ({ store, baseStoreHandler }) => {
        const { name, age, gender, address } = store;
        const { onNameChange, onAgeChange, onGenderChange, onAddressChange } = baseStoreHandler;
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

    const sampleStoreHandler = new SampleStoreHandler();

    useEffect(() => {
        const token = sampleStoreHandler.subscribe((msg, data) => {
            console.log(msg);
            console.log(data);
        });
        return () => sampleStoreHandler.unsubscribe(token);
    }, []);

    const WrappedSampleComponent = StateHandle.init(SampleComponent, sampleStore, sampleStoreHandler);

    return <WrappedSampleComponent />;
};