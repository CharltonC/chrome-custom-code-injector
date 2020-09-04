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

// TODO: multiple state modules example
export const MultipleStatesExample = () => {
    const sampleStore1 = {
        name: 'joe',
    };

    const sampleStore2 = {
        project: 'VsCode',
        license: 'MIT'
    };

    class SampleStoreHandler1 extends BaseStoreHandler {
        onNameChange(store, evt?) {
            const { root, name, local } = store;
            console.log(name);
            console.log(root);
            console.log(local);

            return { name: 'jane' };
        }
    }

    class SampleStoreHandler2 extends BaseStoreHandler {
        onProjectChange({ root, name, local }, evt?) {
            return { project: 'Apache' };
        }
    }

    const SampleComponent = ({ store, storeHandler }) => {
        const { storeOne, storeTwo } = store;
        const { storeOne: storeOneHandler, storeTwo: storeTwoHandler } = storeHandler;

        return (
            <div>
                <p>Name: {storeOne.name}</p>
                <p><button type="button" onClick={storeOneHandler.onNameChange}>change name from store 1</button></p>
                <br/>
                <p>Project: {storeTwo.project}</p>
                <p><button type="button" onClick={storeTwoHandler.onProjectChange}>change project from store 2</button></p>
            </div>
        );
    };

    const WrappedSampleComponent = StateHandle.init2(SampleComponent, {
        storeOne: [sampleStore1, new SampleStoreHandler1()],
        storeTwo: [sampleStore2, new SampleStoreHandler2()],
    });

    return <WrappedSampleComponent />;
};