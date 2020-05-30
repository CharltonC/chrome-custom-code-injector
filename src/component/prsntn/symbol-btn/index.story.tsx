import React, { useState } from 'react';
import { SymbolBtn } from '.';

export default {
    title: 'Symbol Button',
    component: SymbolBtn,
};

export const JsSymbol = () => {
    // with state (2-way binding)
    const [ checked, setChecked ] = useState(true);
    const onChecked = () => setChecked(!checked);

    // w/o state
    const onChangeWoState = () => console.log('onChangeWoState');

    const mockProps = [
        {defaultChecked: true},
        {defaultChecked: checked, onChecked},
        {onChecked: onChangeWoState},
        {defaultChecked: true, disabled: true},
        {disabled: true}
    ];

    return (
        <>
            { mockProps.map((props, idx) => (
                <SymbolBtn
                    key={idx}
                    id={`js-${idx}`}
                    text="Js" {...props}
                    />
            )) }
        </>
    )
};


export const CssSymbol = () => {
    const mockProps = [
        {defaultChecked: true},
        {defaultChecked: true, disabled: true},
        {},
        {disabled: true}
    ];

    return (
        <>
            { mockProps.map((props, idx) => (
                <SymbolBtn
                    key={idx}
                    id={`css-${idx}`}
                    text="Css" {...props}
                    />
            )) }
        </>
    );
};

export const LibSymbol = () => {
    const mockProps = [
        {defaultChecked: true},
        {defaultChecked: true, disabled: true},
        {},
        {disabled: true}
    ];

    return (
        <>
            { mockProps.map((props, idx) => (
                <SymbolBtn
                    key={idx}
                    id={`lib-${idx}`}
                    text="Lib" {...props}
                    />
            )) }
        </>
    );
};