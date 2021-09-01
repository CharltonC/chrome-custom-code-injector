import React from 'react';
import { MemoComponent } from '../../extendable/memo-component';
import { dataHandle } from '../../../handle/data';
import { IconBtn } from '../../base/btn-icon';
import { SymbolSwitch } from '../../base/checkbox-symbol-switch';
import { IProps } from './type';

export class PopupApp extends MemoComponent<IProps> {
    render() {
        const { appState, appStateHandle } = this.props;
        const { rules, url } = appState;

        const matchHost = dataHandle.getHostFromUrl(rules, url);
        const matchPath = dataHandle.getPathFromUrl(matchHost?.paths, url);
        const hostId = matchHost?.id;
        const pathId = matchPath?.id;
        const hostIdCtx = { hostId };
        const pathIdCtx = { ...hostIdCtx, pathId };

        const { host: hostUrl, pathname } = url;
        const isAddDisabled = hostUrl === 'newtab'; // Disable for adding host/path when Chrome opens a new blank tab

        const {
            onJsToggle,
            onCssToggle,
            onLibToggle,

            onOpenExtUserguide,
            onOpenExtOption,
            onOpenExtOptionForEdit,
            onOpenExtOptionForAddHost,
            onOpenExtOptionForAddPath,

            onDelHostOrPath,
        } = appStateHandle;

        return (
            <div className="app app--popup">
                <header>
                    <IconBtn
                        icon="doc"
                        theme="white"
                        onClick={onOpenExtUserguide}
                        />
                    <IconBtn
                        icon="option"
                        theme="white"
                        onClick={() => onOpenExtOption()}
                        />
                </header>
                <main>
                    <section>
                        <h3>Host</h3>
                        <SymbolSwitch
                            id="host-js"
                            label="Js"
                            disabled={!matchHost}
                            checked={!!matchHost?.isJsOn}
                            onChange={() => onJsToggle(hostIdCtx)}
                            />
                        <SymbolSwitch
                            id="host-css"
                            label="Css"
                            disabled={!matchHost}
                            checked={!!matchHost?.isCssOn}
                            onChange={() => onCssToggle(hostIdCtx)}
                            />
                        <SymbolSwitch
                            id="host-lib"
                            label="Lib"
                            disabled={!matchHost}
                            checked={!!matchHost?.isLibOn}
                            onChange={() => onLibToggle(hostIdCtx)}
                            />{ matchHost ?
                        <IconBtn
                            icon="edit"
                            theme="gray"
                            onClick={() => onOpenExtOptionForEdit(hostIdCtx)}
                            /> :
                        <IconBtn
                            icon="add"
                            theme="gray"
                            disabled={isAddDisabled}
                            onClick={() => onOpenExtOptionForAddHost({ hostUrl })}
                            />}
                        <IconBtn
                            icon="delete"
                            theme="gray"
                            disabled={!matchHost}
                            onClick={() => onDelHostOrPath(hostIdCtx)}
                            />
                    </section>
                    <section>
                        <h3>Path</h3>
                        <SymbolSwitch
                            id="path-js"
                            label="Js"
                            disabled={!matchPath}
                            checked={!!matchPath?.isJsOn}
                            onChange={() => onJsToggle(pathIdCtx)}
                            />
                        <SymbolSwitch
                            id="path-css"
                            label="Css"
                            disabled={!matchPath}
                            checked={!!matchPath?.isCssOn}
                            onChange={() => onCssToggle(pathIdCtx)}
                            />
                        <SymbolSwitch
                            id="path-lib"
                            label="Lib"
                            disabled={!matchPath}
                            checked={!!matchPath?.isLibOn}
                            onChange={() => onLibToggle(pathIdCtx)}
                            />{ matchPath ?
                        <IconBtn
                            icon="edit"
                            theme="gray"
                            onClick={() => onOpenExtOptionForEdit(pathIdCtx)}
                            /> :
                        <IconBtn
                            icon="add"
                            theme="gray"
                            disabled={isAddDisabled}
                            onClick={() => onOpenExtOptionForAddPath({hostId, path :pathname})}
                            />}
                        <IconBtn
                            icon="delete"
                            theme="gray"
                            disabled={!matchPath}
                            onClick={() => onDelHostOrPath(pathIdCtx)}
                            />
                    </section>
                </main>
            </div>
        );
    }
}
