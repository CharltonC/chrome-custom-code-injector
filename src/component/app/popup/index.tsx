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
        const isAddHostDisabled = hostUrl === 'newtab'; // Disable for adding host/path when Chrome opens a new blank tab
        const isAddPathDisabled = isAddHostDisabled || !matchHost || pathname === '/';

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
                        clsSuffix="doc"
                        onClick={onOpenExtUserguide}
                        />
                    <IconBtn
                        icon="option"
                        theme="white"
                        clsSuffix="option"
                        onClick={() => onOpenExtOption()}
                        />
                </header>
                <main>
                    <section>
                        <h3>Host</h3>
                        {/*
                            `!!` is used to prevent React controlled/uncontrolled error in checkbox (SymbolSwitch component)
                            - when `matchHost` or `matchPath` is undefined, the e.g. `matchHost?.isJsOn` becomes undefined hence
                            equivalent to not passing any value to the props
                        */}
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
                            clsSuffix="host-edit"
                            onClick={() => onOpenExtOptionForEdit(hostIdCtx)}
                            /> :
                        <IconBtn
                            icon="add"
                            theme="gray"
                            clsSuffix="host-add"
                            disabled={isAddHostDisabled}
                            onClick={() => onOpenExtOptionForAddHost({ hostUrl })}
                            />}
                        <IconBtn
                            icon="delete"
                            theme="gray"
                            clsSuffix="host-delete"
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
                            clsSuffix="path-edit"
                            onClick={() => onOpenExtOptionForEdit(pathIdCtx)}
                            /> :
                        <IconBtn
                            icon="add"
                            theme="gray"
                            clsSuffix="path-add"
                            disabled={isAddPathDisabled}
                            onClick={() => onOpenExtOptionForAddPath({hostId, path :pathname})}
                            />}
                        <IconBtn
                            icon="delete"
                            theme="gray"
                            clsSuffix="path-delete"
                            disabled={!matchPath}
                            onClick={() => onDelHostOrPath(pathIdCtx)}
                            />
                    </section>
                </main>
            </div>
        );
    }
}
