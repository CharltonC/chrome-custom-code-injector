import React from 'react';
import { MemoComponent } from '../../extendable/memo-component';
import { IconBtn } from '../../base/btn-icon';
import { SymbolSwitch } from '../../base/checkbox-symbol-switch';
import { IProps } from './type';
import { dataHandle } from '../../../handle/data';

export class PopupApp extends MemoComponent<IProps> {
    render() {
        const { appState, appStateHandle } = this.props;
        const { rules, url, setting } = appState;
        setting.showDeleteModal = false;
        const matchHost = dataHandle.getHostFromUrl(rules, url);
        const matchPath = dataHandle.getPathFromUrl(matchHost?.paths, url);

        const hostId = matchHost?.id;
        const pathId = matchPath?.id;
        const hostIdCtx = { hostId };
        const pathIdCtx = { ...hostIdCtx, pathId };

        const {
            onJsToggle,
            onCssToggle,
            onLibToggle,

            onOpenExtUserguide,
            onOpenExtOption,
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
                        onClick={onOpenExtOption}
                        />
                </header>
                <main>
                    <section>
                        <h3>Host</h3>
                        <SymbolSwitch
                            id="host-js"
                            label="Js"
                            disabled={!matchHost}
                            checked={matchHost?.isJsOn}
                            onChange={() => onJsToggle(hostIdCtx)}
                            />
                        <SymbolSwitch
                            id="host-css"
                            label="Css"
                            disabled={!matchHost}
                            checked={matchHost?.isCssOn}
                            onChange={() => onCssToggle(hostIdCtx)}
                            />
                        <SymbolSwitch
                            id="host-lib"
                            label="Lib"
                            disabled={!matchHost}
                            checked={matchHost?.isLibOn}
                            onChange={() => onLibToggle(hostIdCtx)}
                            />
                        <IconBtn
                            icon="edit"
                            theme="gray"
                            disabled={!matchPath}
                            onClick={() => onOpenExtOption(hostIdCtx)}
                            />
                    </section>
                    <section>
                        <h3>Path</h3>
                        <SymbolSwitch
                            id="path-js"
                            label="Js"
                            disabled={!matchPath}
                            checked={matchPath?.isJsOn}
                            onChange={() => onJsToggle(pathIdCtx)}
                            />
                        <SymbolSwitch
                            id="path-css"
                            label="Css"
                            disabled={!matchPath}
                            checked={matchPath?.isCssOn}
                            onChange={() => onCssToggle(pathIdCtx)}
                            />
                        <SymbolSwitch
                            id="path-lib"
                            label="Lib"
                            disabled={!matchPath}
                            checked={matchPath?.isLibOn}
                            onChange={() => onLibToggle(pathIdCtx)}
                            />
                        <IconBtn
                            icon="edit"
                            theme="gray"
                            disabled={!matchPath}
                            onClick={() => onOpenExtOption(pathIdCtx)}
                            />
                    </section>
                </main>
            </div>
        );
    }
}
