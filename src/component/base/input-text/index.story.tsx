import React, { useState } from 'react';
import { TextInput } from '.';

export default {
    title: 'Base/Form - Input/Text',
    component: TextInput,
};

const defStyle = { padding: '20px', width: '500px', border: '1px solid gray'};

export const ExternalStateWithoutValidation = () => {
    const [ text, setText ] = useState('lorem sum');
    const onInputChange = ({val}) => setText(val);

    // Only re-render when text is valid
    return (
        <div style={defStyle} >
            <TextInput
                id="lorem2"
                placeholder="some text"
                defaultValue={text}
                onInputChange={onInputChange}
                />
        </div>
    );
};

export const ExternalStateWithValidationAndLabel = () => {
    const validationRules = [
        {rule: val => !!val, msg: 'must not be empty' },
        {rule: val => val.length >=3 , msg: 'must be more than or equal to 3 characters' },
        {rule: /(abc)/g , msg: 'must contain character `abc`'},
    ];
    const [ text, setText ] = useState('lorem sum');
    const [ validationState, setValidionState ] = useState({
        isValid: null,
        errMsg: [],
    });
    const onInputChange = ({ val, validState}) => {
        setText(val);
        setValidionState({ ...validState });
    };
    const onInputBlur = ({ validState}) => {
        setValidionState({ ...validState });
    };

    return (
        <div style={defStyle} >
            <TextInput
                id="lorem2"
                label="label"
                defaultValue={text}
                required
                onInputChange={onInputChange}
                onInputBlur={onInputBlur}
                validation={{
                    rules: validationRules,
                    isValid: validationState.isValid,
                    errMsg: validationState.errMsg,
                    fixedPosErrMsg: true,
                }}
                />
        </div>
    );
};