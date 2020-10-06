import React, { useEffect } from 'react';
import { StateHandle } from '.';

export default {
    title: 'State Handle',
};

export const SingleStateExample = () => {
    const sampleStore = {
        name: 'joe',
        age: 20,
        gender: 'male',
        address: '100 Railway Street',
    }

    class SampleStoreHandler extends StateHandle.BaseStoreHandler {
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
        const token = sampleStoreHandler.sub((msg, data) => {
            console.log(msg);
            console.log(data);
        });
        return () => sampleStoreHandler.unsub(token);
    }, [sampleStoreHandler]);

    const WrappedSampleComponent = StateHandle.init(SampleComponent, {
        root: [ sampleStore, sampleStoreHandler ]
    });

    return <WrappedSampleComponent />;
};


export const MultipleStatesExample = () => {
    const sampleStore1 = {
        name: 'joe',
    };

    const sampleStore2 = {
        project: 'VsCode',
        license: 'MIT'
    };

    class SampleStoreHandler1 extends StateHandle.BaseStoreHandler {
        onNameChange(store, evt?) {
            return { name: 'jane' };
        }
    }

    class SampleStoreHandler2 extends StateHandle.BaseStoreHandler {
        onProjectChange(store, evt?) {
            return { project: 'Apache' };
        }
    }

    const SampleComponent = ({ store, storeHandler }) => {
        const { name } = store.storeOne;
        const { project } = store.storeTwo;
        const { onNameChange } = storeHandler.storeOne;
        const { onProjectChange } = storeHandler.storeTwo;

        return (
            <div>
                <p>Name: {name}</p>
                <p><button type="button" onClick={onNameChange}>change name from store 1</button></p>
                <br/>
                <p>Project: {project}</p>
                <p><button type="button" onClick={onProjectChange}>change project from store 2</button></p>
            </div>
        );
    };

    const sampleStoreHandler1 = new SampleStoreHandler1();
    const sampleStoreHandler2 = new SampleStoreHandler2();
    const log = (msg, data) => console.log(msg, data);

    useEffect(() => {
        const token1 = sampleStoreHandler1.sub(log, 'storeOne');
        const token2 = sampleStoreHandler2.sub(log, 'storeTwo');
        return () => {
            sampleStoreHandler1.unsub(token1);
            sampleStoreHandler2.unsub(token2);
        };
    }, [sampleStoreHandler1, sampleStoreHandler2]);

    const WrappedSampleComponent = StateHandle.init(SampleComponent, {
        storeOne: [sampleStore1, sampleStoreHandler1],
        storeTwo: [sampleStore2, sampleStoreHandler2],
    });

    return <WrappedSampleComponent />;
};