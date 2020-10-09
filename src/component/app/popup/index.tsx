import React, { memo } from 'react';
import { IconBtn } from '../../base/icon-btn';
import { SymbolBtn } from '../../base/symbol-btn';
import { IProps } from './type';

export const PopupApp: React.FC<IProps> = memo((props: IProps) => {
    return (
        <div className="view view--popup">
            <nav>
                <IconBtn icon="doc" theme="white" />
                <IconBtn icon="option" theme="white" />
            </nav>
            <main>
                <section>
                    <h3>Host</h3>
                    {/* TODO - state: disabled, checked */}
                    <SymbolBtn id="js-host" text="Js" />
                    <SymbolBtn id="css-host" text="Css" />
                    <SymbolBtn id="lib-host" text="Lib" />
                    <IconBtn icon="delete" theme="gray" />
                    {/* TODO - state: disabled, add or edit */}
                    <IconBtn icon="add" theme="gray" />
                </section>
                <section>
                    <h3>Path</h3>
                    <SymbolBtn id="js-path" text="Js" />
                    <SymbolBtn id="css-path" text="Css" />
                    <SymbolBtn id="lib-path" text="Lib" />
                    <IconBtn icon="delete" theme="gray" />
                    <IconBtn icon="edit" theme="gray" />
                </section>
            </main>
        </div>
    );
});