import { LibRule, HostRule, PathRule } from "../../model/rule";
import { IAddToDomArg } from "./type";

export class CodeRunnerHandle {
    //// RUNNER (CONSOLIDATE ALL INJECTORS)
    init(rules: HostRule[]): void {
        const { protocol, host, pathname } = document.location;
        rules.forEach(hostRule => {
            // Check & Run Host rule
            const { codeExecPhase, paths } = hostRule;
            const isMatchHost = this.isMatchHost(protocol, host, hostRule);
            if (!isMatchHost) return;
            this.applyRule(hostRule, codeExecPhase);

            // Check & Run path rules
            paths.forEach(pathRule => {
                const { codeExecPhase } = pathRule;
                const isMatchPath = this.isMatchPath(pathname, pathRule);
                if (!isMatchPath) return;
                this.applyRule(pathRule, codeExecPhase);
            });
        });
    }

    applyRule(rule: HostRule | PathRule, codeExecPhase: 0 | 1): void {
        codeExecPhase === 0
            ? this.applyRuleNow(rule)
            : this.applyRuleAtLoaded(rule);
    }

    applyRuleNow(rule: HostRule | PathRule): void {
        const {
            isJsOn, jsCode,
            isCssOn, cssCode,
            isLibOn, libs,
            id, isHost
        } = rule;

        isJsOn && this.injectJsCode(jsCode, id, isHost);
        isCssOn && this.injectCssCode(cssCode, id, isHost);
        isLibOn && this.injectLibs(libs, id, isHost);
    }

    applyRuleAtLoaded(rule: HostRule | PathRule): void {
        const callback = this.getOnWindowLoadCallback(rule);
        window.addEventListener('load', callback);
    }

    //// INJECTOR
    injectJsCode(code: string, id: string, isHost: boolean): void {
        const $js = document.createElement('script');
        $js.setAttribute('type', 'text/javascript')
        $js.innerHTML = code;
        this.addToDom({
            $code: $js,
            isHost,
            id,
            injectType: 'code',
            lang: 'js'
        });
    }

    injectCssCode(code: string, id: string, isHost: boolean): void {
        const $css = document.createElement('style');
        $css.setAttribute('type', 'text/css');
        $css.innerHTML = code;
        this.addToDom({
            $code: $css,
            isHost,
            id,
            injectType: 'code',
            lang: 'css'
        });
    }

    injectLibs(libs: LibRule[], id: string, isHost: boolean): void {
        const injectType = 'library';
        const $jsLibs = document.createDocumentFragment();
        const $cssLibs = document.createDocumentFragment();

        libs.forEach(lib => {
            const { isOn, type, value, isAsync } = lib;
            if (!isOn) return;
            type === 'js' && this.injectJsLib($jsLibs, value, isAsync);
            type === 'css' && this.injectCssLib($cssLibs, value);
        });
        $jsLibs.childElementCount && this.addToDom({
            $code: $jsLibs,
            isHost,
            id,
            injectType,
            lang: 'js'
        });
        $cssLibs.childElementCount && this.addToDom({
            $code: $cssLibs,
            isHost,
            id,
            injectType,
            lang: 'css'
        });
    }

    injectJsLib($wrapper: DocumentFragment, url: string, isAsync?: boolean): void {
        const $js = document.createElement('script');
        // const onLoad = () => {
        //     console.log(`Js Inject Success for ${url}`);
        //     $js.removeEventListener('load', onLoad);
        // };
        // $js.addEventListener('load', onLoad);
        $js.setAttribute('type', 'text/javascript')
        $js.setAttribute('src', url);
        $js.async = isAsync;
        $wrapper.appendChild($js);
    }

    injectCssLib($wrapper: DocumentFragment, url: string): void {
        const $css = document.createElement('link');
        // const onLoad = () => {
        //     console.log(`Css Inject Success for ${url}`);
        //     $css.removeEventListener('load', onLoad);
        // };
        // $css.addEventListener('load', onLoad);
        $css.setAttribute('rel', 'stylesheet')
        $css.setAttribute('href', url);
        $wrapper.appendChild($css);
    }

    addToDom({ $code, isHost, id, injectType, lang }: IAddToDomArg) {
        try {
            lang === 'js' && document.body.appendChild($code);
            lang === 'css' && document.head.appendChild($code);
        } catch (err) {
            const ruleType = isHost ? 'host' : 'path';
            const ERR_MSG = [
                `Rule Type: ${ruleType}`,
                `Rule ID: ${id}`,
                `Inject Type: ${injectType}`,
                `Language: ${lang}`,
                err
            ].join('\n')
            console.error(ERR_MSG);
        }
    }

    //// HELPER
    getOnWindowLoadCallback(rule: HostRule | PathRule): () => void {
        const onLoadCallback = () => {
            this.applyRuleNow(rule);
            window.removeEventListener('load', onLoadCallback);
        };
        return onLoadCallback;
    }

    isMatchHost(protocol: string, host: string, hostRule: HostRule): boolean {
        const { isHttps, value, isExactMatch } = hostRule;
        const isHostMatch = isExactMatch ? host === value : host.includes(value);
        const isProtocolMatch = this.isMatchProtocol(protocol, isHttps);
        return isHostMatch && isProtocolMatch;
    }

    isMatchPath(pathname: string, pathRule: PathRule): boolean {
        const { value, isExactMatch } = pathRule;
        return isExactMatch ? pathname === value : pathname.includes(value);
    }

    isMatchProtocol(protocol: string, isHttps: boolean): boolean {
        return isHttps ? protocol === 'https' : true;
    }
}

export const codeRunnerHandle = new CodeRunnerHandle();
