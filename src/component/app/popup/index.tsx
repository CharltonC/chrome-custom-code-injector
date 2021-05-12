import React, { memo } from 'react';
import { IconBtn } from '../../base/btn-icon';
import { SymbolSwitch } from '../../base/checkbox-symbol-switch';
import { IProps } from './type';

export const PopupApp: React.FC<IProps> = memo((props: IProps) => {
    return (
        <div className="app app--popup">
            <header>
                <IconBtn icon="doc" theme="white" />
                <IconBtn icon="option" theme="white" />
            </header>
            <main>
                <section>
                    <h3>Host</h3>
                    {/* TODO - state: disabled, checked */}
                    <SymbolSwitch id="js-host" label="Js" />
                    <SymbolSwitch id="css-host" label="Css" />
                    <SymbolSwitch id="lib-host" label="Lib" />
                    <IconBtn icon="delete" theme="gray" />
                    {/* TODO - state: disabled, add or edit */}
                    <IconBtn icon="add" theme="gray" />
                </section>
                <section>
                    <h3>Path</h3>
                    <SymbolSwitch id="js-path" label="Js" />
                    <SymbolSwitch id="css-path" label="Css" />
                    <SymbolSwitch id="lib-path" label="Lib" />
                    <IconBtn icon="delete" theme="gray" />
                    <IconBtn icon="edit" theme="gray" />
                </section>
            </main>
        </div>
    );
});