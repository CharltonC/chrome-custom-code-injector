export class SettingState {
    showDeleteModal = true;
    resultsPerPageIdx: number = 0;
    defRuleConfig = {
        isHttps: false,
        isJsOn: false,
        isCssOn: false,
        isLibOn: false,
        jsExecPhase: 0
    };
}