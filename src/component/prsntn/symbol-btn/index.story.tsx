import React, { useState } from 'react';
import { SymbolBtn } from '.';

export default {
    title: 'Symbol Button',
    component: SymbolBtn,
};

export const JsSymbol = () => {
    // 2-way binding
    const [ checked, setChecked ] = useState(true);
    const onChange = (evt: Event, isChecked: boolean) => setChecked(checked);
    const onChangeWoState = () => console.log('onChangeWoState');

    return (
        <>
            <SymbolBtn id="js-1" text="Js" />
            <SymbolBtn id="js-2" text="Js" defaultChecked />
            <SymbolBtn id="js-3" text="Js" defaultChecked={checked} onChange={onChange} />
            <SymbolBtn id="js-4" text="Js" onChange={onChangeWoState} />
            <SymbolBtn id="js-5" text="Js" defaultChecked={true} disabled />
            <SymbolBtn id="js-5" text="Js" disabled />
        </>
    )
};

/*
export const CssSymbol = () => (
    <>
        <SymbolBtn text="Css" defaultChecked />
        <SymbolBtn text="Css" defaultChecked disabled />
        <SymbolBtn text="Css" />
        <SymbolBtn text="Css" disabled />
    </>
);
export const LibSymbol = () => (
    <>
        <SymbolBtn text="Lib" defaultChecked />
        <SymbolBtn text="Lib" defaultChecked disabled />
        <SymbolBtn text="Lib" />
        <SymbolBtn text="Lib" disabled />
    </>
);
 */