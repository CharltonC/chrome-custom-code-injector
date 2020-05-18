import React from 'react';
import { SymbolBtn } from '.';

export default {
    title: 'Symbol Button',
    component: SymbolBtn,
};

export const JsSymbol = () => (
    <>
        <SymbolBtn text="Js" defaultChecked />
        <SymbolBtn text="Js" defaultChecked disabled />
        <SymbolBtn text="Js" />
        <SymbolBtn text="Js" disabled />
    </>
);

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
