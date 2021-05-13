import React, { useEffect } from 'react';
import { StoreHandle } from '.';

const { BaseStoreHandler } = StoreHandle;

export default {
    title: 'Service/Store Handle',
};

export const SingleStore = () => {
    // 1. Store
    const sampleStore = {
        name: 'joe',
        age: 20,
        gender: 'male',
        address: '100 Railway Street',
    }

    // 2. Store Handler
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
    const sampleStoreHandler = new SampleStoreHandler();

    // 3. Root Component which reference state and state hanlder
    const SampleComponent = ({ store, storeHandler }) => {
        const { name, age, gender, address } = store;
        const { onNameChange, onAgeChange, onAllChange, onAddressChange } = storeHandler;
        return (
            <div>
                <p>name: {name}</p>
                <p>age: {age}</p>
                <p>gender: {gender}</p>
                <p>address: {address}</p>
                <br/>
                <p><button type="button" onClick={onNameChange}>change name only</button></p>
                <p><button type="button" onClick={onAgeChange}>change age only</button></p>
                <p><button type="button" onClick={onAddressChange}>change address only</button></p>
                <p><button type="button" onClick={onAllChange}>change all</button></p>
            </div>
        );
    };

    // 4. Optionally subscribe to store changes
    useEffect(() => {
        const token = sampleStoreHandler.sub((msg, data) => {
            console.log(msg);
            console.log(data);
        });
        return () => sampleStoreHandler.unsub(token);
    }, [sampleStoreHandler]);

    // 5. Return a Wrapper Root component with Initialised with Store and Store Handler
    const WrappedSampleComponent = StoreHandle.init(SampleComponent, {
        root: [ sampleStore, sampleStoreHandler ]
    });
    return <WrappedSampleComponent />;
};

export const MultipleStores = () => {
    // 1. Store and Store Handler 1
    const sampleStore1 = {
        name: 'joe',
    };
    class SampleStoreHandler1 extends BaseStoreHandler {
        onNameChange(store, evt?) {
            return { name: 'jane' };
        }
    }
    const sampleStoreHandler1 = new SampleStoreHandler1();

    // 2. Store and Store Handler 2
    const sampleStore2 = {
        project: 'VsCode',
        license: 'MIT'
    };
    class SampleStoreHandler2 extends BaseStoreHandler {
        onProjectChange(store, evt?) {
            return { project: 'Apache' };
        }
    }
    const sampleStoreHandler2 = new SampleStoreHandler2();

    // 3. Root Component which references state and state hanlder
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


    // 4. Optionally subscribe to store changes
    const log = (msg, data) => console.log(msg, data);
    useEffect(() => {
        const token1 = sampleStoreHandler1.sub(log, 'storeOne');
        const token2 = sampleStoreHandler2.sub(log, 'storeTwo');
        return () => {
            sampleStoreHandler1.unsub(token1);
            sampleStoreHandler2.unsub(token2);
        };
    }, [sampleStoreHandler1, sampleStoreHandler2]);

    // 5. Return a Wrapper Root component with Initialised with Stores and Stores Handlers
    const WrappedSampleComponent = StoreHandle.init(SampleComponent, {
        storeOne: [sampleStore1, sampleStoreHandler1],
        storeTwo: [sampleStore2, sampleStoreHandler2],
    });
    return <WrappedSampleComponent />;
};


export const SingleStoreWithPartialHandlers = () => {
    // 1. Store
    const sampleStore = {
        name: 'john' ,
        age: 6
    };

    // 2. Partial Store Handlers
    class PartialHandlerA extends BaseStoreHandler {
        onH1Click(store) {
            return { name: 'jane' }
        }
    }
    class PartialHandlerB extends BaseStoreHandler {
        onH2Click(store) {
            return { age: 20 }
        }
    }
    const SampleStoreHandler = BaseStoreHandler.join([PartialHandlerA, PartialHandlerB]);
    const sampleStoreHandler = new SampleStoreHandler()

    // 3. Root componennt
    const SampleComponent = ({ store, storeHandler }) => {
        const { name, age } = store;
        const { onH1Click, onH2Click } = storeHandler;
        return (
            <div>
                <h1 onClick={onH1Click}>{name}</h1>
                <br/>
                <h2 onClick={onH2Click}>{age}</h2>
            </div>
        );
    };

    // 4.Return a Wrapper Root component with Initialised with Stores and Stores Handlers
    const WrappedSampleComponent = StoreHandle.init(
        SampleComponent,
        { root: [ sampleStore, sampleStoreHandler ]
    });
    return <WrappedSampleComponent />;
};