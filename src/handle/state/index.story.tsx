import React, { useEffect } from 'react';
import { StateHandle } from '.';

const { BaseStateManager } = StateHandle;

export default {
    title: 'State Handle',
};

export const SingleState = () => {
    // 1. State
    const sampleState = {
        name: 'joe',
        age: 20,
        gender: 'male',
        address: '100 Railway Street',
    }

    // 2. State Handler
    class SampleStateHandler extends BaseStateManager {
        onNameChange(appState, evt?) {
            // Setting state Directly
            return {
                name: 'jane'
            };
        }

        onAgeChange(appState, evt?) {
            // Consolidate Partial State (single level) prior to Setting state
            const { name } = this.reflect.onNameChange(appState);
            return {
                name,
                age: 21
            };
        }

        onGenderChange(appState, evt?) {
            // Dependent State and/or Consolidate Partial State (Recursive) prior to Setting state
            const { address } = this.reflect.onAddressChange(appState);
            const { name, age } = this.reflect.onAgeChange(appState);
            return {
                name,
                age,
                address,
                gender: age === 20 ? 'female' : 'n/a'
            };
        }

        onAddressChange(appState, evt?) {
            // Setting state Directly
            return {
                address: '20 Joseph Street'
            };
        }
    }
    const sampleStateHandler = new SampleStateHandler();

    // 3. Root Component which reference state and state hanlder
    const SampleComponent = ({ appState, appStateManager }) => {
        const { name, age, gender, address } = appState;
        const { onNameChange, onAgeChange, onAllChange, onAddressChange } = appStateManager;
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

    // 4. Optionally subscribe to appState changes
    useEffect(() => {
        const token = sampleStateHandler.sub((msg, data) => {
            console.log(msg);
            console.log(data);
        });
        return () => sampleStateHandler.unsub(token);
    }, [sampleStateHandler]);

    // 5. Return a Wrapper Root component with Initialised with State and State Handler
    const WrappedSampleComponent = StateHandle.init(SampleComponent, {
        root: [ sampleState, sampleStateHandler ]
    });
    return <WrappedSampleComponent />;
};

export const MultipleStates = () => {
    // 1. State and State Handler 1
    const sampleState1 = {
        name: 'joe',
    };
    class SampleStateHandler1 extends BaseStateManager {
        onNameChange(appState, evt?) {
            return { name: 'jane' };
        }
    }
    const sampleStateHandler1 = new SampleStateHandler1();

    // 2. State and State Handler 2
    const sampleState2 = {
        project: 'VsCode',
        license: 'MIT'
    };
    class SampleStateHandler2 extends BaseStateManager {
        onProjectChange(appState, evt?) {
            return { project: 'Apache' };
        }
    }
    const sampleStateHandler2 = new SampleStateHandler2();

    // 3. Root Component which references state and state hanlder
    const SampleComponent = ({ appState, appStateManager }) => {
        const { name } = appState.stateOne;
        const { project } = appState.stateTwo;
        const { onNameChange } = appStateManager.stateOne;
        const { onProjectChange } = appStateManager.stateTwo;

        return (
            <div>
                <p>Name: {name}</p>
                <p><button type="button" onClick={onNameChange}>change name from appState 1</button></p>
                <br/>
                <p>Project: {project}</p>
                <p><button type="button" onClick={onProjectChange}>change project from appState 2</button></p>
            </div>
        );
    };


    // 4. Optionally subscribe to appState changes
    const log = (msg, data) => console.log(msg, data);
    useEffect(() => {
        const token1 = sampleStateHandler1.sub(log, 'stateOne');
        const token2 = sampleStateHandler2.sub(log, 'stateTwo');
        return () => {
            sampleStateHandler1.unsub(token1);
            sampleStateHandler2.unsub(token2);
        };
    }, [sampleStateHandler1, sampleStateHandler2]);

    // 5. Return a Wrapper Root component with Initialised with States and States Handlers
    const WrappedSampleComponent = StateHandle.init(SampleComponent, {
        stateOne: [sampleState1, sampleStateHandler1],
        stateTwo: [sampleState2, sampleStateHandler2],
    });
    return <WrappedSampleComponent />;
};


export const SingleStateeWithPartialHandlers = () => {
    // 1. State
    const sampleState = {
        name: 'john' ,
        age: 6
    };

    // 2. Partial State Handlers
    class PartialHandlerA extends BaseStateManager {
        onH1Click(appState) {
            return { name: 'jane' }
        }
    }
    class PartialHandlerB extends BaseStateManager {
        onH2Click(appState) {
            return { age: 20 }
        }
    }
    const SampleStateHandler = BaseStateManager.join([PartialHandlerA, PartialHandlerB]);
    const sampleStateHandler = new SampleStateHandler()

    // 3. Root componennt
    const SampleComponent = ({ appState, appStateManager }) => {
        const { name, age } = appState;
        const { onH1Click, onH2Click } = appStateManager;
        return (
            <div>
                <h1 onClick={onH1Click}>{name}</h1>
                <br/>
                <h2 onClick={onH2Click}>{age}</h2>
            </div>
        );
    };

    // 4.Return a Wrapper Root component with Initialised with States and States Handlers
    const WrappedSampleComponent = StateHandle.init(
        SampleComponent,
        { root: [ sampleState, sampleStateHandler ]
    });
    return <WrappedSampleComponent />;
};