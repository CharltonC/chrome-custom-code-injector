import { LibRuleConfig, HostRuleConfig, PathRuleConfig } from "../../data/model/rule-config";

export class RuleRunnerHandle {
    //// RUNNER (CONSOLIDATE ALL INJECTORS)
    init(rules: HostRuleConfig[]): void {
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

    applyRule(rule: HostRuleConfig | PathRuleConfig, codeExecPhase: 0 | 1): void {
        codeExecPhase === 0
            ? this.applyRuleNow(rule)
            : this.applyRuleAtLoaded(rule);
    }

    applyRuleNow(rule: HostRuleConfig | PathRuleConfig): void {
        const {
            isJsOn, jsCode,
            isCssOn, cssCode,
            isLibOn, libs,
        } = rule;

        isJsOn && this.injectJsCode(jsCode);
        isCssOn && this.injectCssCode(cssCode);
        isLibOn && this.injectLibs(libs);
    }

    applyRuleAtLoaded(rule: HostRuleConfig | PathRuleConfig): void {
        const callback = this.getOnWindowLoadCallback(rule);
        window.addEventListener('load', callback);
    }

    //// INJECTOR
    injectJsCode(code: string): void {
        const $js = document.createElement('script');
        $js.setAttribute('type', 'text/javascript')
        $js.innerHTML = code;
        document.body.appendChild($js);
    }

    injectCssCode(code: string): void {
        const $css = document.createElement('style');
        $css.setAttribute('type', 'text/css');
        $css.innerHTML = code;
        document.head.appendChild($css);
    }

    injectLibs(libs: LibRuleConfig[]): void {
        const { body } = document;
        const $jsLibs = document.createDocumentFragment();
        const $cssLibs = document.createDocumentFragment();

        libs.forEach(lib => {
            const { isOn, type, value, isAsync } = lib;
            if (!isOn) return;
            type === 'js'
                ? this.injectJsLib($jsLibs, value, isAsync)
                : this.injectCssLib($cssLibs, value);
        });

        if ($jsLibs.childElementCount) body.appendChild($jsLibs);
        if ($cssLibs.childElementCount) body.appendChild($cssLibs);
    }

    injectJsLib($wrapper: DocumentFragment, url: string, isAsync?: boolean): void {
        const $js = document.createElement('script');
        $js.setAttribute('type', 'text/javascript')
        $js.setAttribute('src', url);
        $js.async = isAsync;
        $wrapper.appendChild($js);
    }

    injectCssLib($wrapper: DocumentFragment, url: string): void {
        const $css = document.createElement('link');
        $css.setAttribute('type', 'text/stylesheet')
        $css.setAttribute('href', url);
        $wrapper.appendChild($css);
    }

    //// HELPER
    getOnWindowLoadCallback(rule: HostRuleConfig | PathRuleConfig): () => void {
        const onLoadCallback = () => {
            this.applyRuleNow(rule);
            window.removeEventListener('load', onLoadCallback);
        };
        return onLoadCallback;
    }

    isMatchHost(protocol: string, host: string, hostRule: HostRuleConfig): boolean {
        const { isHttps, value, isExactMatch } = hostRule;
        const isHostMatch = isExactMatch ? host === value : host.includes(value);
        const isProtocolMatch = isHttps ? protocol === 'https' : true;
        return isHostMatch && isProtocolMatch;
    }

    isMatchPath(pathname: string, pathRule: PathRuleConfig): boolean {
        const { value, isExactMatch } = pathRule;
        return isExactMatch ? pathname === value : pathname.includes(value);
    }
}

export const ruleRunnerHandle = new RuleRunnerHandle();
